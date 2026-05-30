import type { FC } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import CopyField from '@/components/common/CopyField';

interface TransactionHashRowProps {
	hash: string;
	label?: string;
	explorerUrl?: string;
	className?: string;
}

const TransactionHashRow: FC<TransactionHashRowProps> = ({
	hash,
	label = 'Transaction Hash',
	explorerUrl,
	className,
}) => {
	return (
		<div
			className={cn(
				'flex items-center justify-between gap-3 py-1.5 text-xs',
				className
			)}
		>
			<span className="shrink-0 uppercase tracking-wider text-white/40">
				{label}
			</span>
			<div className="flex items-center gap-2 overflow-hidden">
			<CopyField
				value={hash}
				label="transaction hash"
			/>
				{explorerUrl && (
					<a
						href={explorerUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex size-6 items-center justify-center rounded-md bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
						aria-label="View on block explorer"
					>
						<ExternalLink className="size-3" />
					</a>
				)}
			</div>
		</div>
	);
};

export default TransactionHashRow;
