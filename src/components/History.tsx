import React, { useState, useRef, useEffect } from 'react';
import CardTitle from './CardTitle';
import { GiOpenBook } from 'react-icons/gi';
import HistoryDeets from './HistoryDeets';
import { IoMdTrendingUp } from 'react-icons/io';
import { IoMdTrendingDown } from 'react-icons/io';
import Menuitems from './Menuitem';

const History = () => {
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const kebabRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!kebabRef.current?.contains(event.target as Node)
			) {
				setOpenMenu(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className='w-full relative'>
			<CardTitle
				title='Past Transactions'
				handleMenuClick={() =>
					setOpenMenu((prev) => (prev === 'history' ? null : 'history'))
				}
				IconName={GiOpenBook}
				menuRef={kebabRef}
			/>
			{openMenu === 'history' && (
				<Menuitems
					items={[
						{
							label: 'Menu 1',
							onClick: () => setOpenMenu(null),
						},
						{
							label: 'Menu 2',
							onClick: () => setOpenMenu(null),
						},
					]}
					dropdownRef={dropdownRef}
				/>
			)}

			<div className='historydetails'>
				<HistoryDeets
					headertext='Transfer Failed'
					time='2 Hours Ago'
					parag='Transfer of #4,500 to 2011032044 was failed...'
					IconName={IoMdTrendingUp}
					isSuccess={false}
				/>
				<HistoryDeets
					headertext='Credit Alert'
					time='2 Minutes Ago'
					parag='#4,500 was successfully received from jo...'
					IconName={IoMdTrendingDown}
					isSuccess={true}
				/>
				<HistoryDeets
					headertext='Transfer Failed'
					time='24 Nov'
					parag='Transfer of #4,500 to 2011032044 was failed...'
					IconName={IoMdTrendingUp}
					isSuccess={false}
				/>
				<HistoryDeets
					headertext='Credit Alert'
					time='10 Aug'
					parag='#42,700 was successfully received from Mi...'
					IconName={IoMdTrendingDown}
					isSuccess={true}
				/>
				<HistoryDeets
					headertext='Transfer Failed'
					time='24 Nov'
					parag='Transfer of #4,500 to 2011032044 was failed...'
					IconName={IoMdTrendingUp}
					isSuccess={false}
				/>
				<HistoryDeets
					headertext='Credit Alert'
					time='10 Aug'
					parag='#42,700 was successfully received from Mi...'
					IconName={IoMdTrendingDown}
					isSuccess={true}
				/>
				<HistoryDeets
					headertext='Transfer Failed'
					time='24 Nov'
					parag='Transfer of #4,500 to 2011032044 was failed...'
					IconName={IoMdTrendingUp}
					isSuccess={false}
				/>
			</div>
		</div>
	);
};

export default History;
