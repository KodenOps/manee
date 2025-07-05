// IncomeEditor.tsx
'use client';
import React, { useState } from 'react';
import { useBudget } from './BudgetContext';

const IncomeEditor = () => {
	const { income, updateIncome } = useBudget();
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(income.toString());

	const handleSave = async () => {
		await updateIncome(Number(value));
		setEditing(false);
	};

	return (
		<div className='mt-4 p-3 bg-white dark:bg-gray-800 rounded shadow'>
			<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
				Monthly Income
			</h3>
			{editing ? (
				<div className='flex gap-2'>
					<input
						type='number'
						value={value}
						onChange={(e) => setValue(e.target.value)}
						className='p-2 bg-gray-100 dark:bg-gray-700 rounded w-full'
					/>
					<button
						onClick={handleSave}
						className='px-3 py-2 bg-blue-600 text-white rounded'>
						Save
					</button>
				</div>
			) : (
				<div className='flex items-center justify-between'>
					<p className='text-lg font-bold text-gray-800 dark:text-white'>
						₦{income.toLocaleString()}
					</p>
					<button
						onClick={() => setEditing(true)}
						className='text-sm text-blue-600 underline'>
						Edit
					</button>
				</div>
			)}
		</div>
	);
};

export default IncomeEditor;
