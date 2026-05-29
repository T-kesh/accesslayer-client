import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/button';
import { StableButtonContent } from '@/components/ui/stable-button-content';

describe('StableButtonContent', () => {
	it('keeps idle and loading content mounted so button width can be reserved', () => {
		render(
			<Button>
				<StableButtonContent isLoading={false} loadingLabel="Saving…">
					Save changes
				</StableButtonContent>
			</Button>
		);

		const idleContent = screen.getByText('Save changes');
		const loadingContent = screen.getByText('Saving…');

		expect(idleContent).toBeVisible();
		expect(idleContent).not.toHaveAttribute('aria-hidden');
		expect(loadingContent).toHaveClass('invisible');
		expect(loadingContent).toHaveAttribute('aria-hidden', 'true');
	});

	it('reveals the loading label and spinner while reserving the idle label', () => {
		render(
			<Button aria-busy="true">
				<StableButtonContent isLoading loadingLabel="Saving…">
					Save changes
				</StableButtonContent>
			</Button>
		);

		const idleContent = screen.getByText('Save changes');
		const loadingContent = screen.getByText('Saving…');

		expect(idleContent).toHaveClass('invisible');
		expect(idleContent).toHaveAttribute('aria-hidden', 'true');
		expect(loadingContent).toBeVisible();
		expect(loadingContent).not.toHaveAttribute('aria-hidden');
		expect(document.querySelector('.animate-spin')).toBeInTheDocument();
	});
});
