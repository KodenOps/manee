'use client';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import supabase from '@/helper/supabaseClient';

const page = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [Error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async () => {
		setError(''); // Reset error
		const normalizedEmail = email.trim().toLowerCase();
		const res = await fetch('/api/auth/check-user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
		});

		const result = await res.json();

		if (result.exists) {
			setError('This email is already registered. Please log in instead.');
			return;
		}

		// If not registered, proceed with signup
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) {
			if (error.message.toLowerCase().includes('user already registered')) {
				setError(
					'An account with this email already exists. Please log in instead.'
				);
			} else {
				setError(error.message);
			}
			return;
		}

		if (data.user) {
			setError('Registration successful! Please check your email to confirm.');
		}

		setEmail('');
		setPassword('');
		setConfirmPassword('');
	};

	return (
		<section className='md:w-[40%] w-full px-6 mx-auto mt-[100px] bg-[var(--whites)] dark:bg-[var(--primary-dark)] p-8 rounded-lg shadow-md'>
			<h2 className='md:text-2xl text-xl text-center pb-2 font-bold dark:text-[var(--secondary-dark)] text-[var(--primary-dark)] capitalize'>
				Register
			</h2>
			<p className='text-center pb-4 text-md'>
				Welcome to Manee! Please fill in the details below to create your
				account.
			</p>
			<form
				action=''
				onSubmit={handleSubmit}>
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
				{Error && (
					<p className='text-sm text-center text-red-400 py-2'>{Error}</p>
				)}
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
							handleSubmit();
							// Here you would typically handle the registration logic
							// alert('Registration successful!');
							// router.push('/login'); // Redirect to login after successful registration
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
