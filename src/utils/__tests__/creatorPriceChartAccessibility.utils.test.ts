import { describe, expect, it } from 'vitest';
import { getCreatorPriceChartAccessibilityCopy } from '../creatorPriceChartAccessibility.utils';

describe('getCreatorPriceChartAccessibilityCopy', () => {
	it('summarizes an upward creator price trend and exposes matching data points', () => {
		const copy = getCreatorPriceChartAccessibilityCopy({
			name: 'Alex Rivers',
			price: 12,
			change24h: 50,
		});

		expect(copy.summary).toBe(
			'Price chart for Alex Rivers: current key price is 12 XLM, up 50% over the last 24 hours from approximately 8 XLM.'
		);
		expect(copy.points).toEqual([
			{ label: 'Previous 24-hour key price', value: '8 XLM' },
			{ label: 'Current key price', value: '12 XLM' },
		]);
	});

	it('handles unavailable trend data while keeping current price available', () => {
		const copy = getCreatorPriceChartAccessibilityCopy({
			name: 'Mina Park',
			priceStroops: 5_000_000,
		});

		expect(copy.summary).toBe(
			'Price chart for Mina Park: current key price is 0.5 XLM. 24-hour price trend is unavailable.'
		);
		expect(copy.points).toEqual([
			{ label: 'Current key price', value: '0.5 XLM' },
		]);
	});
});
