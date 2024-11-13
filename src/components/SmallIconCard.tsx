import Link from 'next/link';
import React from 'react';
interface SmiconcardType {
	boxText: string;
	IconName: React.ComponentType<{ size?: number; color?: string }>;
	url: string;
}
const SmIconCard = ({ boxText, IconName, url }: SmiconcardType) => {
	return (
		<Link
			href={url}
			className='flex flex-col items-center shadow-sm rounded-[5px] dark:bg-[var(--card-bg-dark)]  md:w-[100px] w-[100px] py-[10px] gap-2 cursor-pointer px-[8px] mb-4 border-0 hover:-translate-y-2 ease-in duration-1000 transition-transform'>
			<span className='text-[var(--greys)] dark:text-[var(--accents)] md:text-[24px] text-[18px]'>
				<IconName />
			</span>
			<p className='text-md text-[var(--text)] dark:text-[var(--whites-dark)] w-[80px]  text-center md:text-[14px] text-[12px] whitespace-pre-line'>
				{boxText}
			</p>
		</Link>
	);
};

export default SmIconCard;
