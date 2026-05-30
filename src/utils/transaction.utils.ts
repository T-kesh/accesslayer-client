/**
 * Transaction confirmation status thresholds
 */
export const CONFIRMATION_THRESHOLDS = {
	PENDING: 0,
	CONFIRMING_START: 1,
	CONFIRMED: 6,
} as const;

export type ConfirmationStatus = 'Pending' | 'Confirming' | 'Confirmed';

/**
 * Maps a raw block confirmation count to a human-readable status label
 * 
 * @param confirmations - The number of block confirmations
 * @returns Human-readable confirmation status
 */
export function getConfirmationStatus(confirmations: number): ConfirmationStatus {
	if (confirmations <= CONFIRMATION_THRESHOLDS.PENDING) {
		return 'Pending';
	}
	if (confirmations < CONFIRMATION_THRESHOLDS.CONFIRMED) {
		return 'Confirming';
	}
	return 'Confirmed';
}

/**
 * Maps a confirmation status to a UI tone/color
 * 
 * @param status - The confirmation status
 * @returns UI tone string
 */
export function getConfirmationTone(status: ConfirmationStatus): 'neutral' | 'warning' | 'success' {
	switch (status) {
		case 'Pending':
			return 'neutral';
		case 'Confirming':
			return 'warning';
		case 'Confirmed':
			return 'success';
	}
}
