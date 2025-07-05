// components/CardTitleWithAction.tsx
'use client';
import React from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';

interface TitleActionProps {
	title: string;
	onActionClick: () => void;
	texts?: string;
	IconName?: React.ComponentType<{ size?: number; color?: string }>;
}

const CardTitleWithAction = ({
	title,
	onActionClick,
	texts = 'Add New Budget',
	IconName,
}: TitleActionProps) => {
	return (
		<div className='flex justify-between w-full px-[16px] py-[8px] items-center'>
			<div className='titleIcon flex items-center gap-4'>
				<span className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					{IconName ? <IconName size={24} /> : null}
				</span>
				<h2 className='text-[var(--primary)] dark:text-[var(--secondary-dark)] font-semibold text-lg'>
					{title}
				</h2>
			</div>

			{/* Action Button (Add Icon) */}
			<div
				className='flex items-center gap-2 justify-end p-4 rounded-md bg-[var(--primary)] dark:bg-[var(--secondary-dark)] dark:text-black text-white cursor-pointer'
				onClick={onActionClick}>
				{texts}
				<button className=' dark:text-[var(--trail)] text-[var(--primary-dark)] hover:text-blue-800 dark:hover:text-blue-300 transition'>
					<IoMdAddCircleOutline size={24} />
				</button>
			</div>
		</div>
	);
};

export default CardTitleWithAction;
