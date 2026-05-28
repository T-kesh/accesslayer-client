import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ArrowRight } from 'lucide-react';

interface ClearedFiltersEmptyStateProps {
	/**
	 * Called when the user clicks "Browse all creators".
	 * Typically resets sort to 'featured' and clears any residual state.
	 */
	onBrowseAll?: () => void;
	className?: string;
}

/**
 * Shown when all filters have been cleared but the creator list is still
 * empty. Distinct from the search-no-results empty state — this state means
 * the marketplace itself has no listings, not that a specific query failed.
 */
const ClearedFiltersEmptyState: React.FC<ClearedFiltersEmptyStateProps> = ({
	onBrowseAll,
	className,
}) => (
	<div
		className={cn(
			'flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 px-8 py-14 text-center backdrop-blur-xl',
			className
		)}
		role="status"
		aria-label="No creators available"
	>
		<div className="relative mb-6 flex size-20 items-center justify-center">
			<div className="absolute inset-0 size-full rounded-full bg-amber-500/10 blur-2xl" />
			<span className="relative z-10 flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
				<SlidersHorizontal
					className="size-7 text-white/40"
					aria-hidden="true"
				/>
			</span>
		</div>

		<h2 className="font-grotesque text-2xl font-black tracking-tight text-white mb-2">
			Nothing here yet
		</h2>
		<p className="max-w-[300px] font-jakarta text-sm leading-relaxed text-white/50 mb-8">
			Your filters are cleared, but no creators are available right now.
			Check back soon or try browsing all categories.
		</p>

		{onBrowseAll && (
			<Button
				onClick={onBrowseAll}
				variant="outline"
				aria-label="Browse all creators"
				className="rounded-xl border-white/10 bg-white/5 px-6 font-bold text-white transition-all hover:border-amber-500/30 hover:bg-amber-500/10"
			>
				Browse all creators
				<ArrowRight className="ml-2 size-4" aria-hidden="true" />
			</Button>
		)}
	</div>
);

export default ClearedFiltersEmptyState;
