import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuickActionButton from '../QuickActionButton';

describe('QuickActionButton', () => {
  it('renders as a plain link by default', () => {
    render(<QuickActionButton href="tel:+911234567890" icon={<span />} label="Call" />);
    const link = screen.getByText('Call').closest('a');
    expect(link).toHaveAttribute('href', 'tel:+911234567890');
    expect(link).not.toHaveAttribute('target');
  });

  it('adds target and rel when external is true', () => {
    render(
      <QuickActionButton
        href="https://wa.me/911234567890"
        icon={<span />}
        label="WhatsApp"
        external
      />,
    );
    const link = screen.getByText('WhatsApp').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders as a button and fires onClick when provided instead of href', async () => {
    const user = userEvent.setup({ delay: null });
    const handleClick = vi.fn();
    render(<QuickActionButton onClick={handleClick} icon={<span />} label="Sign out" />);

    const button = screen.getByRole('button', { name: 'Sign out' });
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
