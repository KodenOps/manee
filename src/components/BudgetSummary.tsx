'use client';
import {
	FaMoneyBillWave,
	FaHandHoldingUsd,
	FaMoneyCheckAlt,
	FaWallet,
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';
import EditIncomeModal from '@/components/EditIncomeModal'; // ✅ Correct import

const BudgetSummary = () => {
	const {
		userProfile,
		summaryRefreshSignal,
		refetchUser,
		triggerSummaryRefresh,
	} = useUser();

	const [expenses, setExpenses] = useState(0);
	const [loans, setLoans] = useState(0);
	const [loading, setLoading] = useState(true);
	const [editingIncome, setEditingIncome] = useState(false); // ✅ modal toggle

	const income = userProfile?.income || 0;

	useEffect(() => {
		if (!userProfile?.id) return;

		const fetchData = async () => {
			setLoading(true);

			// Spent amounts
			const { data: budgetData } = await supabase
				.from('budget_categories')
				.select('spent_amount')
				.eq('user_id', userProfile.id);

			const totalExpenses =
				budgetData?.reduce(
					(acc, curr) => acc + Number(curr.spent_amount || 0),
					0
				) || 0;
			setExpenses(totalExpenses);

			// Borrowed loans
			const { data: loanData } = await supabase
				.from('loans')
				.select('amount, type')
				.eq('user_id', userProfile.id);

			const borrowed = loanData?.filter((l) => l.type === 'borrowed') || [];
			const totalBorrowed =
				borrowed.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
			setLoans(totalBorrowed);

			setLoading(false);
		};

		fetchData();
	}, [userProfile?.id, summaryRefreshSignal]);

	const balance = income + loans - expenses;

	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-4 w-full'>
				<SummaryCard
					icon={<FaMoneyBillWave size={24} />}
					label='Income'
					amount={income}
					color='text-green-600'
					loading={loading}
					onClick={() => setEditingIncome(true)} // ✅ allow modal
				/>
				<SummaryCard
					icon={<FaMoneyCheckAlt size={24} />}
					label='Expenses'
					amount={expenses}
					color='text-red-600'
					loading={loading}
				/>
				<SummaryCard
					icon={<FaHandHoldingUsd size={24} />}
					label='Loans (Borrowed)'
					amount={loans}
					color='text-yellow-600'
					loading={loading}
				/>
				<SummaryCard
					icon={<FaWallet size={24} />}
					label='Available Balance'
					amount={balance}
					color={balance >= 0 ? 'text-blue-600' : 'text-red-500'}
					loading={loading}
				/>
			</div>

			{/* ✅ Edit income modal */}
			{editingIncome && (
				<EditIncomeModal
					initialIncome={income}
					onClose={() => setEditingIncome(false)}
					onSaved={async () => {
						await refetchUser();
						triggerSummaryRefresh();
						setEditingIncome(false);
					}}
				/>
			)}
		</>
	);
};

const SummaryCard = ({
	icon,
	label,
	amount,
	color,
	loading,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	amount: number;
	color: string;
	loading: boolean;
	onClick?: () => void;
}) => {
	return (
		<div
			onClick={onClick}
			className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm flex items-center gap-4 border border-gray-200 dark:border-gray-700 w-full ${
				onClick ? 'cursor-pointer hover:shadow-md' : ''
			}`}>
			<div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${color}`}>
				{icon}
			</div>
			<div>
				<p className='text-sm text-gray-600 dark:text-gray-300'>{label}</p>
				<h3 className={`text-lg font-semibold ${color}`}>
					{loading ? '...' : `₦${amount.toLocaleString()}`}
				</h3>
			</div>
		</div>
	);
};

export default BudgetSummary;
