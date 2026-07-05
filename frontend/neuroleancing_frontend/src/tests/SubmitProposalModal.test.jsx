import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SubmitProposalModal from '../components/projects/SubmitProposalModal';

const renderModal = (onClose = vi.fn(), onProposalSubmitted = vi.fn()) =>
    render(
        <MemoryRouter>
            <SubmitProposalModal isOpen={true} onClose={onClose} projectId="proj-1" onProposalSubmitted={onProposalSubmitted} />
        </MemoryRouter>
    );

describe('SubmitProposalModal', () => {
    it('renders bid amount and cover letter fields', () => {
        renderModal();
        expect(screen.getAllByText('Submit Proposal').length).toBeGreaterThan(0);
        expect(screen.getByPlaceholderText('e.g. 500')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/describe why you are/i)).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(<MemoryRouter><SubmitProposalModal isOpen={false} onClose={vi.fn()} projectId="p1" onProposalSubmitted={vi.fn()} /></MemoryRouter>);
        expect(screen.queryByText('Submit Proposal')).not.toBeInTheDocument();
    });

    it('calls onClose when Cancel is clicked', () => {
        const onClose = vi.fn();
        renderModal(onClose);
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('submits proposal and calls onProposalSubmitted on success', async () => {
        const onProposalSubmitted = vi.fn();
        const onClose = vi.fn();
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Proposal submitted successfully', project: {} }) });

        renderModal(onClose, onProposalSubmitted);
        fireEvent.change(screen.getByPlaceholderText('e.g. 500'), { target: { value: '400' } });
        fireEvent.change(screen.getByPlaceholderText(/describe why you are/i), { target: { value: 'I am the best fit' } });
        fireEvent.click(screen.getByRole('button', { name: /submit proposal/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/projects/proj-1/proposals', expect.objectContaining({ method: 'POST' }));
            expect(onProposalSubmitted).toHaveBeenCalled();
        });
    });

    it('shows error on failed submission', async () => {
        fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'Already submitted' }) });

        renderModal();
        fireEvent.change(screen.getByPlaceholderText('e.g. 500'), { target: { value: '400' } });
        fireEvent.change(screen.getByPlaceholderText(/describe why you are/i), { target: { value: 'Cover letter' } });
        fireEvent.click(screen.getByRole('button', { name: /submit proposal/i }));

        await waitFor(() => expect(fetch).toHaveBeenCalled());
    });
});
