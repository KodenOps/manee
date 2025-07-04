'use client';
import HeaderNav from '@/components/HeaderNav';
import React, { useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { ThemeProvider } from 'next-themes';
import SideNav from '@/components/SideNav';
import AccountCard from '@/components/AccountCard';
import { LuLayoutGrid } from 'react-icons/lu';
import Menuitems from '@/components/Menuitem';
import CardTitle from '@/components/CardTitle';
import { useUser } from '@/components/UserContext';
import GoalProgress from '@/components/GoalProgress';
import ProgessCard from '@/components/ProgessCard';
type UserProfile = {
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
};
const page = () => {
	const { userProfile, loading } = useUser();
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
		<div className='  bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px] w-full overflow-x-hidden'>
			<SideNav />
			<HeaderNav userprofile={userProfile} />
			<div className='mainbody md:ml-[210px] '>
				<div className='accountCards shadow-md  md:px-[24px] px-[8px] ml-0 gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto md:mt-0 mt-[80px]'>
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
						accountType='Income'
						accountName={`${userProfile.first_name} ${userProfile.last_name}`}
					/>
				</div>
				<div className='flex mt-4 '>
					<div className='top flex items-start justify-around w-full '>
						<CardTitle
							title='My Budgets'
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
					</div>
				</div>
				<div className='maincharts px-8 flex flex-wrap w-full items-center justify-between mt-4'>
					<ProgessCard />
					<ProgessCard />
					<ProgessCard />
					<ProgessCard />
				</div>
			</div>
		</div>
	);
};

export default page;
