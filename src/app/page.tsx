import React from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import SideBar from '@/components/sidebar/page';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import CardTitle from '@/components/CardTitle';
import { LuLayoutGrid } from 'react-icons/lu';
import IconCard from '@/components/IconCard';
import BeneCard from '@/components/BeneficiaryBox';

const Page = () => {
	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'>
			<SideBar />
			<div className='w-[400px]'>
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
			</div>
		</ThemeProvider>
	);
};

export default Page;
