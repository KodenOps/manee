'use client';
import AccountCard from '@/components/AccountCard';
import BeneCard from '@/components/BeneficiaryBox';
import CardTitle from '@/components/CardTitle';
import HeaderNav from '@/components/HeaderNav';
import History from '@/components/History';
import InterbankForm from '@/components/InterbankForm';
import IntrabankForm from '@/components/Intrabankforms';
import SideNav from '@/components/SideNav';
import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { beneficiaries } from '@/data/beneficiary';
import { FaUserCircle } from 'react-icons/fa';

// Define the type for userBankInfo
interface UserBankInfo {
	id: string;
	shortName: string;
	fullName: string;
	bankName: string;
	accountNumber: string;
}

const Interbank = () => {
	const [isinter, setisinter] = useState(true);

	// Use the defined type for userBankInfo
	const [userBankInfo, setuserBankInfo] = useState<UserBankInfo>({
		id: '',
		shortName: '',
		fullName: '',
		bankName: '',
		accountNumber: '',
	});
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
							accountNum='2033228354'
							accountType='Savings'
						/>
					</div>
					<div className='flex w-full items-start justify-start mt-4 py-8'>
						<div className='mainTransSection px-[8px] md:ml-[210px] md:pr-[16px]  flex-1 ml-0 md:w-[45%] w-full shadow-md pb-8'>
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
								<CardTitle title='Beneficiaries' />
								<div className='beneficiary flex items-center justify-start overflow-x-scroll gap-6 py-4 scrollbar-hidden'>
									{beneficiaries.map((beneficiary) => {
										return (
											<div
												key={beneficiary.id}
												className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--card-bg-dark)]  min-w-[140px] h-[80px] px-[16px] py-[12px] gap-2 cursor-pointer'
												onClick={() => {
													setuserBankInfo({
														id: beneficiary.id,
														shortName: beneficiary.shortName || '', // Handle null values
														fullName: beneficiary.fullName,
														bankName: beneficiary.bankName,
														accountNumber: beneficiary.accountNumber,
													});
													console.log(beneficiary);
												}}>
												<span className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
													<FaUserCircle size={32} />
												</span>
												<p className='font-medium md:text-md text-sm text-[var(--text)] dark:text-[var(--whites-dark)] text-center w-full'>
													{beneficiary.shortName}
												</p>
											</div>
										);
									})}
								</div>
							</div>

							{isinter ? (
								<InterbankForm
									id={userBankInfo.id}
									accountNumber={userBankInfo.accountNumber}
									shortName={userBankInfo.shortName}
									fullName={userBankInfo.fullName}
									bankName={userBankInfo.bankName}
								/>
							) : (
								<IntrabankForm />
							)}
						</div>
						{/* History section */}
						<div className='pb-8 shadow-md w-full pr-[16px] md:block hidden'>
							<History />
						</div>
					</div>
				</div>
				{/* end of body */}
			</div>
		</ThemeProvider>
	);
};

export default Interbank;
