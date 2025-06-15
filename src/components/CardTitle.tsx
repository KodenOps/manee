// CardTitle.tsx
import React from 'react';
import { CiMenuKebab } from 'react-icons/ci';

interface titleType {
	IconName?: React.ComponentType<{ size?: number; color?: string }>;
	title: string;
	handleMenuClick?: () => void;
	menuRef?: React.RefObject<HTMLDivElement>; // Add this
}

const CardTitle = ({
	IconName,
	title,
	handleMenuClick,
	menuRef,
}: titleType) => {
	return (
		<div className='flex justify-between w-full px-[16px] py-[8px] items-center'>
			<div className='titleIcon flex items-center gap-4'>
				<span className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					{IconName ? <IconName size={24} /> : ''}
				</span>
				<h2 className='text-[var(--primary)] dark:text-[var(--secondary-dark)] font-semibold text-lg'>
					{title}
				</h2>
			</div>
			<div
				ref={menuRef}
				onClick={handleMenuClick}
				className='cursor-pointer relative'>
				<CiMenuKebab className='text-black dark:text-[var(--secondary-dark)]' />
			</div>
		</div>
	);
};

export default CardTitle;
