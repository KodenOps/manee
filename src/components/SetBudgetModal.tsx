'use client';
import React, { useState, useEffect } from 'react';
import { expenseCategories } from '@/data/expenseCategories';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';
import { useBudget } from './BudgetContext';

interface SetBudgetModalProps {
	onClose: () => void;
	onBudgetSaved?: () => void;
	bucketId?: string;
}

const SetBudgetModal: React.FC<SetBudgetModalProps> = ({
	onClose,
	onBudgetSaved,
	bucketId,
}) => {
	const { userProfile, triggerSummaryRefresh } = useUser();
	const { budgets, refetchBudgets } = useBudget();

	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedSubcategory, setSelectedSubcategory] = useState('');
	const [amount, setAmount] = useState('');
	const [customCategory, setCustomCategory] = useState('');
	const [customSubcategory, setCustomSubcategory] = useState('');
	const [income, setIncome] = useState<number | null>(null);
	const [totalBudgeted, setTotalBudgeted] = useState<number>(0);
	const [totalSpent, setTotalSpent] = useState<number>(0);
	const [errorMsg, setErrorMsg] = useState('');

	const [buckets, setBuckets] = useState<any[]>([]);
	const [selectedBucket, setSelectedBucket] = useState<string | null>(
		bucketId || null
	);

	const amountValue = Number(amount);
	const remaining =
		income !== null ? income - (totalBudgeted + totalSpent) : null;
	const willExceed = remaining !== null && amountValue > remaining;
	const nearLimit =
		remaining !== null && amountValue >= 0.8 * remaining && !willExceed;

	const categoryObj = expenseCategories.find(
		(c) => c.category === selectedCategory
	);
	const subcategories = categoryObj?.subcategories ?? [];

	useEffect(() => {
		const fetchData = async () => {
			if (!userProfile?.id) return;

			// ✅ FIX: Fetch total_income from the bucket
			if (selectedBucket) {
				const { data: bucketData } = await supabase
					.from('budget_buckets')
					.select('total_income')
					.eq('id', selectedBucket)
					.single();

				if (bucketData?.total_income !== undefined) {
					setIncome(Number(bucketData.total_income));
				}

				// Fetch total budgeted
				const { data: budgetData } = await supabase
					.from('budget_categories')
					.select('budget_amount')
					.eq('user_id', userProfile.id)
					.eq('bucket_id', selectedBucket);

				if (budgetData) {
					const total = budgetData.reduce(
						(acc, b) => acc + (b.budget_amount || 0),
						0
					);
					setTotalBudgeted(total);
				}

				// Fetch total spent
				const { data: expenseData } = await supabase
					.from('expenses')
					.select('amount')
					.eq('user_id', userProfile.id)
					.eq('bucket_id', selectedBucket);

				if (expenseData) {
					const totalSpent = expenseData.reduce(
						(acc, e) => acc + (e.amount || 0),
						0
					);
					setTotalSpent(totalSpent);
				}
			}

			// Fetch buckets if bucketId wasn't passed
			if (!bucketId) {
				const { data: bucketData } = await supabase
					.from('budget_buckets')
					.select('*')
					.eq('user_id', userProfile.id)
					.eq('status', 'open')
					.order('start_date', { ascending: false });

				if (bucketData) {
					setBuckets(bucketData);
					if (bucketData.length > 0) {
						setSelectedBucket(bucketData[0].id);
					}
				}
			}
		};

		fetchData();
	}, [userProfile?.id, selectedBucket]);

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

		if (!selectedBucket) {
			setErrorMsg('Please select or create a budget bucket.');
			return;
		}

		const { error } = await supabase.from('budget_categories').insert([
			{
				user_id: userProfile.id,
				category,
				budget_amount: amountValue,
				bucket_id: selectedBucket,
			},
		]);

		if (error) {
			console.error(error);
			setErrorMsg('Error saving budget. Try again.');
			return;
		}

		await refetchBudgets();
		onBudgetSaved?.();
		triggerSummaryRefresh();
		onClose();
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-md p-6'>
				<h2 className='text-xl font-semibold mb-4'>Set Budget</h2>

				{/* Bucket Selector */}
				{!bucketId && buckets.length > 0 && (
					<label className='block mb-3'>
						<span className='text-sm font-medium'>Budget Period</span>
						<select
							value={selectedBucket || ''}
							onChange={(e) => setSelectedBucket(e.target.value)}
							className='mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded'>
							{buckets.map((b) => (
								<option
									key={b.id}
									value={b.id}>
									{b.title}
								</option>
							))}
						</select>
					</label>
				)}

				{/* Category */}
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

				{/* Subcategory */}
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

				{/* Amount */}
				<label className='block mb-3'>
					<span className='text-sm font-medium'>Budget Amount (₦)</span>
					<input
						type='number'
						min='0'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						className='mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 rounded'
						placeholder='e.g. 20000'
					/>
				</label>

				{/* Remaining income hint */}
				{income !== null && selectedBucket && (
					<div
						className={`text-sm font-medium mb-2 ${
							willExceed
								? 'text-red-600'
								: nearLimit
								? 'text-yellow-600'
								: 'text-green-600'
						}`}>
						{willExceed
							? `❌ This budget exceeds your remaining available balance.`
							: `You have ₦${remaining?.toLocaleString()} remaining for this bucket`}
					</div>
				)}

				{/* Error */}
				{errorMsg && <p className='text-red-500 text-sm mb-2'>{errorMsg}</p>}

				{/* Actions */}
				<div className='flex justify-end gap-3 mt-4'>
					<button
						onClick={onClose}
						className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600'>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className='px-4 py-2 rounded bg-blue-600 text-white'
						disabled={!selectedBucket}>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default SetBudgetModal;
