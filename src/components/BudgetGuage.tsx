'use client';
import React, { useEffect, useState } from 'react';
import EditBudgetModal from '@/components/EditBudgetModal';
import SetBudgetModal from '@/components/SetBudgetModal';
import supabase from '@/helper/supabaseClient';
import { type BudgetCategory } from './BudgetContext';

interface BudgetGaugeProps {
	bucketId: string;
}

const BudgetGauge: React.FC<BudgetGaugeProps> = ({ bucketId }) => {
	const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedBudget, setSelectedBudget] = useState<BudgetCategory | null>(
		null
	);
	const [showSetModal, setShowSetModal] = useState(false);

	const fetchBudgets = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from('budget_categories')
			.select('*')
			.eq('bucket_id', bucketId);

		if (error) {
			console.error('Failed to load budgets:', error.message);
			setBudgets([]);
		} else {
			setBudgets(data || []);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (bucketId) fetchBudgets();
	}, [bucketId]);

	if (loading) {
		return (
			<p className='text-center text-gray-500 dark:text-gray-400'>
				Loading budgets...
			</p>
		);
	}

	if (!budgets.length) {
		return (
			<div className='w-full text-center mt-24'>
				<p className='text-gray-500 dark:text-gray-300 mb-4'>
					No budgets created yet for this bucket.
				</p>
				<button
					onClick={() => setShowSetModal(true)}
					className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
					Create First Budget
				</button>

				{showSetModal && (
					<SetBudgetModal
						bucketId={bucketId}
						onClose={() => setShowSetModal(false)}
						onBudgetSaved={() => {
							setShowSetModal(false);
							fetchBudgets();
						}}
					/>
				)}
			</div>
		);
	}

	return (
		<>
			<div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full'>
				{budgets.map((b) => {
					const progress = b.spent_amount
						? Math.min((b.spent_amount / b.budget_amount) * 100, 100)
						: 0;

					return (
						<div
							key={b.id}
							className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all'
							onClick={() => setSelectedBudget(b)}>
							<p className='text-sm font-medium text-gray-700 dark:text-gray-200 mb-2'>
								{b.category}
							</p>
							<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4'>
								<div
									className={`h-4 rounded-full transition-all ${
										b.spent_amount > b.budget_amount
											? 'bg-red-600'
											: 'bg-blue-600'
									}`}
									style={{ width: `${progress}%` }}
								/>
							</div>
							<p className='text-xs text-gray-600 dark:text-gray-400 mt-2'>
								₦{(b.spent_amount || 0).toLocaleString()} of ₦
								{b.budget_amount.toLocaleString()}
							</p>
						</div>
					);
				})}
			</div>

			{selectedBudget && (
				<EditBudgetModal
					budget={selectedBudget}
					onClose={() => setSelectedBudget(null)}
					onUpdated={() => {
						setSelectedBudget(null);
						fetchBudgets();
					}}
				/>
			)}
		</>
	);
};

export default BudgetGauge;
