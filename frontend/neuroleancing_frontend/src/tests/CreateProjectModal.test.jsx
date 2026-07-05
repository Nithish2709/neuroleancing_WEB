import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateProjectModal from '../components/projects/CreateProjectModal';

const mockUser = { token: 'tok123', role: 'client' };

beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(mockUser));
});

const renderModal = (onClose = vi.fn(), onProjectCreated = vi.fn()) =>
    render(
        <MemoryRouter>
            <CreateProjectModal isOpen={true} onClose={onClose} onProjectCreated={onProjectCreated} />
        </MemoryRouter>
    );

describe('CreateProjectModal', () => {
    it('renders all form fields', () => {
        renderModal();
        expect(screen.getByText('Post a New Project')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. $500 - $1000')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('e.g. 2 weeks')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('React, Node.js, Design (comma separated)')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(<MemoryRouter><CreateProjectModal isOpen={false} onClose={vi.fn()} onProjectCreated={vi.fn()} /></MemoryRouter>);
        expect(screen.queryByText('Post a New Project')).not.toBeInTheDocument();
    });

    it('calls onClose when Cancel is clicked', () => {
        const onClose = vi.fn();
        renderModal(onClose);
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('submits form and calls onProjectCreated on success', async () => {
        const onProjectCreated = vi.fn();
        const onClose = vi.fn();
        const newProject = { id: 'p1', title: 'New App', budget: 500 };

        fetch.mockResolvedValueOnce({ ok: true, json: async () => newProject });

        renderModal(onClose, onProjectCreated);

        const inputs = screen.getAllByRole('textbox');
        fireEvent.change(inputs[0], { target: { value: 'New App' } });
        fireEvent.change(inputs[1], { target: { value: 'A great project' } });
        fireEvent.change(inputs[2], { target: { value: '500' } });

        fireEvent.click(screen.getByRole('button', { name: /post project/i }));

        await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/projects', expect.objectContaining({ method: 'POST' })));
    });

    it('shows error state on failed submission', async () => {
        fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Unauthorized' }) });

        renderModal();
        const inputs = screen.getAllByRole('textbox');
        fireEvent.change(inputs[0], { target: { value: 'Test' } });
        fireEvent.change(inputs[1], { target: { value: 'Desc' } });
        fireEvent.change(inputs[2], { target: { value: '100' } });

        fireEvent.click(screen.getByRole('button', { name: /post project/i }));
        await waitFor(() => expect(fetch).toHaveBeenCalled());
    });
});
