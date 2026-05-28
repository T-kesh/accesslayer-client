import { type ReactNode } from 'react';
import { Wifi, WifiOff, SignalHigh, SignalLow } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStellarConnectionQuality } from '@/hooks/useStellarConnectionQuality';
import {
	formatStellarConnectionQualityLabel,
	type StellarConnectionQualitySnapshot,
} from '@/utils/stellarConnectionQuality.utils';

interface StellarConnectionQualityBadgeProps {
	className?: string;
}

const qualityStyles: Record<
	StellarConnectionQualitySnapshot['quality'],
	{ className: string; icon: ReactNode }
> = {
	excellent: {
		className:
			'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
		icon: <Wifi className="size-3.5" />,
	},
	good: {
		className: 'border-emerald-300/20 bg-emerald-400/8 text-emerald-100',
		icon: <SignalHigh className="size-3.5" />,
	},
	degraded: {
		className: 'border-amber-300/25 bg-amber-400/10 text-amber-100',
		icon: <SignalLow className="size-3.5" />,
	},
	offline: {
		className: 'border-red-300/25 bg-red-400/10 text-red-100',
		icon: <WifiOff className="size-3.5" />,
	},
};

const StellarConnectionQualityBadge: React.FC<
	StellarConnectionQualityBadgeProps
> = ({ className }) => {
	const { quality, latencyMs, isChecking } = useStellarConnectionQuality();
	const style = qualityStyles[quality.quality];
	const label = isChecking
		? 'Checking Stellar RPC...'
		: formatStellarConnectionQualityLabel(quality, latencyMs);

	return (
		<div
			role="status"
			aria-live="polite"
			aria-label={label}
			title={label}
			className={cn(
				'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md',
				style.className,
				className
			)}
		>
			<span aria-hidden="true" className="shrink-0">
				{style.icon}
			</span>
			<span className="whitespace-nowrap">
				{isChecking ? 'Checking RPC' : `RPC ${quality.label}`}
			</span>
		</div>
	);
};

export default StellarConnectionQualityBadge;
