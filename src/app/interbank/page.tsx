'use client';
import AccountCard from '@/components/AccountCard';
import HeaderNav from '@/components/HeaderNav';
import HeaderSwitcher from '@/components/HeaderSwitcher';
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
				<div className='mainBody w-full md:ml-[210px]  ml-0'>
					<HeaderNav />
					<div className='accountCards shadow-md  md:px-[24px] px-[8px]   gap-2 py-[16px] flex items-center md:justify-start justify-between'>
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
					<div className='mainTransSection px-[8px] md:px-[24px] mt-[24px]'>
						<HeaderSwitcher
							buttonText1='Interbank Transfer'
							buttonText2='Intrabank Transfer'
							isFirst={true}
						/>
					</div>
				</div>
				{/* end of body */}
			</div>
		</ThemeProvider>
	);
};

export default Interbank;
