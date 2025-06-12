import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface NavBtnType {
	text: string;
	IconText: React.ComponentType<{ size?: number; color?: string }>;
	url: string;
	color?: string;
}

const NavBtn = ({ text, IconText, url, color }: NavBtnType) => {
	const pathname = usePathname();
	const isActive = pathname === url;

	// Base classes for the button
	const baseClasses = `flex items-center gap-4 w-full px-[24px] mb-4 `;
	// Conditional classes for active and inactive states
	const activeTextClasses = ` dark:text-[var(--secondary-dark)] font-medium `;
	const inactiveTextClasses = `text-[var(--text)] dark:text-[var(--whites-dark)] font-normal `;
	const hoverClasses =
		'hover:text-[var(--primary)] dark:hover:text-[var(--secondary-dark)]';

	return (
		<Link
			href={url}
			className={`${baseClasses} ${color}  ${
				isActive ? activeTextClasses : inactiveTextClasses
			} ${hoverClasses} `}>
			<span
				className={`${!color ? 'text-[var(--greys)]' : `${color}`} ${
					isActive
						? `${!color ? 'dark:text-[var(--secondary-dark)]' : `${color}`}`
						: `${!color ? 'dark:text-[var(--whites-dark)]' : `${color}`}`
				}`}>
				<IconText size={16} />
			</span>
			<p className={`${color} text-sm`}>{text}</p>
		</Link>
	);
};

export default NavBtn;
