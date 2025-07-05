'use client';
import React, { useState, useEffect } from 'react';
import { expenseCategories } from '@/data/expenseCategories';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';
import { useBudget } from './BudgetContext';

interface SetBudgetModalProps {
	onClose: () => void;
	onBudgetSaved?: () => void;
}

const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
	onClose,
	onBudgetSaved,
}) => {
	const { userProfile } = useUser();
	const { budgets, refetchBudgets } = useBudget();
	const { triggerSummaryRefresh } = useUser();
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedSubcategory, setSelectedSubcategory] = useState('');
	const [amount, setAmount] = useState('');
	const [customCategory, setCustomCategory] = useState('');
	const [customSubcategory, setCustomSubcategory] = useState('');
	const [income, setIncome] = useState<number | null>(null);
	const [errorMsg, setErrorMsg] = useState('');

	const totalBudgeted = budgets.reduce((acc, b) => acc + b.budget_amount, 0);
	const amountValue = Number(amount);
	const remaining = income !== null ? income - totalBudgeted : null;
	const willExceed = remaining !== null && amountValue > remaining;
	const nearLimit =
		remaining !== null && amountValue >= 0.8 * remaining && !willExceed;

	const categoryObj = expenseCategories.find(
		(c) => c.category === selectedCategory
	);
	const subcategories = categoryObj?.subcategories ?? [];

	// Fetch user income
	useEffect(() => {
		const fetchIncome = async () => {
			if (!userProfile?.id) return;
			const { data, error } = await supabase
				.from('profiles')
				.select('income')
				.eq('id', userProfile.id)
				.single();
			if (!error && data?.income !== undefined) {
				setIncome(Number(data.income));
			}
		};
		fetchIncome();
	}, [userProfile?.id]);

	const handleSave = async () => {
		setErrorMsg('');
		if (!userProfile?.id || amount === '') return;

		if (amountValue < 0) {
			setErrorMsg('Amount cannot be negative.');
			return;
		}

		const category =
			selectedCategory === '__custom__'
				? customCategory
				: selectedSubcategory || selectedCategory;
		if (!category) {
			setErrorMsg('Please select or enter a category');
			return;
		}

		if (willExceed) {
			setErrorMsg('This budget exceeds your available income.');
			return;
		}

		const { error } = await supabase.from('budget_categories').insert([
			{
				user_id: userProfile.id,
				category,
				budget_amount: amountValue,
			},
		]);

		if (error) {
			setErrorMsg('Error saving budget. Try again.');
			console.error(error);
			return;
		}

		await refetchBudgets();
		onBudgetSaved?.();
		await refetchBudgets();
		triggerSummaryRefresh();
		onClose();
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-md p-6'>
				<h2 className='text-xl font-semibold mb-4'>Set Budget</h2>

				{/* Category Select */}
				<label className='block mb-3'>
					<span className='text-sm font-medium'>Category</span>
					<select
						value={selectedCategory}
						onChange={(e) => {
							setSelectedCategory(e.target.value);
							setSelectedSubcategory('');
							setCustomCategory('');
						}}
						className='mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded'>
						<option value=''>Select category</option>
						{expenseCategories.map((c) => (
							<option
								key={c.category}
								value={c.category}>
								{c.category}
							</option>
						))}
						<option value='__custom__'>📝 Type my category</option>
					</select>
				</label>

				{/* Custom Category Input */}
				{selectedCategory === '__custom__' && (
					<label className='block mb-3'>
						<input
							type='text'
							value={customCategory}
							onChange={(e) => setCustomCategory(e.target.value)}
							placeholder='e.g. Crypto Investment'
							className='mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded'
						/>
					</label>
				)}

				{/* Subcategory (if not custom) */}
				{subcategories.length > 0 && selectedCategory !== '__custom__' && (
					<label className='block mb-3'>
						<span className='text-sm font-medium'>Subcategory</span>
						<select
							value={selectedSubcategory}
							onChange={(e) => setSelectedSubcategory(e.target.value)}
							className='mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded'>
							<option value=''>{`Use entire "${selectedCategory}"`}</option>
							{subcategories.map((sub) => (
								<option
									key={sub}
									value={sub}>
									{sub}
								</option>
							))}
						</select>
					</label>
				)}

				{/* Budget Amount Input */}
				<label className='block mb-3'>
					<span className='text-sm font-medium'>Budget Amount (₦)</span>
					<input
						type='number'
						min='0'
						value={amount}
						onChange={(e) => {
							const val = e.target.value;
							if (val === '' || Number(val) >= 0) {
								setAmount(val);
							}
						}}
						className='mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded'
						placeholder='e.g. 20000'
					/>
				</label>

				{/* Remaining Display */}
				{income !== null && (
					<div
						className={`text-sm font-medium mb-2 ${
							willExceed
								? 'text-red-600'
								: nearLimit
								? 'text-yellow-600'
								: 'text-green-600'
						}`}>
						{willExceed
							? `❌ Budget exceeds available income.`
							: `You have ₦${(
									income - totalBudgeted
							  ).toLocaleString()} remaining`}
					</div>
				)}

				{/* Error */}
				{errorMsg && <p className='text-red-500 text-sm mb-2'>{errorMsg}</p>}

				{/* Buttons */}
				<div className='flex justify-end gap-3 mt-4'>
					<button
						onClick={onClose}
						className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600'>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className='px-4 py-2 rounded bg-blue-600 text-white'>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default SetBudgetModal;
