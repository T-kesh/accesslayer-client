import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CircularSpinner from '@/components/common/CircularSpinnerProps';
import { cn } from '@/lib/utils';
import TransactionHashRow from '@/components/common/TransactionHashRow';
import {
	getConfirmationStatus,
	getConfirmationTone,
} from '@/utils/transaction.utils';
import { Tooltip } from '@/components/ui/tooltip';

const confirmationToneClasses = {
	neutral: 'border-slate-500/30 bg-slate-500/20 text-slate-400',
	warning: 'border-amber-500/30 bg-amber-500/20 text-amber-300',
	success: 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400',
} as const;

export interface PendingTxModalProps {
	open: boolean;
	onOpenChange?: (open: boolean) => void;
	/** When true, renders the loading/spinner state */
	isLoading?: boolean;
	title?: string;
	description?: string;
	/** Optional transaction hash to display */
	txHash?: string;
	/** Optional explorer link for the transaction */
	explorerUrl?: string;
	/** Prevent the user from dismissing the modal while loading */
	blockDismissal?: boolean;
	/** Optional footer action (e.g. "View on explorer") */
	action?: {
		label: string;
		onClick: () => void;
	};
	/** Optional block confirmation count */
	confirmations?: number;
}

const PendingTxModal: React.FC<PendingTxModalProps> = ({
	open,
	onOpenChange,
	isLoading = false,
	title = 'Transaction pending',
	description = 'Your transaction has been submitted and is awaiting confirmation.',
	txHash,
	explorerUrl,
	blockDismissal = false,
	action,
	confirmations,
}) => {
	const handleOpenChange = (next: boolean) => {
		if (!next && blockDismissal && isLoading) return;
		onOpenChange?.(next);
	};

	const confirmationStatus =
		confirmations !== undefined ? getConfirmationStatus(confirmations) : undefined;
	const confirmationTone =
		confirmationStatus !== undefined
			? getConfirmationTone(confirmationStatus)
			: undefined;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				showCloseButton={!(blockDismissal && isLoading)}
				showEscapeHint={!(blockDismissal && isLoading)}
				className="max-w-sm"
				// Prevent closing via Escape when dismissal is blocked
				onEscapeKeyDown={(e: KeyboardEvent) => {
					if (blockDismissal && isLoading) e.preventDefault();
				}}
				// Prevent closing via overlay click when dismissal is blocked
				onInteractOutside={(e: Event) => {
					if (blockDismissal && isLoading) e.preventDefault();
				}}
			>
				<DialogHeader>
					<div className="mb-2 flex justify-center">
						<span
							className={cn(
								'inline-flex rounded-full p-3',
								isLoading
									? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-300/35'
									: 'bg-muted text-muted-foreground'
							)}
						>
							{isLoading ? (
								<CircularSpinner
									size={28}
									color="#fcd34d"
									speed="0.9s"
									bgOpacity={0.15}
								/>
							) : (
								<CircularSpinner
									size={28}
									color="currentColor"
									bgOpacity={0.15}
								/>
							)}
						</span>
					</div>
					<DialogTitle className="text-center">{title}</DialogTitle>
					<DialogDescription className="text-center">
						{description}
					</DialogDescription>
					
					{confirmationStatus !== undefined && confirmationTone !== undefined && (
						<div className="mt-4 flex flex-col items-center gap-2">
							<Tooltip content={`${confirmations} block confirmations`}>
								<span
									className={cn(
										'inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider',
										confirmationToneClasses[confirmationTone]
									)}
								>
									{confirmationStatus}
								</span>
							</Tooltip>
							<p className="text-[10px] font-medium uppercase tracking-widest text-white/40">
								{confirmations} confirmations
							</p>
						</div>
					)}
				</DialogHeader>

				{txHash && (
					<div className="mt-2 border-t border-white/5 pt-4">
						<TransactionHashRow
							hash={txHash}
							explorerUrl={explorerUrl}
							className="bg-white/5 rounded-lg px-3 py-2"
						/>
					</div>
				)}

				{(action || !blockDismissal) && (
					<DialogFooter className="sm:justify-center">
						{action && (
							<Button
								variant="outline"
								size="sm"
								onClick={action.onClick}
							>
								{action.label}
							</Button>
						)}
						{!blockDismissal && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => onOpenChange?.(false)}
							>
								Dismiss
							</Button>
						)}
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default PendingTxModal;
