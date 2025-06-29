import Link from 'next/link';
import React from 'react';
interface iconcardType {
	boxText: string;
	subtext?: string;
	onclickFunction?: () => void;
	IconName: React.ComponentType<{ size?: number; color?: string }>;
	url?: string;
}
const NavBox = ({
	boxText,
	IconName,
	url,
	subtext,
	onclickFunction,
}: iconcardType) => {
	return (
		<Link
			href={url || '#'}
			onClick={onclickFunction}
			className='md:w-[200px] w-[150px] h-[200px]  bg-slate-300  shadow-sm rounded-[10px] dark:bg-[var(--card-bg-dark)]   py-[24px] gap-2 cursor-pointer px-4  mb-4 border-[var(--primary)] dark:border-[var(--card-bg-dark)] hover:-translate-y-2 ease-in duration-1000 transition-transform border-2 relative flex flex-col justify-between '>
			<p className=' text-[var(--greys)] dark:text-[var(--accents)] md:text-[24px] text-[18px] w-full  mb-2'>
				<IconName size={40} />
			</p>
			<div className='md:w-[90%] w-full'>
				<p className='font-medium text-[var(--text)] dark:text-[var(--whites-dark)] w-full px-0  md:text-[24px] text-[20px]'>
					{boxText}
				</p>
				<p className=' text-[var(--text)] dark:text-[var(--whites-dark)] w-full  md:text-[14px] text-[10px] '>
					{subtext}
				</p>
			</div>
		</Link>
	);
};

export default NavBox;
