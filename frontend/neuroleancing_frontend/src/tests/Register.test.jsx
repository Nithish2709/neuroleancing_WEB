import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../pages/Register';

const renderRegister = () =>
    render(<MemoryRouter><Register /></MemoryRouter>);

describe('Register Page', () => {
    it('renders role toggle buttons', () => {
        renderRegister();
        expect(screen.getByText("I'm a Freelancer")).toBeInTheDocument();
        expect(screen.getByText("I'm a Client")).toBeInTheDocument();
    });

    it('shows freelancer-specific fields by default', () => {
        renderRegister();
        expect(screen.getByPlaceholderText('React, Node.js, Design')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('5 years as a Web Developer')).toBeInTheDocument();
    });

    it('shows client-specific fields when client is selected', () => {
        renderRegister();
        fireEvent.click(screen.getByText("I'm a Client"));
        expect(screen.getByPlaceholderText('ACME Inc.')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('What kind of projects are you looking to post?')).toBeInTheDocument();
    });

    it('hides freelancer fields when client is selected', () => {
        renderRegister();
        fireEvent.click(screen.getByText("I'm a Client"));
        expect(screen.queryByPlaceholderText('React, Node.js, Design')).not.toBeInTheDocument();
    });

    it('calls fetch with correct payload on freelancer registration', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: 'Registered' })
        });

        renderRegister();
        fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'Jane Dev' } });
        fireEvent.change(screen.getByPlaceholderText('you@example.com'), { target: { value: 'jane@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('+1 (555) 000-0000'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('React, Node.js, Design'), { target: { value: 'React, Node.js' } });
        fireEvent.change(screen.getByPlaceholderText('5 years as a Web Developer'), { target: { value: '3 years' } });
        fireEvent.change(screen.getByPlaceholderText('https://portfolio.com'), { target: { value: 'https://jane.dev' } });
        fireEvent.change(screen.getByPlaceholderText('Tell us about yourself...'), { target: { value: 'I am a dev' } });

        const passwordFields = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordFields[0], { target: { value: 'pass1234' } });
        fireEvent.change(passwordFields[1], { target: { value: 'pass1234' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('"role":"freelancer"')
            }));
        });
    });

    it('does not submit when passwords do not match', async () => {
        renderRegister();
        const passwordFields = screen.getAllByPlaceholderText('••••••••');
        fireEvent.change(passwordFields[0], { target: { value: 'pass1234' } });
        fireEvent.change(passwordFields[1], { target: { value: 'different' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => expect(fetch).not.toHaveBeenCalled());
    });
});
