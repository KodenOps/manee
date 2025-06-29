import Link from 'next/link';
import React from 'react';
interface iconcardType {
	boxText: string;
	onclickFunction?: () => void;
	IconName: React.ComponentType<{ size?: number; color?: string }>;
	url?: string;
}
const IconCard = ({
	boxText,
	IconName,
	url,
	onclickFunction,
}: iconcardType) => {
	return (
		<Link
			href={url || '#'}
			onClick={onclickFunction}
			className='flex justify-center items-center shadow-sm rounded-[10px] dark:bg-[var(--card-bg-dark)]  md:w-[120px] w-[100px] py-[24px] gap-2 cursor-pointer px-[8px] md:h-[120px] mb-4 border-[var(--primary)] dark:border-[var(--card-bg-dark)] hover:-translate-y-2 ease-in duration-1000 transition-transform border-2 h-[100px]'>
			<p className='font-medium text-[var(--text)] dark:text-[var(--whites-dark)] w-full  text-center text-[12px] '>
				<span className='text-[var(--greys)] dark:text-[var(--accents)] md:text-[24px] text-[18px] w-full justify-center flex items-center mb-2'>
					<IconName />
				</span>
				{boxText}
			</p>
		</Link>
	);
};

export default IconCard;
