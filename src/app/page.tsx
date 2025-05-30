'use client';
import React from 'react';
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

const Page = () => {
	const showAlert = () => {
		alert('button clicked');
	};
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
					<div className='w-full flex md:flex-row flex-col justify-between gap-2'>
						{/* account transactions */}
						<div className='md:w-[50%] w-full md:ml-[210px]'>
							<div className='  px-[8px] mt-4 shadow-md pb-4'>
								<CardTitle
									title='Quick Transactions'
									IconName={LuLayoutGrid}
								/>
								<div className='linkList mt-4 flex items-center md:justify-start px-2 justify-center md:gap-4 gap-2 w-full flex-wrap'>
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

export default Page;
