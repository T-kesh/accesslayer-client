import { describe, expect, it } from 'vitest';
import { normalizeCreatorDisplayName } from '../creatorDisplayName.utils';

describe('normalizeCreatorDisplayName', () => {
	it('trims leading and trailing whitespace', () => {
		expect(normalizeCreatorDisplayName('  Alex Rivers  ')).toBe(
			'Alex Rivers'
		);
	});

	it('collapses internal whitespace runs to single spaces', () => {
		expect(normalizeCreatorDisplayName('Alex   \t\n  Rivers')).toBe(
			'Alex Rivers'
		);
	});

	it('returns an empty string for blank or nullish input', () => {
		expect(normalizeCreatorDisplayName('   ')).toBe('');
		expect(normalizeCreatorDisplayName(null)).toBe('');
		expect(normalizeCreatorDisplayName(undefined)).toBe('');
	});

	it('does not modify the stored value passed by the caller', () => {
		const raw = '  Alex   Rivers  ';
		normalizeCreatorDisplayName(raw);
		expect(raw).toBe('  Alex   Rivers  ');
	});
});
