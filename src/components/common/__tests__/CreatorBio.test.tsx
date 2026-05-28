import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CreatorBio from '@/components/common/CreatorBio';
import { lineClampClassFor } from '@/utils/lineClamp.utils';

describe('CreatorBio', () => {
	it('renders the bio text when provided', () => {
		render(<CreatorBio bio="Building things on Stellar." />);
		expect(
			screen.getByText('Building things on Stellar.')
		).toBeInTheDocument();
	});

	it('falls back to the default helper text when the bio is missing', () => {
		render(<CreatorBio bio={null} />);
		expect(
			screen.getByText("This creator hasn't shared a bio yet.")
		).toBeInTheDocument();
	});

	it('treats whitespace-only strings as missing', () => {
		render(<CreatorBio bio="   " />);
		expect(
			screen.getByText("This creator hasn't shared a bio yet.")
		).toBeInTheDocument();
	});

	it('respects an explicit fallback override', () => {
		render(<CreatorBio bio={undefined} fallback="No story shared yet." />);
		expect(screen.getByText('No story shared yet.')).toBeInTheDocument();
	});

	it('marks the fallback for assistive technology', () => {
		render(<CreatorBio bio="" />);
		expect(
			screen.getByLabelText('Bio not provided')
		).toBeInTheDocument();
	});

	it('trims surrounding whitespace from a real bio before rendering', () => {
		render(<CreatorBio bio="   real bio   " />);
		expect(screen.getByText('real bio')).toBeInTheDocument();
	});
});

// ---------------------------------------------------------------------------
// #282 — line clamp helper
// ---------------------------------------------------------------------------

describe('lineClampClassFor (#282)', () => {
	it('returns an empty class for the profile variant', () => {
		expect(lineClampClassFor('profile', 3)).toBe('');
		expect(lineClampClassFor('profile', null)).toBe('');
		expect(lineClampClassFor('profile', undefined)).toBe('');
	});

	it('returns an empty class when clamping is disabled on the card', () => {
		expect(lineClampClassFor('card', null)).toBe('');
		expect(lineClampClassFor('card', undefined)).toBe('');
		expect(lineClampClassFor('card', 0)).toBe('');
		expect(lineClampClassFor('card', -2)).toBe('');
	});

	it('maps positive line counts to the matching Tailwind utility (1..6)', () => {
		expect(lineClampClassFor('card', 1)).toBe('line-clamp-1');
		expect(lineClampClassFor('card', 2)).toBe('line-clamp-2');
		expect(lineClampClassFor('card', 3)).toBe('line-clamp-3');
		expect(lineClampClassFor('card', 4)).toBe('line-clamp-4');
		expect(lineClampClassFor('card', 5)).toBe('line-clamp-5');
		expect(lineClampClassFor('card', 6)).toBe('line-clamp-6');
	});

	it('caps higher values at line-clamp-6 to keep card heights bounded', () => {
		expect(lineClampClassFor('card', 7)).toBe('line-clamp-6');
		expect(lineClampClassFor('card', 50)).toBe('line-clamp-6');
	});
});

