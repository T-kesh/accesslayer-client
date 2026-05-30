import { cn } from '@/lib/utils';
import CopyField from '@/components/common/CopyField';

interface TruncatedAddressProps {
	address: string;
	copyable?: boolean;
	className?: string;
}

const TruncatedAddress: React.FC<TruncatedAddressProps> = ({
	address,
	copyable = false,
	className,
}) => {
	if (!copyable) {
		return (
			<span
				className={cn(
					'inline-flex items-center gap-1 font-mono text-sm text-white/70',
					className
				)}
				title={address}
			>
				<span>{address}</span>
			</span>
		);
	}

	return (
		<CopyField
			value={address}
			label="Wallet address"
			className={className}
		/>
	);
};

export default TruncatedAddress;
