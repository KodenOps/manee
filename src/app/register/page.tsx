'use client';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const page = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [Error, setError] = useState('');
	const router = useRouter();
	return (
		<section className='md:w-[40%] w-full px-6 mx-auto mt-[100px] bg-[var(--whites)] dark:bg-[var(--primary-dark)] p-8 rounded-lg shadow-md'>
			<h2 className='md:text-2xl text-xl text-center pb-2 font-bold dark:text-[var(--secondary-dark)] text-[var(--primary-dark)] capitalize'>
				Register
			</h2>
			<p className='text-center pb-4 text-md'>
				Welcome to Manee! Please fill in the details below to create your
				account.
			</p>
			<form action=''>
				<InputField
					type='email' // Use "text" to allow formatting
					placeholder='Enter Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<InputField
					type='password'
					placeholder='Enter Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<InputField
					type='password'
					placeholder='Confirm Password'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
				<p className='text-sm text-center text-red-400 py-2'>{Error}</p>
				<Button
					text='Submit'
					type='primary'
					onclickfunction={(e) => {
						e.preventDefault();
						if (
							password.length <= 0 ||
							confirmPassword.length <= 0 ||
							email.length <= 0
						) {
							setError('No field should be empty');
						} else if (password !== confirmPassword) {
							setError('Passwords do not match');
						} else {
							setError('');
							// Here you would typically handle the registration logic
							alert('Registration successful!');
							router.push('/login'); // Redirect to login after successful registration
						}
					}}
				/>
				<Button
					text='Have an account? Login Instead'
					type='secondary'
					onclickfunction={(e) => {
						e.preventDefault();

						router.push('/login');
					}}
				/>
			</form>
		</section>
	);
};

export default page;
