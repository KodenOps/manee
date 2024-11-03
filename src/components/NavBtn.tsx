import React from 'react';

interface NavBtnType {
	text: string;
	IconText: React.ComponentType<{ size?: number; color?: string }>;
}
const NavBtn = ({ text, IconText }: NavBtnType) => {
	return (
		<button className='flex items-center gap-4 w-full px-[24px] text-[var(--text)] dark:text-[var(--whites-dark)] mb-4 hover:text-[var(--primary)] dark:hover:text-[var(--secondary-dark)]  font-normal'>
			<span className='text-[var(--greys)] dark:text-[var(--secondary-dark)]'>
				<IconText size={16} />
			</span>
			<p className='text-sm'>{text}</p>
		</button>
	);
};

export default NavBtn;
