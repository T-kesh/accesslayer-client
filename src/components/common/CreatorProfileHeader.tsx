import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';
import showToast from '@/utils/toast.util';
import appendUtmParams from '@/utils/utm.utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import CreatorInitialsAvatar from '@/components/common/CreatorInitialsAvatar';
import CreatorBio from '@/components/common/CreatorBio';
import { formatCreatorHandle } from '@/utils/handleDisplay.utils';
import { CREATOR_CARD_MEDIA_RADIUS_CLASS } from '@/utils/creatorCardTokens';

interface CreatorProfileHeaderProps {
	name: string;
	handle: string;
	creatorId?: string | number | null;
	avatarUrl?: string;
	isVerified?: boolean;
	bio?: string | null;
	className?: string;
}

const CREATOR_PROFILE_SUBTITLE_WRAP_CLASS_NAME =
	'max-w-full whitespace-normal break-words [overflow-wrap:anywhere]';

const CreatorProfileHeader: React.FC<CreatorProfileHeaderProps> = ({
	name,
	handle,
	creatorId,
	avatarUrl,
	isVerified,
	bio,
	className,
}) => {
	const [copied, setCopied] = useState(false);

	// Display-normalised handle; raw `handle` is preserved for any equality /
	// URL construction the caller might do via the prop.
	const displayHandle = formatCreatorHandle(handle);

	const handleShare = async () => {
		let url = window.location.href;

		// Append UTM params when configured (no-op if none configured)
		url = appendUtmParams(url);

		if (navigator.share) {
			try {
				await navigator.share({
					title: `${name} (${displayHandle || `@${handle}`}) on Access Layer`,
					url,
				});
			} catch (err) {
				// User cancelled the share dialog — not an error worth surfacing
				if (err instanceof Error && err.name !== 'AbortError') {
					showToast.error('Failed to share profile');
				}
			}
			return;
		}

		// Fallback: copy to clipboard
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			showToast.success('Profile link copied to clipboard!');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			showToast.error('Failed to copy link');
		}
	};

	const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

	return (
		<div
			className={cn(
				'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
				className
			)}
		>
			<div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
				<div
					className={cn(
						'size-24 overflow-hidden border-4 border-white/10 shadow-xl md:size-32',
						CREATOR_CARD_MEDIA_RADIUS_CLASS
					)}
					role="img"
					aria-labelledby="creator-profile-name"
				>
					<CreatorInitialsAvatar name={name} creatorId={creatorId} imageSrc={avatarUrl} />
				</div>
				<div className="min-w-0 space-y-1">
					<div className="flex items-center gap-2 overflow-hidden">
						<h1
							id="creator-profile-name"
							className="truncate font-grotesque text-3xl font-black tracking-tight text-white md:text-4xl"
						>
							{name}
						</h1>
						{isVerified && (
							<div className="shrink-0">
								<VerifiedBadge verified={true} />
							</div>
						)}
					</div>
					<p
						className={cn(
							'font-jakarta text-lg text-white/50',
							CREATOR_PROFILE_SUBTITLE_WRAP_CLASS_NAME
						)}
					>
						{displayHandle || `@${handle}`}
					</p>
					{/* #315: profile bio auto-collapses with a Show more / less
						toggle once long enough. Short bios render unchanged. */}
					<CreatorBio
						bio={bio}
						variant="profile"
						collapsible
						className="mt-2 max-w-md"
					/>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<Button
					onClick={handleShare}
					variant="outline"
					className="h-11 rounded-xl border-white/10 bg-white/5 px-4 font-bold text-white transition-all hover:border-amber-500/30 hover:bg-amber-500/10 active:scale-95"
				>
					{copied ? (
						<Check className="mr-2 size-4 text-emerald-400" />
					) : canNativeShare ? (
						<Share2 className="mr-2 size-4 text-amber-500" />
					) : (
						<Copy className="mr-2 size-4 text-amber-500" />
					)}
					<span className="hidden sm:inline">
						{copied ? 'Copied!' : canNativeShare ? 'Share Profile' : 'Copy Profile Link'}
					</span>
					<span className="sm:hidden">
						{copied ? 'Copied' : canNativeShare ? 'Share' : 'Copy'}
					</span>
				</Button>
			</div>
		</div>
	);
};

export default CreatorProfileHeader;
