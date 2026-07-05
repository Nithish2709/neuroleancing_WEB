import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/layout/Navbar';

vi.mock('../context/DarkModeContext', () => ({
    useDarkMode: () => ({ dark: false, toggle: vi.fn() }),
}));

vi.mock('../components/common/NotificationBell', () => ({
    default: () => null,
}));

const renderNavbar = (user = null) => {
    const logout = vi.fn();
    render(
        <AuthContext.Provider value={{ user, logout }}>
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        </AuthContext.Provider>
    );
    return { logout };
};

describe('Navbar', () => {
    it('shows Login and Sign up links when logged out', () => {
        renderNavbar(null);
        expect(screen.getAllByText('Log in').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Sign up').length).toBeGreaterThan(0);
    });

    it('shows Dashboard and Logout when logged in', () => {
        renderNavbar({ name: 'Alice', role: 'client', token: 'tok' });
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Logout').length).toBeGreaterThan(0);
    });

    it('hides Hire Freelancers link for freelancer role', () => {
        renderNavbar({ name: 'Bob', role: 'freelancer', token: 'tok' });
        expect(screen.queryByText('Hire Freelancers')).not.toBeInTheDocument();
    });

    it('shows Hire Freelancers link for client role', () => {
        renderNavbar({ name: 'Alice', role: 'client', token: 'tok' });
        expect(screen.getAllByText('Hire Freelancers').length).toBeGreaterThan(0);
    });

    it('calls logout when Logout button is clicked', () => {
        const { logout } = renderNavbar({ name: 'Alice', role: 'client', token: 'tok' });
        fireEvent.click(screen.getAllByText('Logout')[0]);
        expect(logout).toHaveBeenCalled();
    });

    it('toggles mobile menu on hamburger click', () => {
        renderNavbar({ name: 'Alice', role: 'client', token: 'tok' });
        const menuBtn = screen.getByRole('button', { name: /open main menu/i });
        fireEvent.click(menuBtn);
        expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(1);
    });
});