describe('CreatorBio clamp + onboarding integration', () => {
	it('applies line-clamp-3 by default on the card variant (#282)', () => {
		render(<CreatorBio bio="A long bio about the creator." variant="card" />);
		const p = screen.getByText('A long bio about the creator.');
		expect(p.className).toMatch(/\bline-clamp-3\b/);
	});

	it('respects an explicit maxLines override on the card variant (#282)', () => {
		render(<CreatorBio bio="A long bio." variant="card" maxLines={2} />);
		expect(screen.getByText('A long bio.').className).toMatch(/\bline-clamp-2\b/);
	});

	it('does not clamp when maxLines is null on the card (#282)', () => {
		render(<CreatorBio bio="A long bio." variant="card" maxLines={null} />);
		expect(screen.getByText('A long bio.').className).not.toMatch(/line-clamp/);
	});

	it('never clamps the profile variant — the full bio stays visible (#282)', () => {
		render(<CreatorBio bio="A long bio." variant="profile" maxLines={2} />);
		expect(screen.getByText('A long bio.').className).not.toMatch(/line-clamp/);
	});

	it('keeps the full bio in the title attribute for screen readers when clamped (#282)', () => {
		render(<CreatorBio bio="Full bio text." variant="card" maxLines={1} />);
		const p = screen.getByText('Full bio text.');
		expect(p.getAttribute('title')).toBe('Full bio text.');
	});

	it('falls back to the pending-onboarding copy when isOnboardingPending and bio is empty (#291)', () => {
		render(<CreatorBio bio="" isOnboardingPending />);
		expect(
			screen.getByText(/still setting up their profile/i)
		).toBeInTheDocument();
		// And it announces the pending state to assistive tech.
		expect(
			screen.getByLabelText(/onboarding in progress/i)
		).toBeInTheDocument();
	});

	it('uses the generic fallback when isOnboardingPending is false (#291)', () => {
		render(<CreatorBio bio="" />);
		expect(screen.getByText(/hasn't shared a bio yet/)).toBeInTheDocument();
	});

	it('ignores isOnboardingPending when a bio is provided (#291)', () => {
		render(<CreatorBio bio="Hello world" isOnboardingPending />);
		expect(screen.getByText('Hello world')).toBeInTheDocument();
		expect(screen.queryByText(/setting up their profile/i)).toBeNull();
	});
});

// ---------------------------------------------------------------------------
// #315 — auto-collapse + expand toggle on the profile variant
// ---------------------------------------------------------------------------

describe('CreatorBio collapsible (#315)', () => {
	const LONG = 'X'.repeat(250); // > default 200-char threshold

	it('does not render a toggle for a short bio even when collapsible is true', () => {
		render(<CreatorBio bio="Short bio." variant="profile" collapsible />);
		expect(screen.queryByRole('button')).toBeNull();
		// And the paragraph is plain — no line-clamp class.
		expect(screen.getByText('Short bio.').className).not.toMatch(/line-clamp/);
	});

	it('does not engage collapse on the card variant — that variant clamps already', () => {
		render(<CreatorBio bio={LONG} variant="card" collapsible />);
		expect(screen.queryByRole('button')).toBeNull();
	});

	it('clamps a long profile bio and renders a Show more button', () => {
		render(<CreatorBio bio={LONG} variant="profile" collapsible />);
		const button = screen.getByRole('button', { name: 'Show more' });
		expect(button).toHaveAttribute('aria-expanded', 'false');
		const paragraph = screen.getByText(LONG);
		// Collapsed → some line-clamp utility is applied.
		expect(paragraph.className).toMatch(/line-clamp/);
		// aria-controls points at the bio paragraph.
		const controls = button.getAttribute('aria-controls');
		expect(controls).toBeTruthy();
		expect(paragraph.id).toBe(controls);
	});

	it('toggles to Show less and removes the clamp when expanded', () => {
		render(<CreatorBio bio={LONG} variant="profile" collapsible />);
		const button = screen.getByRole('button', { name: 'Show more' });
		fireEvent.click(button);
		expect(
			screen.getByRole('button', { name: 'Show less' })
		).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByText(LONG).className).not.toMatch(/line-clamp/);
	});

	it('respects an explicit collapseThresholdChars override', () => {
		render(
			<CreatorBio
				bio="Medium length bio with about forty chars."
				variant="profile"
				collapsible
				collapseThresholdChars={10}
			/>
		);
		expect(screen.getByRole('button', { name: 'Show more' })).toBeInTheDocument();
	});

	it('clamps to collapsedMaxLines when supplied', () => {
		render(
			<CreatorBio
				bio={LONG}
				variant="profile"
				collapsible
				collapsedMaxLines={2}
			/>
		);
		expect(screen.getByText(LONG).className).toMatch(/\bline-clamp-2\b/);
	});
});
