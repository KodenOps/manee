// BeneficiaryModal.tsx
'use client';
import React, { useState } from 'react';
import supabase from '@/helper/supabaseClient';

const BeneficiaryModal = ({ isOpen, onClose, profileId, onSuccess }: any) => {
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

		const now = new Date().toISOString();

		const { error } = await supabase.from('beneficiaries').insert([
			{
				...formData,
				profile_id: profileId,
				created_at: now,
				updated_at: now,
			},
		]);

		if (error) {
			setError(error.message);
		} else {
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
						className='w-full p-2 border rounded'
						required
					/>
					<input
						type='text'
						name='last_name'
						placeholder='Last Name'
						value={formData.last_name}
						onChange={handleChange}
						className='w-full p-2 border rounded'
						required
					/>
					<input
						type='text'
						name='account_number'
						placeholder='Account Number'
						value={formData.account_number}
						onChange={handleChange}
						className='w-full p-2 border rounded'
						required
					/>
					<input
						type='text'
						name='bank_name'
						placeholder='Bank Name'
						value={formData.bank_name}
						onChange={handleChange}
						className='w-full p-2 border rounded'
						required
					/>
					<input
						type='text'
						name='bank_short_name'
						placeholder='Bank Short Name'
						value={formData.bank_short_name}
						onChange={handleChange}
						className='w-full p-2 border rounded'
						required
					/>
					{error && <p className='text-red-500 text-sm'>{error}</p>}
					<div className='flex justify-end gap-4'>
						<button
							type='button'
							onClick={onClose}
							className='bg-gray-300 px-4 py-2 rounded'>
							Cancel
						</button>
						<button
							type='submit'
							disabled={loading}
							className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
							{loading ? 'Adding...' : 'Add Beneficiary'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default BeneficiaryModal;
