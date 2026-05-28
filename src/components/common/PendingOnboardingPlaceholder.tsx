import { Hourglass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PendingOnboardingPlaceholderProps {
	/**
	 * The profile section the placeholder is filling in (e.g. "bio", "links",
	 * "stats"). Used to tailor the copy without forcing every caller to write
	 * their own; pass a custom `message` to fully override.
	 */
	section?: 'bio' | 'links' | 'stats' | 'overview';
	/** Override the default per-section copy. */
	message?: string;
	/** `inline` is a compact one-liner; `card` is a centred boxed callout. */
	variant?: 'inline' | 'card';
	className?: string;
}

const SECTION_COPY: Record<NonNullable<PendingOnboardingPlaceholderProps['section']>, string> = {
	bio: 'This creator is still setting up their profile. Bio coming soon.',
	links: 'Social links will appear here once this creator finishes onboarding.',
	stats: 'Creator stats will appear here once onboarding is complete.',
	overview: 'This creator is still setting up their profile.',
};

/**
 * Placeholder shown for creator profile sections that would otherwise render
 * blank while onboarding is still in progress (#291). Centralising the copy
 * keeps the tone consistent across every empty-state surface on the profile
 * page — change it once here and every consumer picks it up.
 */
const PendingOnboardingPlaceholder: React.FC<PendingOnboardingPlaceholderProps> = ({
	section = 'overview',
	message,
	variant = 'inline',
	className,
}) => {
	const copy = message ?? SECTION_COPY[section];

	if (variant === 'card') {
		return (
			<div
				role="status"
				aria-live="polite"
				className={cn(
					'flex flex-col items-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-5 text-center',
					className
				)}
			>
				<Hourglass
					className="size-5 text-amber-400/80"
					aria-hidden="true"
				/>
				<p className="font-jakarta text-sm text-white/70">{copy}</p>
			</div>
		);
	}

	return (
		<p
			role="status"
			aria-live="polite"
			className={cn(
				'inline-flex items-center gap-1.5 font-jakarta text-xs italic text-white/55',
				className
			)}
		>
			<Hourglass className="size-3 text-amber-400/70" aria-hidden="true" />
			{copy}
		</p>
	);
};

export default PendingOnboardingPlaceholder;
