'use client';
import AccountCard from '@/components/AccountCard';
import BeneCard from '@/components/BeneficiaryBox';
import CardTitle from '@/components/CardTitle';
import HeaderNav from '@/components/HeaderNav';
import HeaderSwitcher from '@/components/HeaderSwitcher';
import History from '@/components/History';
import InterbankForm from '@/components/InterbankForm';
import SideNav from '@/components/SideNav';
import { ThemeProvider } from 'next-themes';
import React from 'react';

const Interbank = () => {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'>
			<div className=' flex bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px]'>
				<SideNav />
				<div className='w-full '>
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

					<div className='mainTransSection px-[8px] md:ml-[210px] md:px-[24px]  flex-1 ml-0 md:w-[45%] w-full'>
						<HeaderSwitcher
							buttonText1='Interbank Transfer'
							buttonText2='Intrabank Transfer'
							isFirst={true}
						/>
						<div className='mt-2'>
							<CardTitle title='Beneficiary' />
							<div className='beneficiary flex items-center justify-start overflow-x-scroll gap-4 py-4 scrollbar-hidden'>
								<BeneCard boxText='John, F' />
								<BeneCard boxText='Okoro, B' />
								<BeneCard boxText='Jessica, W' />
								<BeneCard boxText='John, A' />
								<BeneCard boxText='Okoro, B' />
								<BeneCard boxText='Jessica, W' />
								<BeneCard boxText='John, A' />
							</div>
						</div>

						<div>
							<InterbankForm />
						</div>
					</div>
					{/* History section */}
				</div>
				{/* end of body */}
			</div>
		</ThemeProvider>
	);
};

export default Interbank;
