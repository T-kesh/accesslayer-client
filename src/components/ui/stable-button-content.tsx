import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface StableButtonContentProps {
	/** Whether the loading slot should be visible to sighted users and assistive tech. */
	isLoading: boolean;
	/** Button label or content shown when the action is idle. */
	children: React.ReactNode;
	/** Optional loading label. Defaults to keeping only the spinner visible. */
	loadingLabel?: React.ReactNode;
	/** Override the default spinner. Pass null to hide it. */
	spinner?: React.ReactNode;
	className?: string;
	idleClassName?: string;
	loadingClassName?: string;
}

/**
 * Renders idle and loading button content in the same grid cell so both states
 * contribute to the button's intrinsic width. The inactive state stays
 * invisible (not `display: none`), which reserves enough space before a loading
 * transition and prevents neighboring layout from jumping.
 */
export function StableButtonContent({
	isLoading,
	children,
	loadingLabel,
	spinner = <Loader2 className="size-4 animate-spin" aria-hidden="true" />,
	className,
	idleClassName,
	loadingClassName,
}: StableButtonContentProps) {
	return (
		<span className={cn('grid items-center justify-items-center', className)}>
			<span
				className={cn(
					'col-start-1 row-start-1 inline-flex items-center justify-center gap-2',
					isLoading && 'invisible',
					idleClassName
				)}
				aria-hidden={isLoading || undefined}
			>
				{children}
			</span>
			<span
				className={cn(
					'col-start-1 row-start-1 inline-flex items-center justify-center gap-2',
					!isLoading && 'invisible',
					loadingClassName
				)}
				aria-hidden={!isLoading || undefined}
			>
				{spinner}
				{loadingLabel}
			</span>
		</span>
	);
}
