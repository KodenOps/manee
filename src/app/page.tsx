import React from 'react';
import { ThemeProvider, useTheme } from 'next-themes';
import SideBar from '@/components/sidebar/page';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
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
					type='secondary'
				/>
			</div>
		</ThemeProvider>
	);
};

export default Page;
