'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import CardTitle from '@/components/CardTitle';
import { LuLayoutGrid } from 'react-icons/lu';
import IconCard from '@/components/IconCard';
import SideNav from '@/components/SideNav';
import AccountCard from '@/components/AccountCard';
import HeaderNav from '@/components/HeaderNav';
import {
	FaBullseye,
	FaGamepad,
	FaHandHoldingDollar,
	FaMoneyBillTransfer,
	FaScaleBalanced,
} from 'react-icons/fa6';
import { GiPayMoney, GiUpgrade } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { RiWifiFill } from 'react-icons/ri';
import { TbMoneybag } from 'react-icons/tb';
import History from '@/components/History';
import {
	FaUserCog,
	FaRegEdit,
	FaRegCreditCard,
	FaHandHoldingUsd,
} from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import WithAuthentication from '@/components/WithAuthentication';
import supabase from '@/helper/supabaseClient';
import Menuitems from '@/components/Menuitem';
import CreateRoomModal from '@/components/CreateRoomModal';
import NavBox from '@/components/NavBox';
import { AiOutlinePieChart } from 'react-icons/ai';

type UserProfile = {
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
};

const Page = () => {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [openMenu, setOpenMenu] = useState<string | null>(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const userResponse = await supabase.auth.getUser();
				const user = userResponse.data.user;

				if (user) {
					const { data: profile, error } = await supabase
						.from('profiles')
						.select('first_name, last_name, account_number, balance')
						.eq('id', user.id)
						.single();

					if (!error && profile) {
						setUserProfile({
							...profile,
							email: user.email || '',
						});
					}
				}
			} catch (error) {
				console.error('Unexpected error fetching profile:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

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

					<div className='accountCards shadow-md md:ml-[210px] md:px-[24px] px-[8px] ml-0 gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto'>
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
									title='Main Menu'
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
									{showModal && (
										<CreateRoomModal onClose={() => setShowModal(false)} />
									)}
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
										url='#'
									/>
									<NavBox
										IconName={FaBullseye}
										boxText='Personal Goals'
										subtext='Track financial goals'
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
										boxText='Finance Management'
										subtext='Track your finance'
										url='#'
									/>
									<NavBox
										IconName={FaScaleBalanced}
										boxText='Finance Management'
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
