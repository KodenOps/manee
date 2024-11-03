import React from 'react';
interface iconcardType {
	boxText: string;
	IconName: React.ComponentType<{ size?: number; color?: string }>;
}
const IconCard = ({ boxText, IconName }: iconcardType) => {
	return (
		<div className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--card-bg-dark)]  w-[100px] p-[24px] gap-2 cursor-pointer'>
			<span className='text-[var(--greys)] dark:text-[var(--accents)]'>
				<IconName size={24} />
			</span>
			<p className='font-medium text-md text-[var(--text)] dark:text-[var(--whites-dark)]'>
				{boxText}
			</p>
		</div>
	);
};

export default IconCard;
