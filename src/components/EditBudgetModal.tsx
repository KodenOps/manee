'use client';
import React, { useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { BudgetCategory, useBudget } from './BudgetContext';
import { useUser } from './UserContext';

const EditBudgetModal = ({
	budget,
	onClose,
	onUpdated,
}: {
	budget: BudgetCategory;
	onClose: () => void;
	onUpdated: () => void;
}) => {
	const [spent, setSpent] = useState(budget.spent_amount.toString());
	const [deleting, setDeleting] = useState(false);
	const [saving, setSaving] = useState(false);

	const { refetchBudgets } = useBudget();
	const { triggerSummaryRefresh } = useUser();

	const handleSave = async () => {
		setSaving(true);

		const { error } = await supabase
			.from('budget_categories')
			.update({ spent_amount: Number(spent) })
			.eq('id', budget.id);

		await refetchBudgets();
		triggerSummaryRefresh(); // ✅ Refresh summary after save

		setSaving(false);

		if (!error) onUpdated();
		else console.error('Save error:', error.message);
	};

	const handleDelete = async () => {
		setDeleting(true);

		const { error } = await supabase
			.from('budget_categories')
			.delete()
			.eq('id', budget.id);

		await refetchBudgets();
		triggerSummaryRefresh(); // ✅ Refresh summary after delete

		setDeleting(false);

		if (!error) onUpdated();
		else console.error('Delete error:', error.message);
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md'>
				<h2 className='text-lg font-bold mb-4'>
					Update Budget for {budget.category}
				</h2>

				<label className='block mb-4'>
					<span className='text-sm'>Amount Spent (₦)</span>
					<input
						type='number'
						min='0'
						value={spent}
						onChange={(e) => setSpent(e.target.value)}
						className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700'
					/>
				</label>

				<div className='flex justify-between items-center mt-6'>
					<button
						onClick={onClose}
						className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600'>
						Cancel
					</button>

					<div className='flex gap-2'>
						<button
							onClick={handleDelete}
							className='px-4 py-2 bg-red-600 text-white rounded'
							disabled={deleting}>
							{deleting ? 'Deleting...' : 'Delete'}
						</button>
						<button
							onClick={handleSave}
							className='px-4 py-2 bg-blue-600 text-white rounded'
							disabled={saving}>
							{saving ? 'Saving...' : 'Save'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditBudgetModal;
