import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface BeneCardType {
	boxText: string;
}
const BeneCard = ({ boxText }: BeneCardType) => {
	return (
		<div className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--card-bg-dark)]  w-[120px] px-[32px] py-[12px] gap-2 cursor-pointer'>
			<span className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
				<FaUserCircle size={32} />
			</span>
			<p className='font-medium text-md text-[var(--text)] dark:text-[var(--whites-dark)]'>
				{boxText}
			</p>
		</div>
	);
};

export default BeneCard;
