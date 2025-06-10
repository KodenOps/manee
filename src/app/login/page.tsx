'use client';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import supabase from '@/helper/supabaseClient';
import bg from '../../../public/assets/bg-login.png';
import logo from '../../../public/assets/logo.svg';
import Image from 'next/image';
supabase.auth.signOut();
const page = () => {
	const [loginEmail, setloginEmail] = useState('');
	const [LoginPassword, setLoginPassword] = useState('');
	const [Error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async () => {
		setError(''); // Reset error
		const normalizedEmail = loginEmail.trim().toLowerCase();

		// If not registered, proceed with signup
		const { data, error } = await supabase.auth.signInWithPassword({
			email: normalizedEmail,
			password: LoginPassword,
		});
		if (error) {
			if (error.message.toLowerCase().includes('user not found')) {
				setError('No account found with this email. Please register instead.');
			} else {
				setError(error.message);
			}
			return;
		}
		if (data.user) {
			setError('Login successful! Redirecting to your dashboard...');
			router.push('/dashboard'); // Redirect to dashboard or home page
		}

		setloginEmail('');
		setLoginPassword('');
	};

	return (
		<section className='relative w-full h-screen flex md:items-center items-start md:pt-0 pt-20 justify-center'>
			<div className='w-full flex flex-col items-center justify-center'>
				{/* the logo top */}
				<div className='w-full flex items-center justify-center mb-4'>
					<Image
						src={logo}
						alt='Logo'
						className='md:w-[15%] w-[40%] '
					/>
				</div>
				<p className='w-full text-xl text-center mb-4'>
					Swift as a bullet, Reliable as an instinct
				</p>
				{/* the form box */}
				<div className='md:w-[40%] md:min-h-[60vh] md:mt-0 mt-4  w-full px-6  bg-[var(--whites)] dark:bg-[var(--primary-dark)] p-8 rounded-lg shadow-md z-100 flex pt-10 justify-center'>
					<div>
						{' '}
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
							{Error && (
								<p className='text-sm text-center text-red-400 py-2'>{Error}</p>
							)}
							<Button
								text='Submit'
								type='primary'
								onclickfunction={(e) => {
									e.preventDefault();
									if (LoginPassword.length <= 0 || loginEmail.length <= 0) {
										setError('No field should be empty');
									} else {
										handleSubmit();
									}
								}}
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
					</div>
				</div>
				<Image
					src={bg}
					alt='Login Background'
					className=' absolute top-0 left-0 w-full h-screen object-cover -z-10'
				/>
			</div>
		</section>
	);
};

export default page;
