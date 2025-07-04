'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import CardTitle from '@/components/CardTitle';
import { LuLayoutGrid } from 'react-icons/lu';
import SideNav from '@/components/SideNav';
import AccountCard from '@/components/AccountCard';
import HeaderNav from '@/components/HeaderNav';
import {
	FaBullseye,
	FaHandHoldingDollar,
	FaMoneyBillTransfer,
	FaScaleBalanced,
} from 'react-icons/fa6';

import WithAuthentication from '@/components/WithAuthentication';
import supabase from '@/helper/supabaseClient';
import Menuitems from '@/components/Menuitem';
import NavBox from '@/components/NavBox';
import { AiOutlinePieChart } from 'react-icons/ai';
import { useUser } from '@/components/UserContext';
import { BsBank } from 'react-icons/bs';

type UserProfile = {
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
};

const Page = () => {
	const { userProfile, loading } = useUser();
	const [showModal, setShowModal] = useState(false);
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	if (loading || !userProfile) {
		return (
			<ThemeProvider
				attribute='class'
				defaultTheme='system'>
				<div className='text-center mt-20 text-gray-500 dark:text-gray-400'>
					Loading profile...
				</div>
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'>
			<div className='flex bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px] w-full overflow-x-hidden'>
				<SideNav />
				<div className='w-full'>
					<HeaderNav userprofile={userProfile} />

					<div className='accountCards shadow-md md:ml-[210px] md:px-[24px] px-[8px] ml-0 gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto md:mt-0 mt-[80px]'>
						{/* {[...Array(2)].map((_, idx) => ( */}
						<AccountCard
							// key={idx}
							accountBal={userProfile.balance}
							accountNum={userProfile.account_number}
							accountType='Income'
							accountName={`${userProfile.first_name} ${userProfile.last_name}`}
						/>
						<AccountCard
							// key={idx}
							accountBal={userProfile.balance}
							accountNum={userProfile.account_number}
							accountType='Savings'
							accountName={`${userProfile.first_name} ${userProfile.last_name}`}
						/>
					</div>

					{/* <div className='w-full  gap-4'> */}
					{/* Left section */}
					<div className=' md:ml-[210px] flex  '>
						<div className='top flex items-start justify-around w-full'>
							{/* Quick Transactions */}
							<div className='px-[8px] mt-4 shadow-md pb-4 relative flex-1 w-full'>
								<CardTitle
									title='What Are We doing today?'
									handleMenuClick={() =>
										setOpenMenu((prev) => (prev === 'quick' ? null : 'quick'))
									}
									IconName={LuLayoutGrid}
								/>
								{openMenu === 'quick' && (
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
									/>
								)}
								<div className='linkList mt-4 flex items-center md:justify-around justify-center md:gap-4 px-4 gap-2 w-full flex-wrap'>
									<NavBox
										IconName={FaMoneyBillTransfer}
										boxText='Fund Transfer'
										subtext='Send money to Friends'
										url='/interbank'
									/>
									<NavBox
										IconName={AiOutlinePieChart}
										boxText='Personal Budgets'
										subtext='Track monthly budget'
										url='/budget'
									/>
									<NavBox
										IconName={FaBullseye}
										boxText='Personal Goals'
										subtext='Track financial goals'
										url='/mygoals'
									/>
									<NavBox
										IconName={BsBank}
										boxText='Loan Management'
										subtext='Track your Debts'
										url='#'
									/>
									<NavBox
										IconName={FaHandHoldingDollar}
										boxText='Thrift (Ajo) Contribution'
										subtext='Save with friends '
										url='#'
									/>
									<NavBox
										IconName={FaScaleBalanced}
										boxText='Finance Overview'
										subtext='Track your finance'
										url='#'
									/>
								</div>
							</div>
						</div>
					</div>
					{/* </div> */}
				</div>
			</div>
		</ThemeProvider>
	);
};

export default WithAuthentication(Page);
