import { cn } from '@/lib/utils';
import { lineClampClassFor } from '@/utils/lineClamp.utils';

interface CreatorBioProps {
	/** Raw bio string from the creator profile. Anything falsy or whitespace-only is treated as missing. */
	bio?: string | null;
	/** Override the default fallback copy. */
	fallback?: string;
	/** Variant — `card` is muted/italic for list rows, `profile` is slightly more prominent for the detail header. */
	variant?: 'card' | 'profile';
	/** If true, returns null instead of a fallback when bio is missing. */
	allowEmpty?: boolean;
	/**
	 * When true and `bio` is empty, swap the generic "no bio" fallback for
	 * the pending-onboarding placeholder (#291) so visitors know the creator
	 * is still setting things up rather than seeing a blank section.
	 */
	isOnboardingPending?: boolean;
	/**
	 * Clamp the rendered bio to at most this many lines on the card (#282).
	 * Only effective for the `card` variant — the `profile` variant always
	 * shows the full bio, so the truncation stays purely cosmetic and the
	 * full text remains accessible on the creator profile page.
	 *
	 * Pass `null` (or omit) to disable clamping; the default is `3` lines on
	 * the card, which matches the card grid's row height and keeps layouts
	 * uniform across varying bio lengths. Short bios are unaffected.
	 */
	maxLines?: number | null;
	className?: string;
}

const DEFAULT_FALLBACK = "This creator hasn't shared a bio yet.";
/** Default maximum bio lines on the card. */
const DEFAULT_CARD_MAX_LINES = 3;

const variantClasses: Record<'card' | 'profile', { value: string; fallback: string }> = {
	card: {
		value: 'text-sm text-white/60 leading-relaxed',
		fallback: 'text-xs italic text-white/35',
	},
	profile: {
		value: 'font-jakarta text-sm text-white/70 leading-relaxed',
		fallback: 'font-jakarta text-sm italic text-white/40',
	},
};

/**
 * Renders a creator bio with a consistent fallback when the bio is missing.
 *
 * Centralizing this keeps wording aligned across the list and profile detail
 * surfaces — change the fallback once and every consumer picks it up.
 */
const CreatorBio: React.FC<CreatorBioProps> = ({
	bio,
	fallback = DEFAULT_FALLBACK,
	variant = 'card',
	allowEmpty = false,
	isOnboardingPending = false,
	maxLines,
	className,
}) => {
	const trimmed = bio?.trim();
	const styles = variantClasses[variant];

	if (!trimmed) {
		if (allowEmpty) {
			return null;
		}

		const effectiveFallback = isOnboardingPending
			? 'This creator is still setting up their profile. Bio coming soon.'
			: fallback;
		return (
			<p
				className={cn(styles.fallback, className)}
				aria-label={
					isOnboardingPending
						? 'Bio pending — onboarding in progress'
						: 'Bio not provided'
				}
			>
				{effectiveFallback}
			</p>
		);
	}

	// Card defaults to a 3-line clamp; explicit null disables it. Profile
	// variant ignores the prop so the full bio stays visible on the detail
	// page.
	const effectiveMaxLines =
		variant === 'card' && maxLines === undefined
			? DEFAULT_CARD_MAX_LINES
			: maxLines;
	const clampClass = lineClampClassFor(variant, effectiveMaxLines);

	return (
		<p
			// Preserve the full bio in the accessible name so screen readers
			// can read the unclamped text — the visual truncation is cosmetic.
			title={clampClass ? trimmed : undefined}
			className={cn(styles.value, clampClass, className)}
		>
			{trimmed}
		</p>
	);
};

export default CreatorBio;
