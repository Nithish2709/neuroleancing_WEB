import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, MessageCircle, ArrowLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { getInbox, getConversation, sendMessage } from '../api';

const Messaging = () => {
    const { userId } = useParams();
    const { user: authUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [activeConvo, setActiveConvo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [sending, setSending] = useState(false);
    const [loadingInbox, setLoadingInbox] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [search, setSearch] = useState('');
    // FIX 18 — mobile: show either list or chat
    const [showChat, setShowChat] = useState(false);
    const bottomRef = useRef(null);

    const uid = authUser?.id;

    useEffect(() => {
        getInbox()
            .then(data => setConversations(Array.isArray(data) ? data : []))
            .catch(err => toast.error('Failed to load inbox: ' + err.message))
            .finally(() => setLoadingInbox(false));
    }, []);

    useEffect(() => {
        if (userId) openConversation(userId);
    }, [userId]); // eslint-disable-line

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // FIX 21 — poll messages every 4s when conversation is open
    useEffect(() => {
        if (!activeConvo) return;
        const poll = setInterval(() => {
            getConversation(activeConvo.id)
                .then(data => setMessages(data.messages || []))
                .catch(() => {});
        }, 4000);
        return () => clearInterval(poll);
    }, [activeConvo]);

    const openConversation = async (otherUserId) => {
        setLoadingMsgs(true);
        try {
            const data = await getConversation(otherUserId);
            setActiveConvo(data.otherUser);
            setMessages(data.messages || []);
            setConversations(prev => prev.map(c => c.user.id === otherUserId ? { ...c, unread: 0 } : c));
            navigate(`/messages/${otherUserId}`, { replace: true });
            setShowChat(true); // FIX 18 — switch to chat on mobile
        } catch (err) {
            toast.error('Failed to load conversation: ' + err.message);
        } finally {
            setLoadingMsgs(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !activeConvo) return;
        setSending(true);
        try {
            const data = await sendMessage(activeConvo.id, { content: newMsg.trim() });
            setMessages(prev => [...prev, data]);
            setNewMsg('');
            setConversations(prev => {
                const exists = prev.find(c => c.user.id === activeConvo.id);
                if (exists) return prev.map(c => c.user.id === activeConvo.id ? { ...c, lastMessage: data } : c);
                return [{ user: activeConvo, lastMessage: data, unread: 0 }, ...prev];
            });
        } catch (err) {
            toast.error('Failed to send: ' + err.message);
        } finally {
            setSending(false);
        }
    };

    const filteredConvos = conversations.filter(c =>
        c.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const formatDate = (ts) => ts ? new Date(ts).toLocaleDateString() : '';

    return (
        <div className="min-h-screen py-6 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.h1 className="text-2xl font-black mb-6 flex items-center gap-2"
                    style={{ color: 'var(--text-loud)' }}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <MessageCircle className="h-6 w-6" style={{ color: 'var(--sky)' }} />
                    Messages
                </motion.h1>

                <motion.div className="card overflow-hidden flex" style={{ height: '70vh' }}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

                    {/* FIX 18 — Conversation list: hidden on mobile when chat is open */}
                    <div className={`flex-shrink-0 flex-col ${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-72 lg:w-80`}
                        style={{ borderRight: '1px solid var(--border-subtle)' }}>
                        <div className="p-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                                <input type="text" placeholder="Search conversations…" value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="input-base py-2 pl-9 pr-3 text-sm" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {loadingInbox ? (
                                <div className="p-4 space-y-3">
                                    {[1,2,3].map(i => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="skeleton h-10 w-10 rounded-full flex-shrink-0" />
                                            <div className="flex-1 space-y-1.5">
                                                <div className="skeleton h-3 w-3/4 rounded" />
                                                <div className="skeleton h-3 w-1/2 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredConvos.length === 0 ? (
                                <div className="p-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No conversations yet</div>
                            ) : filteredConvos.map(({ user: other, lastMessage, unread }) => (
                                <motion.button key={other.id} onClick={() => openConversation(other.id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                                    style={{
                                        borderBottom: '1px solid var(--border-subtle)',
                                        background: activeConvo?.id === other.id ? 'rgba(14,165,233,0.08)' : 'transparent',
                                        borderLeft: activeConvo?.id === other.id ? '2px solid var(--sky)' : '2px solid transparent',
                                    }}
                                    whileHover={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <div className="relative flex-shrink-0">
                                        {other.profileImage
                                            ? <img src={other.profileImage} alt={other.name} className="h-10 w-10 rounded-full object-cover" />
                                            : <div className="h-10 w-10 rounded-full flex items-center justify-center"
                                                style={{ background: 'var(--grad-sky)', boxShadow: '0 0 8px var(--sky-glow)' }}>
                                                <span className="text-sm font-bold text-white">{other.name?.charAt(0).toUpperCase()}</span>
                                              </div>
                                        }
                                        {unread > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full text-white text-[10px] font-bold notif-badge"
                                                style={{ background: 'var(--violet)', boxShadow: '0 0 8px var(--violet-glow)' }}>
                                                {unread}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm truncate font-medium"
                                                style={{ color: unread > 0 ? 'var(--text-loud)' : 'var(--text-secondary)', fontWeight: unread > 0 ? 600 : 500 }}>
                                                {other.name}
                                            </p>
                                            <span className="text-xs flex-shrink-0 ml-1" style={{ color: 'var(--text-muted)' }}>
                                                {formatTime(lastMessage?.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                            {lastMessage?.senderId === uid ? 'You: ' : ''}{lastMessage?.content || ''}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* FIX 18 — Chat window: hidden on mobile when list is shown */}
                    <div className={`flex-1 flex-col min-w-0 ${showChat ? 'flex' : 'hidden md:flex'}`}>
                        {activeConvo ? (
                            <>
                                <div className="px-5 py-3 flex items-center gap-3"
                                    style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}>
                                    {/* FIX 18 — back button on mobile */}
                                    <button onClick={() => { setShowChat(false); setActiveConvo(null); setMessages([]); navigate('/messages'); }}
                                        className="md:hidden p-1 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                                        style={{ color: 'var(--sky)' }}>
                                        <ArrowLeft className="h-4 w-4" />Back
                                    </button>
                                    {activeConvo.profileImage
                                        ? <img src={activeConvo.profileImage} alt={activeConvo.name} className="h-9 w-9 rounded-full object-cover" />
                                        : <div className="h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'var(--grad-sky)', boxShadow: '0 0 8px var(--sky-glow)' }}>
                                            <span className="text-sm font-bold text-white">{activeConvo.name?.charAt(0).toUpperCase()}</span>
                                          </div>
                                    }
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: 'var(--text-loud)' }}>{activeConvo.name}</p>
                                        <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{activeConvo.role}</p>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ background: 'rgba(0,0,0,0.06)' }}>
                                    {loadingMsgs ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
                                                style={{ borderColor: 'var(--sky)', borderTopColor: 'transparent' }} />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--text-muted)' }}>
                                            <MessageCircle className="h-10 w-10 mb-2" />
                                            <p className="text-sm">No messages yet. Say hello!</p>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((msg, idx) => {
                                                const isMine = msg.senderId === uid || msg.sender?.id === uid;
                                                const showDate = idx === 0 || formatDate(messages[idx - 1]?.createdAt) !== formatDate(msg.createdAt);
                                                return (
                                                    <React.Fragment key={msg.id}>
                                                        {showDate && (
                                                            <div className="text-center">
                                                                <span className="text-xs px-3 py-1 rounded-full"
                                                                    style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                                                                    {formatDate(msg.createdAt)}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <motion.div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            transition={{ duration: 0.18 }}>
                                                            <div className="max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                                                                style={isMine ? {
                                                                    background: 'var(--grad-sky)',
                                                                    color: 'white',
                                                                    borderBottomRightRadius: '4px',
                                                                    boxShadow: '0 4px 15px var(--sky-glow)',
                                                                } : {
                                                                    background: 'var(--bg-elevated)',
                                                                    color: 'var(--text-primary)',
                                                                    border: '1px solid var(--border-default)',
                                                                    borderBottomLeftRadius: '4px',
                                                                }}>
                                                                <p>{msg.content}</p>
                                                                <p className="text-xs mt-1" style={{ color: isMine ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>
                                                                    {formatTime(msg.createdAt)}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    </React.Fragment>
                                                );
                                            })}
                                            <div ref={bottomRef} />
                                        </>
                                    )}
                                </div>

                                <form onSubmit={handleSend} className="px-4 py-3 flex items-center gap-3"
                                    style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.1)' }}>
                                    <input type="text" value={newMsg} onChange={e => setNewMsg(e.target.value)}
                                        placeholder="Type a message…" className="flex-1 input-base py-2.5 px-3 text-sm" disabled={sending} />
                                    <motion.button type="submit" disabled={sending || !newMsg.trim()}
                                        className="h-10 w-10 rounded-xl btn-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        {sending
                                            ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <Send className="h-4 w-4" />
                                        }
                                    </motion.button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.06)' }}>
                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                                    <MessageCircle className="h-14 w-14 mb-4" style={{ color: 'var(--text-muted)' }} />
                                </motion.div>
                                <p className="text-base font-semibold" style={{ color: 'var(--text-loud)' }}>Select a conversation</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Choose from your inbox or start a new chat</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Messaging;
