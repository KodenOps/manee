'use client';
import React from 'react';
import NavBtn from './NavBtn';
import { LuLayoutGrid } from 'react-icons/lu';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { RiWifiFill } from 'react-icons/ri';
import { TbMoneybag } from 'react-icons/tb';
import supabase from '@/helper/supabaseClient'; // Adjust the import path as necessary
import { useRouter } from 'next/navigation';
import { MdLogout } from 'react-icons/md';
import { BsBank } from 'react-icons/bs';
import { GoTelescope } from 'react-icons/go';

const SideBtns = () => {
	const router = useRouter();

	return (
		<div>
			{/* FIRST LINK BOX */}
			<div className='topLinks mt-0'>
				<NavBtn
					text='Dashboard'
					IconText={LuLayoutGrid}
					url='/dashboard'
				/>
				<h4 className='px-[24px] font-medium text-sm mt-8 mb-4 tracking-wider text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					MY FINANCE
				</h4>
				{/* <NavBtn
					text='Transfers'
					IconText={FaMoneyBillTransfer}
					url='/interbank'
				/> */}
				<NavBtn
					text='My Goals'
					IconText={GiPayMoney}
					url='/mygoals'
				/>
				<NavBtn
					text='My Budgets'
					IconText={FiPhoneCall}
					url='/budget'
				/>
				<NavBtn
					text='My Loans'
					IconText={BsBank}
					url='#'
				/>
				<NavBtn
					text='My Expenses'
					IconText={BsBank}
					url='/my-expenses'
				/>
				<NavBtn
					text='Finance Overview'
					IconText={GoTelescope}
					url='#'
				/>
			</div>
			{/* SECOND LINK BOX */}
			<div className='topLinks mt-[32px]'>
				<h4 className='px-[24px] font-medium text-sm mt-4 mb-4 tracking-wider text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					SETTINGS
				</h4>
				<NavBtn
					text='Account Update'
					IconText={FaMoneyBillTransfer}
					url='/account-update'
				/>
				<NavBtn
					text='Complaints'
					IconText={GiPayMoney}
					url='/complaints'
				/>
				<NavBtn
					text='Requests'
					IconText={GiPayMoney}
					url='/requests'
				/>
				<NavBtn
					text='Logout'
					color='text-[red] dark:text-[var(--darkred)] py-4 font-semibold'
					IconText={MdLogout}
					url='/login'
				/>
			</div>
		</div>
	);
};

export default SideBtns;
