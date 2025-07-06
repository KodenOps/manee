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
	const [amount, setAmount] = useState('');
	const [spentAt, setSpentAt] = useState(new Date().toISOString().slice(0, 10));
	const [description, setDescription] = useState('');
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState('');

	const { refetchBudgets } = useBudget();
	const { triggerSummaryRefresh, userProfile } = useUser();

	const handleSave = async () => {
		const newAmount = Number(amount);
		if (!newAmount || newAmount <= 0) {
			setError('Please enter a valid amount greater than 0');
			return;
		}

		setSaving(true);

		// Step 1: Log this spend in the expenses table
		const { error: logError } = await supabase.from('expenses').insert([
			{
				user_id: userProfile?.id,
				category: budget.category,
				amount: newAmount,
				spent_at: spentAt,
				description,
				bucket_id: budget.bucket_id,
			},
		]);

		if (logError) {
			console.error('Error logging expense:', logError.message);
			setError('Failed to log expense.');
			setSaving(false);
			return;
		}

		// Step 2: Increment spent_amount in the budget
		const updatedSpent = (budget.spent_amount || 0) + newAmount;
		const { error: updateError } = await supabase
			.from('budget_categories')
			.update({ spent_amount: updatedSpent })
			.eq('id', budget.id);

		if (updateError) {
			console.error('Error updating budget:', updateError.message);
			setError('Failed to update budget.');
			setSaving(false);
			return;
		}

		await refetchBudgets();
		triggerSummaryRefresh();
		setSaving(false);
		onUpdated();
	};

	const handleDelete = async () => {
		setDeleting(true);

		// Step 1: Delete all related expenses for this budget
		const { error: expenseDeleteError } = await supabase
			.from('expenses')
			.delete()
			.eq('bucket_id', budget.bucket_id)
			.eq('category', budget.category); // Assuming same category was saved

		if (expenseDeleteError) {
			console.error(
				'Error deleting related expenses:',
				expenseDeleteError.message
			);
			setError('Failed to delete related expenses.');
			setDeleting(false);
			return;
		}

		// Step 2: Delete the budget itself
		const { error: budgetDeleteError } = await supabase
			.from('budget_categories')
			.delete()
			.eq('id', budget.id);

		await refetchBudgets();
		triggerSummaryRefresh();
		setDeleting(false);

		if (!budgetDeleteError) {
			onUpdated();
		} else {
			console.error('Delete error:', budgetDeleteError.message);
			setError('Failed to delete budget.');
		}
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md'>
				<h2 className='text-lg font-bold mb-4'>
					Add Spending to {budget.category}
				</h2>

				{error && (
					<p className='text-sm text-red-500 bg-red-50 p-2 rounded mb-2'>
						{error}
					</p>
				)}

				<label className='block mb-4'>
					<span className='text-sm'>Amount Spent Today (₦)</span>
					<input
						type='number'
						min='0'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700'
					/>
				</label>

				<label className='block mb-4'>
					<span className='text-sm'>Date Spent</span>
					<input
						type='date'
						value={spentAt}
						disabled
						className='mt-1 w-full p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-500'
					/>
				</label>

				<label className='block mb-4'>
					<span className='text-sm'>Description (optional)</span>
					<input
						type='text'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='e.g. groceries, fuel, etc.'
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
