export type StellarConnectionQuality =
	| 'excellent'
	| 'good'
	| 'degraded'
	| 'offline';

export interface StellarConnectionQualitySnapshot {
	quality: StellarConnectionQuality;
	label: string;
	description: string;
	tone: 'success' | 'warning' | 'destructive' | 'muted';
}

const STELLAR_CONNECTION_QUALITY_MAP: Record<
	StellarConnectionQuality,
	StellarConnectionQualitySnapshot
> = {
	excellent: {
		quality: 'excellent',
		label: 'Excellent',
		description: 'RPC responses are fast and stable.',
		tone: 'success',
	},
	good: {
		quality: 'good',
		label: 'Good',
		description: 'RPC responses are healthy.',
		tone: 'success',
	},
	degraded: {
		quality: 'degraded',
		label: 'Slow',
		description: 'RPC responses are slower than expected.',
		tone: 'warning',
	},
	offline: {
		quality: 'offline',
		label: 'Offline',
		description: 'RPC requests are failing right now.',
		tone: 'destructive',
	},
};

export const classifyStellarConnectionQuality = (
	latencySamplesMs: number[],
	hasError = false
): StellarConnectionQualitySnapshot => {
	if (hasError || latencySamplesMs.length === 0) {
		return STELLAR_CONNECTION_QUALITY_MAP.offline;
	}

	const averageLatencyMs =
		latencySamplesMs.reduce((sum, sample) => sum + sample, 0) /
		latencySamplesMs.length;

	if (averageLatencyMs <= 600) {
		return STELLAR_CONNECTION_QUALITY_MAP.excellent;
	}

	if (averageLatencyMs <= 1500) {
		return STELLAR_CONNECTION_QUALITY_MAP.good;
	}

	return STELLAR_CONNECTION_QUALITY_MAP.degraded;
};

export const formatStellarConnectionQualityLabel = (
	snapshot: StellarConnectionQualitySnapshot,
	latencyMs?: number | null
) => {
	if (snapshot.quality === 'offline') {
		return 'Stellar RPC offline';
	}

	if (latencyMs == null) {
		return `Stellar RPC ${snapshot.label.toLowerCase()}`;
	}

	return `Stellar RPC ${snapshot.label.toLowerCase()} at ${latencyMs} ms`;
};
