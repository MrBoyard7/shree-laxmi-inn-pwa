import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner, EmptyState, SectionTitle, CategoryChip } from '../Misc';

describe('LoadingSpinner', () => {
  it('uses the default label when none is given', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('shows a custom label when given', () => {
    render(<LoadingSpinner label="Loading temples…" />);
    expect(screen.getByText('Loading temples…')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders the title alone when no description is given', () => {
    render(<EmptyState title="No temples yet" />);
    expect(screen.getByText('No temples yet')).toBeInTheDocument();
  });

  it('renders the description when given', () => {
    render(<EmptyState title="No temples yet" description="Add one from the Admin Panel." />);
    expect(screen.getByText('Add one from the Admin Panel.')).toBeInTheDocument();
  });
});

describe('SectionTitle', () => {
  it('renders the title alone when no eyebrow is given', () => {
    render(<SectionTitle title="Darshan Routes" />);
    expect(screen.getByText('Darshan Routes')).toBeInTheDocument();
  });

  it('renders the eyebrow when given', () => {
    render(<SectionTitle eyebrow="Plan ahead" title="Darshan Routes" />);
    expect(screen.getByText('Plan ahead')).toBeInTheDocument();
  });
});

describe('CategoryChip', () => {
  it('renders the label', () => {
    render(<CategoryChip label="Major Temple" />);
    expect(screen.getByText('Major Temple')).toBeInTheDocument();
  });
});
