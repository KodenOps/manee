import React from 'react';
import Logo from './Logo';
import NavBtn from './NavBtn';
import { LuLayoutGrid } from 'react-icons/lu';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { RiWifiFill } from 'react-icons/ri';
import { TbMoneybag } from 'react-icons/tb';
import Image from 'next/image';
import navImg from '../../public/assets/navimg.svg';
import SideBtns from './SideBtns';

const SideNav = () => {
	return (
		<div className='w-[210px] bg-[var(--whites)] dark:bg-[var(--primary-dark)] h-screen border-r-2 dark:border-r-slate-700 md:flex flex-col justify-between fixed hidden z-[100]'>
			<div className='w-full mt-[32px]'>
				<Logo />
				<SideBtns />
			</div>
			<div className='img w-full flex-2 pb-4 flex items-end justify-center'>
				<Image
					src={navImg}
					alt='sidebar images'
					width={140}
					height={100}
				/>
			</div>
		</div>
	);
};

export default SideNav;
