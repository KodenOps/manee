'use client';
import AccountCard from '@/components/AccountCard';
import BeneCard from '@/components/BeneficiaryBox';
import CardTitle from '@/components/CardTitle';
import HeaderNav from '@/components/HeaderNav';
import InterbankForm from '@/components/InterbankForm';
import IntrabankForm from '@/components/Intrabankforms';
import SideNav from '@/components/SideNav';
import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';

const Interbank = () => {
	const [isinter, setisinter] = useState(true);
	function toggleSwitcher(isinter: boolean) {
		setisinter(!isinter);
	}
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
						{/* <HeaderSwitcher
							buttonText1='Interbank Transfer'
							buttonText2='Intrabank Transfer'
							isFirst={isinter}
							actions={toggleSwitcher}
						/> */}

						{/* header switcher */}
						<div>
							{isinter ? (
								<div className='w-full shadow-md flex items-center justify-center md:h-[60px] h-[60px] rounded-sm'>
									<button
										className='leftMenu text-center bg-[var(--primary)] dark:bg-[var(--secondary-dark)] text-[var(--whites)] dark:text-[var(--primary-dark)] font-medium flex-1 h-full flex items-center md:text-lg text-[12px] justify-center'
										onClick={() => setisinter(true)}>
										Interbank Transfer
									</button>
									<button
										className='rightMenu text-center bg-[var(--whites)] font-medium text-[var(--text)] dark:bg-[var(--card-bg-dark)] dark:text-[var(--whites-dark)] flex-1 h-full flex items-center justify-center md:text-lg text-[12px] '
										onClick={() => {
											setisinter(false);
										}}>
										Intrabank Transfer
									</button>
								</div>
							) : (
								<>
									<div className='w-full shadow-md flex items-center justify-center md:h-[60px] h-[60px]'>
										<button
											className='leftMenu text-center bg-[var(--whites)] font-medium text-[var(--text)] dark:bg-[var(--card-bg-dark)] dark:text-[var(--whites-dark)] flex-1 h-full flex items-center justify-center md:text-lg text-[12px] '
											onClick={() => {
												setisinter(true);
											}}>
											Interbank Transfer
										</button>
										<button
											className='rightMenu text-center bg-[var(--primary)] dark:bg-[var(--secondary-dark)] text-[var(--whites)] dark:text-[var(--primary-dark)] font-medium flex-1 h-full flex items-center md:text-lg text-[12px]  justify-center'
											onClick={() => setisinter(false)}>
											Intrabank Transfer
										</button>
									</div>
								</>
							)}
						</div>
						<div className='mt-2'>
							<CardTitle title='Beneficiary' />
							<div className='beneficiary flex items-center justify-start overflow-x-scroll gap-6 py-4 scrollbar-hidden'>
								<BeneCard boxText='John, F' />
								<BeneCard boxText='Okoro, B' />
								<BeneCard boxText='Jessica, W' />
								<BeneCard boxText='John, A' />
								<BeneCard boxText='Okoro, B' />
								<BeneCard boxText='Jessica, W' />
								<BeneCard boxText='John, A' />
							</div>
						</div>

						{isinter ? <InterbankForm /> : <IntrabankForm />}
					</div>
					{/* History section */}
				</div>
				{/* end of body */}
			</div>
		</ThemeProvider>
	);
};

export default Interbank;
