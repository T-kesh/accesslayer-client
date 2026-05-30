import {
	formatDisplayKeyPrice,
	resolveCreatorKeyPriceStroops,
	type CreatorKeyPriceFields,
} from '@/utils/keyPriceDisplay.utils';

interface CreatorPriceChartAccessibilityInput extends CreatorKeyPriceFields {
	name: string;
	change24h?: number | null;
}

export interface CreatorPriceChartPoint {
	label: string;
	value: string;
}

export interface CreatorPriceChartAccessibilityCopy {
	summary: string;
	points: CreatorPriceChartPoint[];
}

const formatChangePercent = (change24h: number): string => {
	const absoluteChange = Math.abs(change24h);
	const formatted = new Intl.NumberFormat('en-US', {
		maximumFractionDigits: 2,
		minimumFractionDigits: absoluteChange > 0 && absoluteChange < 1 ? 2 : 0,
	}).format(absoluteChange);

	return `${formatted}%`;
};

const getPreviousPriceStroops = (
	currentPriceStroops: number,
	change24h: number | null | undefined
): number | null => {
	if (change24h == null || !Number.isFinite(change24h)) return null;
	const changeRatio = 1 + change24h / 100;
	if (changeRatio <= 0) return null;
	return Math.round(currentPriceStroops / changeRatio);
};

/**
 * Builds screen-reader copy and hidden tabular data from the same creator price
 * fields used by the visual chart so accessible text stays in sync.
 */
export const getCreatorPriceChartAccessibilityCopy = ({
	name,
	change24h,
	...priceFields
}: CreatorPriceChartAccessibilityInput): CreatorPriceChartAccessibilityCopy => {
	const currentPriceStroops = resolveCreatorKeyPriceStroops(priceFields);

	if (currentPriceStroops == null) {
		return {
			summary: `Price chart for ${name}: current key price is unavailable.`,
			points: [{ label: 'Current key price', value: 'Unavailable' }],
		};
	}

	const currentPrice = formatDisplayKeyPrice(currentPriceStroops);
	const previousPriceStroops = getPreviousPriceStroops(
		currentPriceStroops,
		change24h
	);
	const points: CreatorPriceChartPoint[] = [];

	if (previousPriceStroops != null) {
		points.push({
			label: 'Previous 24-hour key price',
			value: formatDisplayKeyPrice(previousPriceStroops),
		});
	}

	points.push({ label: 'Current key price', value: currentPrice });

	if (change24h == null || !Number.isFinite(change24h)) {
		return {
			summary: `Price chart for ${name}: current key price is ${currentPrice}. 24-hour price trend is unavailable.`,
			points,
		};
	}

	if (change24h === 0) {
		return {
			summary: `Price chart for ${name}: current key price is ${currentPrice}, unchanged over the last 24 hours.`,
			points,
		};
	}

	const direction = change24h > 0 ? 'up' : 'down';
	const previousPriceCopy =
		previousPriceStroops != null
			? ` from approximately ${formatDisplayKeyPrice(previousPriceStroops)}`
			: '';

	return {
		summary: `Price chart for ${name}: current key price is ${currentPrice}, ${direction} ${formatChangePercent(change24h)} over the last 24 hours${previousPriceCopy}.`,
		points,
	};
};
