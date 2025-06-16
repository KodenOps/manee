'use client';
import React, { useState, useEffect } from 'react';
import supabase from '@/helper/supabaseClient';
import Button from './Button';

const BeneficiaryModal = ({ isOpen, onClose, profileId, onSuccess }: any) => {
	const [accountNumber, setAccountNumber] = useState('');
	const [accountName, setAccountName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const resolveAccount = async () => {
			if (accountNumber.length === 10) {
				const { data, error } = await supabase
					.from('profiles')
					.select('first_name, last_name')
					.eq('account_number', accountNumber)
					.single();

				if (error || !data) {
					setAccountName('');
					setError('Account not found.');
				} else {
					setAccountName(`${data.first_name} ${data.last_name}`);
					setError('');
				}
			} else {
				setAccountName('');
				setError('');
			}
		};
		resolveAccount();
	}, [accountNumber]);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		if (!accountNumber || accountName === '') {
			setError('Please enter a valid account number.');
			setLoading(false);
			return;
		}

		const { data: existing, error: fetchError } = await supabase
			.from('beneficiaries')
			.select('*')
			.eq('account_number', accountNumber)
			.eq('profile_id', profileId);

		if (fetchError) {
			setError('Something went wrong while checking existing data.');
			setLoading(false);
			return;
		}

		if (existing && existing.length > 0) {
			setError('Beneficiary with this account number already exists.');
			setLoading(false);
			return;
		}

		const [firstName, lastName] = accountName.split(' ');
		const now = new Date().toISOString();

		const { error: insertError } = await supabase.from('beneficiaries').insert([
			{
				first_name: firstName,
				last_name: lastName,
				account_number: accountNumber,
				profile_id: profileId,
				created_at: now,
				updated_at: now,
			},
		]);

		if (insertError) {
			setError(insertError.message);
		} else {
			setAccountNumber('');
			setAccountName('');
			onSuccess();
			onClose();
		}

		setLoading(false);
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
			<div className='bg-white dark:bg-[var(--card-bg-dark)] rounded-lg w-full max-w-md p-6 shadow-lg'>
				<h2 className='text-lg font-semibold mb-4 dark:text-white'>
					Add Beneficiary
				</h2>
				<form
					onSubmit={handleSubmit}
					className='space-y-4'>
					<input
						type='text'
						placeholder='Account Number'
						value={accountNumber}
						onChange={(e) =>
							setAccountNumber(e.target.value.replace(/\D/g, ''))
						}
						maxLength={10}
						minLength={10}
						className='input-style'
						required
					/>
					<input
						type='text'
						placeholder='Account Name'
						value={accountName}
						disabled
						className='input-style bg-gray-100 dark:bg-gray-800'
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
					<div className='flex justify-center gap-4 w-full items-center'>
						<button
							type='button'
							onClick={onClose}
							className='bg-red-400 text-[var(--whites)] px-4 py-2 rounded w-full'>
							Close Modal
						</button>
						<button
							type='submit'
							disabled={loading || !accountName}
							className='bg-[var(--primary)] dark:bg-[var(--secondary-dark)] dark:text-[var(--primary-dark)] text-[var(--whites)] w-full px-4 py-2 rounded'>
							{loading ? 'Adding...' : 'Add Beneficiary'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BeneficiaryModal;
