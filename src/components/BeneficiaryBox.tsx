import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface BeneCardType {
	boxText: string;
}
const BeneCard = ({ boxText }: BeneCardType) => {
	return (
		<div className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--card-bg-dark)]  min-w-[140px] h-[80px] px-[16px] py-[12px] gap-2 cursor-pointer'>
			<span className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
				<FaUserCircle size={32} />
			</span>
			<p className='font-medium md:text-md text-sm text-[var(--text)] dark:text-[var(--whites-dark)] text-center w-full'>
				{boxText}
			</p>
		</div>
	);
};

export default BeneCard;
