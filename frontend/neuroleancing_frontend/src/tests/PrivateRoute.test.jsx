import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PrivateRoute from '../components/routing/PrivateRoute';

const renderWithAuth = (user, loading = false) =>
    render(
        <AuthContext.Provider value={{ user, loading }}>
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/dashboard" element={
                        <PrivateRoute><div>Dashboard</div></PrivateRoute>
                    } />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );

describe('PrivateRoute', () => {
    it('renders children when user is authenticated', () => {
        renderWithAuth({ name: 'Alice', token: 'tok' });
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('redirects to /login when user is null', () => {
        renderWithAuth(null);
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('shows loading state while auth is resolving', () => {
        renderWithAuth(null, true);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
