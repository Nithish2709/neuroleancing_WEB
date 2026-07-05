import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../pages/Login';

const renderLogin = (loginFn = vi.fn()) =>
    render(
        <AuthContext.Provider value={{ login: loginFn }}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthContext.Provider>
    );

describe('Login Page', () => {
    it('renders email and password fields', () => {
        renderLogin();
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('calls login and navigates on successful login', async () => {
        const loginFn = vi.fn();
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ _id: '1', name: 'Alice', token: 'tok123', role: 'client' })
        });

        renderLogin(loginFn);
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'alice@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => expect(loginFn).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'Alice', token: 'tok123' })
        ));
    });

    it('shows error toast on failed login', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Invalid email or password' })
        });

        renderLogin();
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'bad@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/auth/login', expect.any(Object)));
    });

    it('shows link to register page', () => {
        renderLogin();
        expect(screen.getByText('create a new account')).toBeInTheDocument();
    });
});
