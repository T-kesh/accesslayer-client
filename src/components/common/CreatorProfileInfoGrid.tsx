import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import CreatorProfileStatItem from './CreatorProfileStatItem';
import { CREATOR_CARD_STAT_GRID_GAP_CLASS } from '@/utils/creatorCardTokens';

interface CreatorProfileInfoItem {
	label: string;
	value: ReactNode;
	helperText?: ReactNode;
}

interface CreatorProfileInfoGridProps {
	items: CreatorProfileInfoItem[];
	className?: string;
}

const CreatorProfileInfoGrid: React.FC<CreatorProfileInfoGridProps> = ({
	items,
	className,
}) => {
	return (
		<div
			className={cn(
				'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
				CREATOR_CARD_STAT_GRID_GAP_CLASS,
				className
			)}
		>
			{items.map(item => (
				<CreatorProfileStatItem
					key={item.label}
					label={item.label}
					value={item.value}
					helperText={item.helperText}
				/>
			))}
		</div>
	);
};

export default CreatorProfileInfoGrid;
