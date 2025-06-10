'use client';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import supabase from '@/helper/supabaseClient';
supabase.auth.signOut();
const page = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setfirstName] = useState('');
	const [lastName, setlastName] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [Error, setError] = useState('');
	const router = useRouter();

	const generateAccountNumber = () => {
		return Math.floor(1000000000 + Math.random() * 9000000000).toString();
	};

	const handleSubmit = async () => {
		setError('');
		const normalizedEmail = email.trim().toLowerCase();

		// Check if the user already exists
		const res = await fetch('/api/auth/check-user', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: normalizedEmail }),
		});

		const result = await res.json();
		if (result.exists) {
			setError('This email is already registered. Please log in instead.');
			return;
		}

		// Sign up user
		const { data, error } = await supabase.auth.signUp({
			email: normalizedEmail,
			password: password,
		});

		if (error) {
			setError(error.message);
			return;
		}

		const user = data.user;
		if (!user) return;

		// Insert into profiles table with retry logic
		let accountNumber;
		let insertSuccess = false;

		while (!insertSuccess) {
			accountNumber = generateAccountNumber();

			const { error: insertError } = await supabase.from('profiles').insert({
				id: user.id,
				email: normalizedEmail,
				first_name: firstName,
				last_name: lastName,
				account_number: accountNumber.toString(),
				balance: 50000,
			});

			if (!insertError) {
				insertSuccess = true; // Exit the loop if successful
			} else if (!insertError.message.includes('duplicate key value')) {
				// If it's a different error, stop and log it
				console.error('Error inserting profile:', insertError);
				setError('Error creating user profile.');
				return;
			}
		}

		// Success
		setError('Registration successful! Please check your email to confirm.');
		setEmail('');
		setPassword('');
		setConfirmPassword('');
		setfirstName('');
		setlastName('');
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
					type='text'
					placeholder='Enter First Name'
					value={firstName}
					onChange={(e) => setfirstName(e.target.value)}
				/>
				<InputField
					type='text'
					placeholder='Enter Last Name'
					value={lastName}
					onChange={(e) => setlastName(e.target.value)}
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
