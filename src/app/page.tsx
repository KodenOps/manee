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
					<div className='w-full '>
						<div className='md:w-[50%] w-full md:ml-[210px] px-[8px] mt-4 shadow-md pb-4'>
							<CardTitle
								title='Quick Transactions'
								IconName={LuLayoutGrid}
							/>
							<div className='linkList mt-4 flex items-center md:justify-around justify-center md:gap-4 gap-2 w-full flex-wrap'>
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
									url='/interbank'
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
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default Page;
