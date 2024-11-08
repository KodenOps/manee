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
const SideNav = () => {
	return (
		<div className='w-[210px] bg-[var(--whites)] dark:bg-[var(--primary-dark)] h-screen border-r-2 dark:border-r-slate-700 md:flex flex-col justify-between fixed hidden'>
			<div className='w-full  mt-[32px]'>
				<Logo />
				{/* FIRST LINK BOX */}
				<div className='topLinks mt-[32px]'>
					<NavBtn
						text='Dashboard'
						IconText={LuLayoutGrid}
					/>
					<h4 className='px-[24px] font-medium text-sm mt-4 mb-2 tracking-wider dark:text-[var(--whites-dark)] '>
						TRANSACT
					</h4>
					<NavBtn
						text='Transfers'
						IconText={FaMoneyBillTransfer}
					/>
					<NavBtn
						text='Pay Bills'
						IconText={GiPayMoney}
					/>
					<NavBtn
						text='Airtime Purchase'
						IconText={FiPhoneCall}
					/>
					<NavBtn
						text='Data Purchase'
						IconText={RiWifiFill}
					/>
					<NavBtn
						text='Quick Loans'
						IconText={TbMoneybag}
					/>
				</div>
				{/* SECOND LINK BOX */}
				<div className='topLinks mt-[32px]'>
					<h4 className='px-[24px] font-medium text-sm mt-4 mb-2 tracking-wider dark:text-[var(--whites-dark)] '>
						ACCOUNT
					</h4>
					<NavBtn
						text='Account Update'
						IconText={FaMoneyBillTransfer}
					/>
					<NavBtn
						text='Complaints'
						IconText={GiPayMoney}
					/>
					<NavBtn
						text='Requests'
						IconText={GiPayMoney}
					/>
				</div>
			</div>
			<div className='img w-full flex-2  pb-4 flex items-end   justify-center'>
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
