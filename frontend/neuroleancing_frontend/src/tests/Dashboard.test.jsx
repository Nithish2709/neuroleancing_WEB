import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';

const clientUser = { _id: 'client-1', name: 'Alice', role: 'client', token: 'tok' };
const freelancerUser = { _id: 'freelancer-1', name: 'Bob', role: 'freelancer', token: 'tok' };

const mockProfile = { totalSpent: 1200, totalEarnings: 0, jobsCompleted: 0, newMessages: 3, skills: ['React'], companyName: 'ACME', projectInterests: 'Web apps' };
const mockProjects = [
    { id: 'p1', _id: 'p1', title: 'My Project', description: 'desc', budget: 500, status: 'open', client: { _id: 'client-1' }, proposals: [], createdAt: new Date().toISOString() }
];

const renderDashboard = (user) => {
    fetch
        .mockResolvedValueOnce({ ok: true, json: async () => mockProfile })
        .mockResolvedValueOnce({ ok: true, json: async () => mockProjects });

    return render(
        <AuthContext.Provider value={{ user }}>
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        </AuthContext.Provider>
    );
};

describe('Dashboard Page', () => {
    it('renders welcome message with user name', async () => {
        renderDashboard(clientUser);
        await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    });

    it('shows Post a Project button for clients', async () => {
        renderDashboard(clientUser);
        await waitFor(() => expect(screen.getByText('Post a Project')).toBeInTheDocument());
    });

    it('does not show Post a Project button for freelancers', async () => {
        renderDashboard(freelancerUser);
        await waitFor(() => screen.getByText('Bob'));
        expect(screen.queryByText('Post a Project')).not.toBeInTheDocument();
    });

    it('shows Total Spent stat for clients', async () => {
        renderDashboard(clientUser);
        await waitFor(() => expect(screen.getByText('Total Spent')).toBeInTheDocument());
    });

    it('shows Total Earnings stat for freelancers', async () => {
        renderDashboard(freelancerUser);
        await waitFor(() => expect(screen.getByText('Total Earnings')).toBeInTheDocument());
    });

    it('renders project in project history', async () => {
        renderDashboard(clientUser);
        await waitFor(() => expect(screen.getByText('My Project')).toBeInTheDocument());
    });

    it('shows empty project history message when no projects', async () => {
        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => mockProfile })
            .mockResolvedValueOnce({ ok: true, json: async () => [] });

        render(
            <AuthContext.Provider value={{ user: clientUser }}>
                <MemoryRouter><Dashboard /></MemoryRouter>
            </AuthContext.Provider>
        );
        await waitFor(() => expect(screen.getByText(/no projects found/i)).toBeInTheDocument());
    });

    it('shows Your Skills section for freelancers', async () => {
        renderDashboard(freelancerUser);
        await waitFor(() => expect(screen.getByText('Your Skills')).toBeInTheDocument());
    });

    it('shows Company Info section for clients', async () => {
        renderDashboard(clientUser);
        await waitFor(() => expect(screen.getByText('Company Info')).toBeInTheDocument());
    });
});
