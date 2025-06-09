'use client';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const page = () => {
	const [loginEmail, setloginEmail] = useState('');
	const [LoginPassword, setLoginPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();
	return (
		<section className='w-[500px] mx-auto mt-[100px] bg-[var(--whites)] dark:bg-[var(--primary-dark)] p-8 rounded-lg shadow-md'>
			<h2 className='md:text-2xl text-xl text-center pb-2 font-bold dark:text-[var(--secondary-dark)] text-[var(--primary-dark)] capitalize'>
				Login
			</h2>
			<p className='text-center pb-4 text-md'>
				Welcome Back! Kindly enter your login details below to access your
				account.
			</p>
			<form action=''>
				<InputField
					type='email' // Use "text" to allow formatting
					placeholder='Enter Email'
					value={loginEmail}
					onChange={(e) => setloginEmail(e.target.value)}
				/>
				<InputField
					type='password'
					placeholder='Enter Password'
					value={LoginPassword}
					onChange={(e) => setLoginPassword(e.target.value)}
				/>

				<Button
					text='Submit'
					type='primary'
					onclickfunction={() => alert('submit form?')}
				/>
				<Button
					text="Don't have an account? Register Instead"
					type='secondary'
					onclickfunction={(e) => {
						e.preventDefault();

						router.push('/register');
					}}
				/>
			</form>
		</section>
	);
};

export default page;
