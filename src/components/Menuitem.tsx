import React from 'react';

interface MenuItem {
	label: string;
	onClick: () => void;
}

interface MenuitemsProps {
	items: MenuItem[];
	dropdownRef?: React.RefObject<HTMLDivElement>;
}

const Menuitems: React.FC<MenuitemsProps> = ({ items, dropdownRef }) => {
	return (
		<div
			ref={dropdownRef}
			className='absolute right-6 mt-2 z-50 w-[200px] rounded-lg shadow-md bg-white dark:bg-[var(--card-bg-dark)] border border-gray-200 dark:border-gray-600'>
			<ul className='py-2 text-sm text-gray-700 dark:text-gray-200'>
				{items.map((item, index) => (
					<li key={index}>
						<button
							onClick={item.onClick}
							className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
							{item.label}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Menuitems;
