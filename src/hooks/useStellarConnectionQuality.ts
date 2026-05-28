import { useEffect, useMemo, useState } from 'react';
import { defaultChain } from '@/lib/web3/chains';
import { useEthersProvider } from '@/hooks/useEthersProvider';
import {
	classifyStellarConnectionQuality,
	type StellarConnectionQualitySnapshot,
} from '@/utils/stellarConnectionQuality.utils';

const DEFAULT_POLL_INTERVAL_MS = 20_000;
const MAX_SAMPLES = 4;

export interface StellarConnectionQualityState {
	quality: StellarConnectionQualitySnapshot;
	latencyMs: number | null;
	lastCheckedAt: number | null;
	isChecking: boolean;
}

export function useStellarConnectionQuality(
	pollIntervalMs: number = DEFAULT_POLL_INTERVAL_MS
): StellarConnectionQualityState {
	const provider = useEthersProvider({ chainId: defaultChain.id });
	const [latencySamples, setLatencySamples] = useState<number[]>([]);
	const [latencyMs, setLatencyMs] = useState<number | null>(null);
	const [lastCheckedAt, setLastCheckedAt] = useState<number | null>(null);
	const [hasError, setHasError] = useState(false);
	const [isChecking, setIsChecking] = useState(true);

	useEffect(() => {
		if (!provider) {
			setLatencySamples([]);
			setLatencyMs(null);
			setHasError(true);
			setIsChecking(false);
			return;
		}

		setLatencySamples([]);
		setLatencyMs(null);
		setLastCheckedAt(null);
		setHasError(false);
		setIsChecking(true);

		let isActive = true;
		let intervalId: number | undefined;

		const sampleConnection = async () => {
			setIsChecking(true);
			const startedAt = performance.now();

			try {
				await provider.getBlockNumber();
				const sampleLatency = Math.round(performance.now() - startedAt);
				if (!isActive) return;

				setHasError(false);
				setLatencyMs(sampleLatency);
				setLastCheckedAt(Date.now());
				setLatencySamples(previous => [
					sampleLatency,
					...previous,
				].slice(0, MAX_SAMPLES));
			} catch {
				if (!isActive) return;
				setHasError(true);
				setLatencyMs(null);
				setLastCheckedAt(Date.now());
			} finally {
				if (isActive) {
					setIsChecking(false);
				}
			}
		};

		void sampleConnection();
		intervalId = window.setInterval(sampleConnection, pollIntervalMs);

		return () => {
			isActive = false;
			if (intervalId) {
				window.clearInterval(intervalId);
			}
		};
	}, [pollIntervalMs, provider]);

	const quality = useMemo(() => {
		const snapshot = classifyStellarConnectionQuality(
			latencySamples,
			hasError
		);

		return snapshot;
	}, [hasError, latencySamples]);

	return {
		quality,
		latencyMs,
		lastCheckedAt,
		isChecking,
	};
}
