import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Projects from '../pages/Projects';

const mockProjects = [
    { id: '1', _id: '1', title: 'React Dashboard', description: 'Build a dashboard', budget: 500, status: 'open', skillsRequired: ['React'], client: { name: 'Alice' }, createdAt: new Date().toISOString() },
    { id: '2', _id: '2', title: 'Node API', description: 'Build a REST API', budget: 800, status: 'open', skillsRequired: ['Node.js'], client: { name: 'Bob' }, createdAt: new Date().toISOString() },
    { id: '3', _id: '3', title: 'Old Project', description: 'Completed work', budget: 300, status: 'completed', skillsRequired: [], client: { name: 'Carol' }, createdAt: new Date().toISOString() },
];

describe('Projects Page', () => {
    it('shows loading skeleton initially', () => {
        fetch.mockReturnValueOnce(new Promise(() => {}));
        const { container } = render(<MemoryRouter><Projects /></MemoryRouter>);
        expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
    });

    it('renders project cards after fetch', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => mockProjects });
        render(<MemoryRouter><Projects /></MemoryRouter>);
        await waitFor(() => expect(screen.getByText('React Dashboard')).toBeInTheDocument());
        expect(screen.getByText('Node API')).toBeInTheDocument();
    });

    it('only shows open projects', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => mockProjects });
        render(<MemoryRouter><Projects /></MemoryRouter>);
        await waitFor(() => screen.getByText('React Dashboard'));
        expect(screen.queryByText('Old Project')).not.toBeInTheDocument();
    });

    it('filters projects by search term', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => mockProjects });
        render(<MemoryRouter><Projects /></MemoryRouter>);
        await waitFor(() => screen.getByText('React Dashboard'));

        fireEvent.change(screen.getByPlaceholderText(/search projects/i), { target: { value: 'Node' } });
        expect(screen.queryByText('React Dashboard')).not.toBeInTheDocument();
        expect(screen.getByText('Node API')).toBeInTheDocument();
    });

    it('shows empty state when no projects match', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => mockProjects });
        render(<MemoryRouter><Projects /></MemoryRouter>);
        await waitFor(() => screen.getByText('React Dashboard'));

        fireEvent.change(screen.getByPlaceholderText(/search projects/i), { target: { value: 'zzznomatch' } });
        expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    });

    it('shows error message on fetch failure', async () => {
        fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Server error' }) });
        render(<MemoryRouter><Projects /></MemoryRouter>);
        await waitFor(() => expect(screen.getByText('Server error')).toBeInTheDocument());
    });
});
