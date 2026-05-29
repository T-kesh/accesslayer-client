import { formatNumber } from '@/utils/numberFormat.utils';

export interface FormatTransactionFeeOptions {
	unit?: string;
	maximumFractionDigits?: number;
	prefix?: string;
}

/**
 * Formats a transaction fee for confirmation UIs.
 *
 * Keeps the raw value untouched and only normalizes the display with a unit
 * suffix and fee-style prefix so tiny network fees stay readable.
 */
export function formatTransactionFeeDisplay(
	fee: number | null | undefined,
	{
		unit = 'ETH',
		maximumFractionDigits = 6,
		prefix = '~',
	}: FormatTransactionFeeOptions = {}
): string {
	if (fee == null || !Number.isFinite(fee)) {
		return '—';
	}

	return `${prefix}${formatNumber(fee, {
		maximumFractionDigits,
		minimumFractionDigits: 0,
	})} ${unit}`;
}
