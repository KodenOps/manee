import Link from 'next/link';
import React from 'react';
interface iconcardType {
	boxText: string;
	IconName: React.ComponentType<{ size?: number; color?: string }>;
	url: string;
}
const IconCard = ({ boxText, IconName, url }: iconcardType) => {
	return (
		<Link
			href={url}
			className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--card-bg-dark)]  md:w-[150px] w-[100px] py-[24px] gap-2 cursor-pointer px-[8px] md:h-[120px] mb-4 border-0 hover:-translate-y-2 ease-in duration-1000 transition-transform'>
			<span className='text-[var(--greys)] dark:text-[var(--accents)] md:text-[24px] text-[18px]'>
				<IconName />
			</span>
			<p className='font-medium text-md text-[var(--text)] dark:text-[var(--whites-dark)] w-[80px]  text-center md:text-[14px] text-[12px] whitespace-pre-line'>
				{boxText}
			</p>
		</Link>
	);
};

export default IconCard;
