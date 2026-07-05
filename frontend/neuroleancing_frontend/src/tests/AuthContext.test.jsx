import { render, screen, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const Consumer = () => {
    const { user, login, logout, loading } = useContext(AuthContext);
    return (
        <div>
            <span data-testid="loading">{String(loading)}</span>
            <span data-testid="user">{user ? user.name : 'null'}</span>
            <button onClick={() => login({ name: 'Alice', token: 'tok123', _id: '1' })}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    it('starts with no user and loading false after mount', async () => {
        render(<AuthProvider><Consumer /></AuthProvider>);
        expect(await screen.findByTestId('user')).toHaveTextContent('null');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('login sets user in context and localStorage', async () => {
        const { getByText, getByTestId } = render(<AuthProvider><Consumer /></AuthProvider>);
        await act(async () => { getByText('Login').click(); });
        expect(getByTestId('user')).toHaveTextContent('Alice');
        expect(JSON.parse(localStorage.getItem('user')).name).toBe('Alice');
    });

    it('logout clears user from context and localStorage', async () => {
        const { getByText, getByTestId } = render(<AuthProvider><Consumer /></AuthProvider>);
        await act(async () => { getByText('Login').click(); });
        await act(async () => { getByText('Logout').click(); });
        expect(getByTestId('user')).toHaveTextContent('null');
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('restores user from localStorage on mount', async () => {
        localStorage.setItem('user', JSON.stringify({ name: 'Bob', token: 'tok456', _id: '2' }));
        render(<AuthProvider><Consumer /></AuthProvider>);
        expect(await screen.findByTestId('user')).toHaveTextContent('Bob');
    });
});
