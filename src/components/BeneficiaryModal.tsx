// BeneficiaryModal.tsx
'use client';
import React, { useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { NigeriaBanks } from '@/data/BankDb'; // Adjust the import path as necessary
import Button from './Button';
const BeneficiaryModal = ({ isOpen, onClose, profileId, onSuccess }: any) => {
	useEffect(() => {
		if (isOpen && NigeriaBanks.length > 0) {
			setFormData((prev) => ({
				...prev,
				bank_name: NigeriaBanks[0].fullName,
				bank_short_name: NigeriaBanks[0].shortName,
			}));
		}
	}, [isOpen]);
	const [bankShortCode, setBankShortCode] = useState('');
	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		account_number: '',
		bank_name: '',
		bank_short_name: '',
	});

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		// Step 1: Check if account number already exists
		const { data: existing, error: fetchError } = await supabase
			.from('beneficiaries')
			.select('*')
			.eq('account_number', formData.account_number)
			.eq('profile_id', profileId); // restrict to this user's beneficiaries

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

		// Step 2: Proceed to insert if not existing
		const now = new Date().toISOString();

		const { error: insertError } = await supabase.from('beneficiaries').insert([
			{
				...formData,
				profile_id: profileId,
				created_at: now,
				updated_at: now,
			},
		]);

		if (insertError) {
			setError(insertError.message);
		} else {
			// ✅ Clear form
			setFormData({
				first_name: '',
				last_name: '',
				account_number: '',
				bank_name: '',
				bank_short_name: '',
			});

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
						name='first_name'
						placeholder='First Name'
						value={formData.first_name}
						onChange={handleChange}
						className='input-style'
						required
					/>
					<input
						type='text'
						name='last_name'
						placeholder='Last Name'
						value={formData.last_name}
						onChange={handleChange}
						className='input-style'
						required
					/>
					<input
						type='text'
						name='account_number'
						placeholder='Account Number'
						maxLength={10}
						minLength={10}
						value={formData.account_number}
						onChange={handleChange}
						className='input-style'
						required
					/>
					<select
						required
						name='bank_name'
						className='input-style '
						value={formData.bank_name}
						onChange={(e) => {
							const selectedBank = NigeriaBanks.find(
								(bank) => bank.fullName === e.target.value
							);

							if (selectedBank) {
								setFormData((prev) => ({
									...prev,
									bank_name: selectedBank.fullName,
									bank_short_name: selectedBank.shortName,
								}));
							}
						}}
						id=''>
						{NigeriaBanks.map((bank) => (
							<option
								key={bank.id}
								value={bank.fullName}
								className='bg-transparent text-black py-2 px-10 '
								onClick={(e) => {
									setBankShortCode(bank.shortName);
								}}>
								{bank.fullName}
							</option>
						))}
					</select>
					<input
						type='text'
						disabled
						name='bank_short_name'
						placeholder='Short Name'
						value={formData.bank_short_name}
						// onChange={handleChange}
						className='input-style'
						required
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
					<div className='flex justify-center gap-4 w-full items-center'>
						<button
							type='button'
							onClick={onClose}
							className='bg-red-400 text-[var(--whites] px-4 py-2 rounded w-full'>
							Close Modal
						</button>
						{/* <Button
							text={loading ? 'Adding...' : 'Add Beneficiary'}
							type='submit'
							onclickfunction={(e) => {
								e.preventDefault();
							}}
						/> */}
						<button
							type='submit'
							// onClick={handleClose}
							disabled={loading}
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
