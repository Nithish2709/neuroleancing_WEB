import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Freelancers from '../pages/Freelancers';

const mockFreelancers = [
    { id: '1', _id: '1', name: 'Jane Dev', title: 'Full Stack Developer', skills: ['React', 'Node.js'], rating: 4.9, jobsCompleted: 12, location: 'NYC', profileImage: '' },
    { id: '2', _id: '2', name: 'John Design', title: 'UI/UX Designer', skills: ['Figma', 'CSS'], rating: 4.7, jobsCompleted: 8, location: 'LA', profileImage: '' },
];

describe('Freelancers Page', () => {
    it('shows loading skeleton initially', () => {
        fetch.mockReturnValueOnce(new Promise(() => {}));
        const { container } = render(<MemoryRouter><Freelancers /></MemoryRouter>);
        expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);
    });

    it('renders freelancer cards after fetch', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => mockFreelancers });
        render(<MemoryRouter><Freelancers /></MemoryRouter>);
        await waitFor(() => expect(screen.getByText('Jane Dev')).toBeInTheDocument());
        expect(screen.getByText('John Design')).toBeInTheDocument();
    });

    it('shows empty state when no freelancers', async () => {
        fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
        render(<MemoryRouter><Freelancers /></MemoryRouter>);
        await waitFor(() => expect(screen.getByText(/no freelancers found/i)).toBeInTheDocument());
    });

    it('shows error message on fetch failure', async () => {
        fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Failed to load' }) });
        render(<MemoryRouter><Freelancers /></MemoryRouter>);
        await waitFor(() => expect(screen.getByText('Failed to load')).toBeInTheDocument());
    });
});
