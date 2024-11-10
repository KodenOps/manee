import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavBtnType {
	text: string;
	IconText: React.ComponentType<{ size?: number; color?: string }>;
	url: string;
}

const NavBtn = ({ text, IconText, url }: NavBtnType) => {
	const pathname = usePathname();
	const isActive = pathname === url;

	// Base classes for the button
	const baseClasses = 'flex items-center gap-4 w-full px-[24px] mb-4';
	// Conditional classes for active and inactive states
	const activeTextClasses =
		'text-[var(--primary)] dark:text-[var(--secondary-dark)] font-medium';
	const inactiveTextClasses =
		'text-[var(--text)] dark:text-[var(--whites-dark)] font-normal';
	const hoverClasses =
		'hover:text-[var(--primary)] dark:hover:text-[var(--secondary-dark)]';

	return (
		<Link
			href={url}
			className={`${baseClasses} ${
				isActive ? activeTextClasses : inactiveTextClasses
			} ${hoverClasses}`}>
			<span
				className={`text-[var(--greys)] ${
					isActive
						? 'dark:text-[var(--secondary-dark)]'
						: 'dark:text-[var(--whites-dark)]'
				}`}>
				<IconText size={16} />
			</span>
			<p className='text-sm'>{text}</p>
		</Link>
	);
};

export default NavBtn;
