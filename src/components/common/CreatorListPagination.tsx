import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CreatorListPaginationProps {
	/** 0-indexed current page. */
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	className?: string;
}

const CreatorListPagination: React.FC<CreatorListPaginationProps> = ({
	page,
	totalPages,
	onPageChange,
	className,
}) => {
	const displayPage = page + 1;

	return (
		<nav
			aria-label="Creator list pagination"
			className={cn('flex items-center justify-center gap-3', className)}
		>
			{/*
			 * Live region announces the new page to screen readers on every
			 * navigation. aria-atomic ensures the full "Page X of Y" phrase
			 * is read rather than just the changed number.
			 */}
			<div
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{`Page ${displayPage} of ${totalPages}`}
			</div>

			<Button
				type="button"
				variant="outline"
				size="sm"
				disabled={page === 0}
				onClick={() => onPageChange(Math.max(0, page - 1))}
				aria-label="Go to previous page"
			>
				<ChevronLeft className="size-4" aria-hidden="true" />
				<span aria-hidden="true">Previous</span>
			</Button>

			{/*
			 * aria-hidden suppresses the visual "Page X of Y" from screen
			 * readers — the sr-only live region above handles announcements
			 * to avoid duplicate readout.
			 */}
			<span
				className="marketplace-label-muted text-xs tabular-nums"
				aria-hidden="true"
			>
				Page {displayPage} of {totalPages}
			</span>

			<Button
				type="button"
				variant="outline"
				size="sm"
				disabled={page >= totalPages - 1}
				onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
				aria-label="Go to next page"
			>
				<span aria-hidden="true">Next</span>
				<ChevronRight className="size-4" aria-hidden="true" />
			</Button>
		</nav>
	);
};

export default CreatorListPagination;
