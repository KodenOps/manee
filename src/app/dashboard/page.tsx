'use client';
import React, { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import CardTitle from '@/components/CardTitle';
import { LuLayoutGrid } from 'react-icons/lu';
import IconCard from '@/components/IconCard';
import SideNav from '@/components/SideNav';
import AccountCard from '@/components/AccountCard';
import HeaderNav from '@/components/HeaderNav';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { RiWifiFill } from 'react-icons/ri';
import { TbMoneybag } from 'react-icons/tb';
import History from '@/components/History';
import { FaUserCog } from 'react-icons/fa';
import { FaRegEdit } from 'react-icons/fa';
import { FaRegCreditCard } from 'react-icons/fa';
import { GiUpgrade } from 'react-icons/gi';
import { MdLock } from 'react-icons/md';
import WithAuthentication from '@/components/WithAuthentication';
import supabase from '@/helper/supabaseClient';

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

					if (error) {
						console.error('Error fetching profile:', error);
					} else if (profile) {
						setUserProfile({
							...profile,
							email: user.email || '',
						});
					} else {
						console.warn('No profile found for user ID:', user.id);
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
			<div className=' flex bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px]'>
				<SideNav />
				<div className='w-full '>
					<HeaderNav userprofile={userProfile} />
					<div className='accountCards shadow-md md:ml-[210px] md:px-[24px] px-[8px] ml-0  gap-2 py-[16px] flex items-center md:justify-start justify-between'>
						<AccountCard
							accountBal={userProfile?.balance || 50000}
							accountNum={userProfile?.account_number || '0000000000'}
							accountType='Savings'
							accountName={
								userProfile?.first_name + ' ' + userProfile?.last_name
							}
						/>
					</div>
					<div className='w-full flex md:flex-row flex-col justify-between gap-2'>
						{/* account transactions */}
						<div className='md:w-[50%] w-full md:ml-[210px]'>
							<div className='  px-[8px] mt-4 shadow-md pb-4'>
								<CardTitle
									title='Quick Transactions'
									IconName={LuLayoutGrid}
								/>
								<div className='linkList mt-4 flex items-center md:justify-evenly px-2 justify-center md:gap-4 gap-2 w-full flex-wrap'>
									<IconCard
										IconName={FaMoneyBillTransfer}
										boxText='Intrabank Transfer'
										url='/interbank'
									/>
									<IconCard
										IconName={FaMoneyBillTransfer}
										boxText='Interbank Transfer'
										url='/interbank'
									/>
									<IconCard
										IconName={FiPhoneCall}
										boxText={`Buy \n Airtime`}
										url='/pay-bills'
									/>
									<IconCard
										IconName={RiWifiFill}
										boxText={`Buy \n Data`}
										url='/interbank'
									/>
									<IconCard
										IconName={TbMoneybag}
										boxText='Short-Term Loan'
										url='/interbank'
									/>
									<IconCard
										IconName={TbMoneybag}
										boxText='Short-Term Loan'
										url='/interbank'
									/>
									<IconCard
										IconName={TbMoneybag}
										boxText='Short-Term Loan'
										url='/interbank'
									/>
									<IconCard
										IconName={TbMoneybag}
										boxText='Short-Term Loan'
										url='/interbank'
									/>
								</div>
							</div>
							<div className='px-[8px] mt-4 shadow-md pb-4'>
								<CardTitle
									title='Profile Management'
									IconName={FaUserCog}
								/>
								<div className='linkList mt-4 flex items-center md:justify-around justify-center md:gap-4 gap-2 w-full flex-wrap'>
									<IconCard
										IconName={FaRegEdit}
										boxText='Account Update'
										url='/interbank'
									/>
									<IconCard
										IconName={FaRegCreditCard}
										boxText='Request For Debit Card'
										url='/interbank'
									/>
									<IconCard
										IconName={GiUpgrade}
										boxText='Upgrade Account'
										url='/interbank'
									/>
									<IconCard
										IconName={MdLock}
										boxText='Reset Authentications'
										url='/interbank'
									/>
								</div>
							</div>
						</div>

						{/* History section */}
						<div className='md:w-[45%] w-full  px-[8px] mt-4 shadow-md pb-4 mr-[24px]'>
							<History />
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default WithAuthentication(Page);
