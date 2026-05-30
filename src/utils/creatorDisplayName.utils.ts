/**
 * Display-only normalisation for creator names (issue #368).
 *
 * Creator display names can be authored with leading/trailing whitespace or
 * accidental runs of internal whitespace. Rendering a cleaned value keeps card,
 * profile, and list surfaces visually consistent without changing the stored
 * value callers received from the API.
 */
export const normalizeCreatorDisplayName = (
	raw: string | null | undefined
): string => {
	if (raw == null) return '';
	return raw.trim().replace(/\s+/g, ' ');
};
