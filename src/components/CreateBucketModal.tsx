'use client';
import React, { useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';

interface CreateBucketModalProps {
	onClose: () => void;
	onCreated?: () => void;
}

const CreateBucketModal: React.FC<CreateBucketModalProps> = ({
	onClose,
	onCreated,
}) => {
	const { userProfile } = useUser();
	const [title, setTitle] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [income, setIncome] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleCreate = async () => {
		setError('');

		if (!title || !startDate || !endDate || !income) {
			setError('All fields are required.');
			return;
		}

		if (new Date(startDate) > new Date(endDate)) {
			setError('Start date cannot be after end date.');
			return;
		}

		const total_income = parseFloat(income);
		if (isNaN(total_income) || total_income < 0) {
			setError('Income must be a positive number.');
			return;
		}

		setLoading(true);

		const { error: insertError } = await supabase
			.from('budget_buckets')
			.insert([
				{
					user_id: userProfile?.id,
					title,
					start_date: startDate,
					end_date: endDate,
					total_income,
				},
			]);

		setLoading(false);

		if (insertError) {
			console.error('Failed to create budget bucket:', insertError.message);
			if (insertError.message.includes('row-level security')) {
				setError('You must be signed in to create a budget bucket.');
			} else {
				setError('Failed to create bucket. Please try again.');
			}
			return;
		}

		onCreated?.();
		onClose();
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md'>
				<h2 className='text-xl font-semibold mb-4'>Create Budget Bucket</h2>

				<label className='block mb-3'>
					<span className='text-sm font-medium'>Title</span>
					<input
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700'
						placeholder='e.g. July Budget'
					/>
				</label>

				<div className='flex gap-4'>
					<label className='block mb-3 w-1/2'>
						<span className='text-sm font-medium'>Start Date</span>
						<input
							type='date'
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700'
						/>
					</label>

					<label className='block mb-3 w-1/2'>
						<span className='text-sm font-medium'>End Date</span>
						<input
							type='date'
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700'
						/>
					</label>
				</div>

				<label className='block mb-3'>
					<span className='text-sm font-medium'>Total Income (₦)</span>
					<input
						type='number'
						min='0'
						value={income}
						onChange={(e) => setIncome(e.target.value)}
						className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700'
						placeholder='e.g. 500000'
					/>
				</label>

				{/* Error Message */}
				{error && <p className='text-sm text-red-500 mb-3'>{error}</p>}

				<div className='flex justify-end gap-3 mt-4'>
					<button
						onClick={onClose}
						className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600'>
						Cancel
					</button>
					<button
						onClick={handleCreate}
						disabled={loading}
						className='px-4 py-2 rounded bg-blue-600 text-white'>
						{loading ? 'Creating...' : 'Create Bucket'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateBucketModal;
