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
import EditIncomeModal from '@/components/EditIncomeModal';

interface BudgetSummaryProps {
	bucketId?: string; // Optional — will fall back to userProfile.income if not present
}

const BudgetSummary = ({ bucketId }: BudgetSummaryProps) => {
	const {
		userProfile,
		summaryRefreshSignal,
		refetchUser,
		triggerSummaryRefresh,
	} = useUser();

	const [expenses, setExpenses] = useState(0);
	const [loans, setLoans] = useState(0);
	const [bucketIncome, setBucketIncome] = useState<number | null>(null);
	const [loading, setLoading] = useState(true);
	const [editingIncome, setEditingIncome] = useState(false);

	const income = bucketId ? bucketIncome ?? 0 : userProfile?.income || 0;
	const userId = userProfile?.id;

	useEffect(() => {
		if (!userId) return;

		const fetchData = async () => {
			setLoading(true);

			if (bucketId) {
				// Fetch income from budget_buckets table
				const { data: bucketData, error: bucketErr } = await supabase
					.from('budget_buckets')
					.select('total_income')
					.eq('id', bucketId)
					.single();
				if (bucketData?.total_income !== undefined) {
					setBucketIncome(bucketData.total_income);
				}
			}

			// Fetch expenses by bucket or user
			const { data: budgetData } = await supabase
				.from('budget_categories')
				.select('spent_amount')
				.eq(bucketId ? 'bucket_id' : 'user_id', bucketId || userId);

			const totalExpenses =
				budgetData?.reduce(
					(acc, curr) => acc + Number(curr.spent_amount || 0),
					0
				) || 0;
			setExpenses(totalExpenses);

			// Loans (always user-level)
			const { data: loanData } = await supabase
				.from('loans')
				.select('amount, type')
				.eq('user_id', userId);

			const borrowed = loanData?.filter((l) => l.type === 'borrowed') || [];
			const totalBorrowed =
				borrowed.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;
			setLoans(totalBorrowed);

			setLoading(false);
		};

		fetchData();
	}, [userId, summaryRefreshSignal, bucketId]);

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
					onClick={() => setEditingIncome(true)}
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

			{editingIncome && (
				<EditIncomeModal
					initialIncome={income}
					bucketId={bucketId}
					onClose={() => setEditingIncome(false)}
					onSaved={async () => {
						if (!bucketId) await refetchUser();
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
}) => (
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

export default BudgetSummary;
