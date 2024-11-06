'use client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import CardTitle from '@/components/CardTitle';
import { LuLayoutGrid } from 'react-icons/lu';
import IconCard from '@/components/IconCard';
import BeneCard from '@/components/BeneficiaryBox';
import HeaderSwitcher from '@/components/HeaderSwitcher';
import SideNav from '@/components/SideNav';
import AccountCard from '@/components/AccountCard';
import HeaderNav from '@/components/HeaderNav';
const Page = () => {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'>
			<div className=' flex'>
				<SideNav />
				<div className='w-full'>
					<HeaderNav />
					<div className='md:ml-[210px] pl-[24px] ml-0 pr-[40px] gap-4 py-[16px] flex items-center justify-start'>
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
					<div className='w-[400px] md:ml-[210px] px-[8px]'>
						<p className='my-2'></p>
						<InputField
							type='password'
							placeholder='Enter Text'
							withDesc={false}
							infoText='Femi-fadiya'
						/>
						<p className='my-2'></p>
						<Button
							text='Submit'
							type='primary'
						/>
						<p className='my-2'></p>
						<CardTitle
							title='Past Transactions'
							IconName={LuLayoutGrid}
						/>
						<IconCard
							IconName={LuLayoutGrid}
							boxText='Transfer'
						/>
						<BeneCard boxText='Transfer' />
						<p className='my-2'></p>
						<HeaderSwitcher
							buttonText1='InterBank Transfer'
							buttonText2='IntraBank Transfer'
							isFirst={false}
						/>
						<p className='my-2'>-</p>
						<p className='my-2'>-</p>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default Page;
