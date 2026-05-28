import { cn } from '@/lib/utils';

interface RecentActivityBadgeProps {
	className?: string;
}

/**
 * Visible indicator for creator cards with recent trading activity
 * (volume24h > 0). Renders a pulsing green dot with an accessible label
 * so screen readers understand its meaning.
 */
const RecentActivityBadge: React.FC<RecentActivityBadgeProps> = ({
	className,
}) => (
	<span
		className={cn('inline-flex items-center gap-1.5', className)}
		title="Recently active"
	>
		{/* Pulsing dot — decorative, announced via the sr-only sibling */}
		<span
			aria-hidden="true"
			className="relative flex size-2 shrink-0"
		>
			<span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
			<span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
		</span>
		<span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-emerald-400">
			Active
		</span>
		<span className="sr-only">Recently active</span>
	</span>
);

export default RecentActivityBadge;
