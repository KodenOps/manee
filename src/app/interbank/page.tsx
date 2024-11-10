'use client';
import AccountCard from '@/components/AccountCard';
import HeaderNav from '@/components/HeaderNav';
import SideNav from '@/components/SideNav';
import { ThemeProvider } from 'next-themes';
import React from 'react';

const Interbank = () => {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'>
			<div className=' flex'>
				<SideNav />
				<div className='mainBody w-full'>
					<HeaderNav />
					<div className='accountCards shadow-md md:ml-[210px] md:px-[24px] px-[8px] ml-0  gap-2 py-[16px] flex items-center md:justify-start justify-between'>
						<AccountCard
							accountBal={2039123}
							accountNum='2034320099'
							accountType='Current'
						/>
						<AccountCard
							accountBal={2039123}
							accountNum='2033223344'
							accountType='Savings'
						/>
					</div>
				</div>
				{/* end of body */}
			</div>
		</ThemeProvider>
	);
};

export default Interbank;
