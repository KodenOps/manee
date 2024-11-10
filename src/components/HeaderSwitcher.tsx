'use client';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';

interface buttonType {
	buttonText1: string;
	buttonText2: string;
	isFirst: boolean;
	action?: () => void;
}
const HeaderSwitcher = ({
	buttonText1,
	buttonText2,
	isFirst = true,
}: buttonType) => {
	const { theme, setTheme } = useTheme();
	const [isFirstActive, setisFirstActive] = useState(isFirst);
	return (
		<div>
			{isFirstActive ? (
				<div className='w-full shadow-md flex items-center justify-center md:h-[60px] h-[60px] rounded-sm'>
					<button
						className='leftMenu text-center bg-[var(--primary)] dark:bg-[var(--secondary-dark)] text-[var(--whites)] dark:text-[var(--primary-dark)] font-medium flex-1 h-full flex items-center justify-center'
						onClick={() => {
							setisFirstActive(true);
						}}>
						{buttonText1}
					</button>
					<button
						className='rightMenu text-center bg-[var(--whites)] font-medium text-[var(--text)] dark:bg-[var(--card-bg-dark)] dark:text-[var(--whites-dark)] flex-1 h-full flex items-center justify-center'
						onClick={() => {
							setisFirstActive(false);
						}}>
						{buttonText2}
					</button>
				</div>
			) : (
				<>
					<div className='w-full shadow-md flex items-center justify-center md:h-[60px] h-[60px]'>
						<button
							className='leftMenu text-center bg-[var(--whites)] font-medium text-[var(--text)] dark:bg-[var(--card-bg-dark)] dark:text-[var(--whites-dark)] flex-1 h-full flex items-center justify-center'
							onClick={() => {
								setisFirstActive(true);
							}}>
							{buttonText1}
						</button>
						<button
							className='rightMenu text-center bg-[var(--primary)] dark:bg-[var(--secondary-dark)] text-[var(--whites)] dark:text-[var(--primary-dark)] font-medium flex-1 h-full flex items-center justify-center'
							onClick={() => {
								setisFirstActive(false);
							}}>
							{buttonText2}
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default HeaderSwitcher;
