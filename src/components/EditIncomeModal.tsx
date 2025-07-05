'use client';
import React, { useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';

interface EditIncomeModalProps {
	initialIncome: number;
	onClose: () => void;
	onSaved: () => void;
}

const EditIncomeModal: React.FC<EditIncomeModalProps> = ({
	initialIncome,
	onClose,
	onSaved,
}) => {
	const [income, setIncome] = useState(initialIncome.toString());
	const [saving, setSaving] = useState(false);
	const { userProfile } = useUser();

	const handleSave = async () => {
		if (!userProfile?.id || isNaN(Number(income)) || Number(income) < 0) return;

		setSaving(true);

		const { error } = await supabase
			.from('profiles')
			.update({ income: Number(income) })
			.eq('id', userProfile.id);

		setSaving(false);

		if (!error) {
			onSaved(); // Triggers refetch and closes modal
		} else {
			console.error('Failed to update income:', error.message);
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-sm'>
				<h2 className='text-lg font-bold mb-4'>Edit Income</h2>

				<label className='block mb-4'>
					<span className='text-sm'>Income (₦)</span>
					<input
						type='number'
						value={income}
						onChange={(e) => setIncome(e.target.value)}
						className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700'
					/>
				</label>

				<div className='flex justify-end gap-3'>
					<button
						onClick={onClose}
						className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600'>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className='px-4 py-2 rounded bg-blue-600 text-white'
						disabled={saving}>
						{saving ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditIncomeModal;
