import * as React from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccessibleInfoTriggerProps {
	/** The explanatory text revealed on focus / hover / click. */
	explanation: string;
	/**
	 * Accessible label for the trigger button. Defaults to a generic phrasing —
	 * pass a metric-specific label (e.g. `Explanation for: Audience`) so screen
	 * readers describe *what* the trigger explains.
	 */
	label?: string;
	className?: string;
}

/**
 * Accessible tooltip trigger for creator metric explanations (#290).
 *
 * Why a new component instead of reusing `<Tooltip>`:
 * - The existing tooltip wraps content in a non-focusable `<div>` and toggles
 *   visibility via `group-hover:` / `group-focus-within:`. That works only if
 *   a focusable descendant exists inside the wrapper, so attaching it to a
 *   plain label produces a hover-only tooltip.
 * - Metric explanations need to be reachable via keyboard. A real `<button>`
 *   with `aria-describedby` pointing to a `role="tooltip"` element is the
 *   standard accessible pattern and is what assistive tech expects.
 *
 * Behaviour:
 * - Focus / hover / click reveals the tooltip; Escape, blur, or mouse-leave
 *   hides it. The Escape handler is bound to the trigger itself so it does
 *   not leak to global keyboard handlers.
 * - The trigger keeps the same visual footprint whether the tooltip is open
 *   or not (the popover is absolutely positioned).
 * - The tooltip content sits below the trigger by default; pass a custom
 *   `className` if you need to flip positioning.
 */
export const AccessibleInfoTrigger: React.FC<AccessibleInfoTriggerProps> = ({
	explanation,
	label,
	className,
}) => {
	const tooltipId = React.useId();
	const [open, setOpen] = React.useState(false);

	const show = React.useCallback(() => setOpen(true), []);
	const hide = React.useCallback(() => setOpen(false), []);
	const toggle = React.useCallback(() => setOpen(prev => !prev), []);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Escape' && open) {
			event.stopPropagation();
			hide();
		}
	};

	return (
		<span className={cn('relative inline-flex', className)}>
			<button
				type="button"
				aria-label={label ?? 'Show explanation'}
				aria-describedby={open ? tooltipId : undefined}
				aria-expanded={open}
				onMouseEnter={show}
				onMouseLeave={hide}
				onFocus={show}
				onBlur={hide}
				onClick={toggle}
				onKeyDown={handleKeyDown}
				className="inline-flex size-4 items-center justify-center rounded-full text-white/55 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950"
			>
				<Info className="size-3" aria-hidden="true" />
			</button>
			{open && (
				<span
					id={tooltipId}
					role="tooltip"
					className="absolute left-1/2 top-full z-50 mt-2 w-max max-w-xs -translate-x-1/2 rounded-md border border-white/10 bg-slate-950/95 px-2.5 py-1.5 text-[0.7rem] font-medium leading-snug text-white/85 shadow-lg backdrop-blur"
				>
					{explanation}
				</span>
			)}
		</span>
	);
};

export default AccessibleInfoTrigger;
