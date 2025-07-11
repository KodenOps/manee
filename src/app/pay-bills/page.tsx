'use client';
import AccountCard from '@/components/AccountCard';
import CardTitle from '@/components/CardTitle';
import HeaderNav from '@/components/HeaderNav';
import SideNav from '@/components/SideNav';
import SmIconCard from '@/components/SmallIconCard';
import React, { useEffect, useState } from 'react';
import { MdFlashOn } from 'react-icons/md';
import { PiTelevisionBold } from 'react-icons/pi';
import { ThemeProvider } from 'next-themes';
import supabase from '@/helper/supabaseClient';
import WithAuthentication from '@/components/WithAuthentication';

type UserProfile = {
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
};
const page = () => {
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
		<div className='flex items-start justify-start w-full'>
			<SideNav />
			<div className='w-full md:ml-[210px] '>
				<HeaderNav userprofile={userProfile} />
				<div className='accountCards shadow-md md:px-[24px] px-[8px] ml-0  gap-2 py-[16px] flex items-center md:justify-start justify-between'>
					<AccountCard
						accountBal={userProfile?.balance || 50000}
						accountNum={userProfile?.account_number || '0000000000'}
						accountType='Savings'
						accountName={userProfile?.first_name + ' ' + userProfile?.last_name}
					/>
				</div>
				<div className='flex justify-start items-start md:px-[24px]  w-full md:flex-row flex-col'>
					<div className='chooseBill px-[8px] py-[16px] md:pr-[16px]  flex-1 ml-0  w-full shadow-md pb-8'>
						{/* electricity section */}
						<div className='electricity border-[1px] border-[#c4c4c438] p-2 mb-2 rounded-[10px]'>
							<CardTitle
								title='Cable TV'
								IconName={PiTelevisionBold}
							/>
							<div className='linkList mt-4 flex items-center md:justify-between justify-center gap-2 w-full px-[24px] flex-wrap'>
								<SmIconCard
									IconName={PiTelevisionBold}
									boxText='DSTV'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={PiTelevisionBold}
									boxText='GOTV'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={PiTelevisionBold}
									boxText='STARTIMES'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={PiTelevisionBold}
									boxText='NetFlix'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={PiTelevisionBold}
									boxText='Kwese TV'
									url='/pay-bills'
								/>
							</div>
						</div>
						{/* Cable TV */}
						<div className='electricity border-[1px] border-[#c4c4c438] p-2 mb-2 rounded-[10px]'>
							<CardTitle
								title='Electricity'
								IconName={MdFlashOn}
							/>
							<div className='linkList mt-4 flex items-center md:justify-between justify-center gap-2 w-full px-[24px] flex-wrap'>
								<SmIconCard
									IconName={MdFlashOn}
									boxText='IKEDC'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={MdFlashOn}
									boxText='IBEDC'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={MdFlashOn}
									boxText='EKEDC'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={MdFlashOn}
									boxText='Enugu Disco'
									url='/pay-bills'
								/>
								<SmIconCard
									IconName={MdFlashOn}
									boxText='KAEDCO'
									url='/pay-bills'
								/>
							</div>
						</div>
					</div>
					<div className='form px-[8px]  md:pr-[16px]  flex-1 ml-0  w-full shadow-md pb-8'>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis
						quis voluptatem dolore asperiores et aperiam provident quos,
						nesciunt beatae ex sequi molestias suscipit? Laboriosam laborum
						autem consequuntur voluptate unde illum quia perferendis culpa
						dolorem fugit voluptatum nisi esse eaque provident, aliquam impedit
						nihil et omnis hic iste earum labore! Ratione.
					</div>
				</div>
			</div>
		</div>
	);
};

export default WithAuthentication(page);
