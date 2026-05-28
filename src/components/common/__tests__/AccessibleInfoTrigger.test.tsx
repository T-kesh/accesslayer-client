import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AccessibleInfoTrigger from '@/components/common/AccessibleInfoTrigger';

// ---------------------------------------------------------------------------
// #290 — Accessible tooltip trigger for creator metric explanations
// ---------------------------------------------------------------------------

describe('AccessibleInfoTrigger', () => {
	it('renders a focusable button with a screen-reader label', () => {
		render(
			<AccessibleInfoTrigger
				explanation="Verified by Access Layer."
				label="Explanation for Status"
			/>
		);
		const button = screen.getByRole('button', {
			name: 'Explanation for Status',
		});
		// `<button type="button">` is implicitly focusable; verify that
		// programmatic focus actually moves to it (i.e. nothing intercepts
		// the keyboard interaction model).
		button.focus();
		expect(document.activeElement).toBe(button);
	});

	it('reveals the tooltip on focus and links it with aria-describedby', () => {
		render(<AccessibleInfoTrigger explanation="Audience is collectors." />);
		const button = screen.getByRole('button');

		// Closed initially — no role=tooltip in the DOM and no describedby.
		expect(screen.queryByRole('tooltip')).toBeNull();
		expect(button.getAttribute('aria-describedby')).toBeNull();
		expect(button.getAttribute('aria-expanded')).toBe('false');

		fireEvent.focus(button);

		const tooltip = screen.getByRole('tooltip');
		expect(tooltip).toHaveTextContent('Audience is collectors.');
		// The describedby on the button points at the tooltip's id.
		expect(button.getAttribute('aria-describedby')).toBe(tooltip.id);
		expect(button.getAttribute('aria-expanded')).toBe('true');
	});

	it('hides the tooltip on blur', () => {
		render(<AccessibleInfoTrigger explanation="Hidden after blur." />);
		const button = screen.getByRole('button');
		fireEvent.focus(button);
		expect(screen.getByRole('tooltip')).toBeInTheDocument();
		fireEvent.blur(button);
		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('dismisses the tooltip when Escape is pressed while it is open', () => {
		render(<AccessibleInfoTrigger explanation="Press Escape." />);
		const button = screen.getByRole('button');
		fireEvent.focus(button);
		expect(screen.getByRole('tooltip')).toBeInTheDocument();
		fireEvent.keyDown(button, { key: 'Escape' });
		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('reveals the tooltip on click and toggles it back off on a second click', () => {
		render(<AccessibleInfoTrigger explanation="Click to toggle." />);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		expect(screen.getByRole('tooltip')).toBeInTheDocument();

		// Blur first to release the focus-driven open so the click toggles back.
		fireEvent.blur(button);
		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('falls back to a generic label when none is provided', () => {
		render(<AccessibleInfoTrigger explanation="Some text." />);
		expect(
			screen.getByRole('button', { name: 'Show explanation' })
		).toBeInTheDocument();
	});
});
