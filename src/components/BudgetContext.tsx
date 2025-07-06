'use client';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';

export interface BudgetCategory {
	id: string;
	user_id: string;
	category: string;
	budget_amount: number;
	spent_amount: number;
	created_at: string;
	bucket_id: string;
}

export interface BudgetBucket {
	id: string;
	user_id: string;
	title: string;
	start_date: string;
	end_date: string;
	total_income: number;
	status: 'open' | 'closed';
	created_at: string;
}

interface BudgetContextType {
	budgets: BudgetCategory[];
	refetchBudgets: () => void;
	loading: boolean;

	income: number;
	refetchIncome: () => void;
	updateIncome: (value: number) => Promise<void>;

	allBuckets: BudgetBucket[];
	selectedBucket: BudgetBucket | null;
	setSelectedBucket: (bucket: BudgetBucket | null) => void;
	refetchBuckets: () => void;
}

const BudgetContext = createContext<BudgetContextType>({
	budgets: [],
	refetchBudgets: () => {},
	loading: true,
	income: 0,
	refetchIncome: () => {},
	updateIncome: async () => {},

	allBuckets: [],
	selectedBucket: null,
	setSelectedBucket: () => {},
	refetchBuckets: () => {},
});

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
	const { userProfile } = useUser();

	const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [income, setIncome] = useState(0);

	const [allBuckets, setAllBuckets] = useState<BudgetBucket[]>([]);
	const [selectedBucket, setSelectedBucket] = useState<BudgetBucket | null>(
		null
	);

	// Fetch all user's buckets
	const fetchBuckets = async () => {
		if (!userProfile?.id) return;
		const { data, error } = await supabase
			.from('budget_buckets')
			.select('*')
			.eq('user_id', userProfile.id)
			.order('start_date', { ascending: false });

		if (!error && data) {
			setAllBuckets(data);
			if (!selectedBucket && data.length > 0) {
				// Auto-select most recent bucket
				setSelectedBucket(data[0]);
			}
		} else {
			console.error('Error fetching buckets:', error);
		}
	};

	// Fetch budgets within selected bucket
	const fetchBudgets = async () => {
		if (!userProfile?.id || !selectedBucket?.id) return;
		setLoading(true);

		const { data, error } = await supabase
			.from('budget_categories')
			.select('*')
			.eq('user_id', userProfile.id)
			.eq('bucket_id', selectedBucket.id)
			.order('created_at', { ascending: false });

		if (!error && data) {
			setBudgets(data);
		} else {
			console.error('Error fetching budgets:', error);
		}
		setLoading(false);
	};

	// Fetch income from profile
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

	const updateIncome = async (value: number) => {
		if (!userProfile?.id) return;

		const { error } = await supabase
			.from('profiles')
			.update({ income: value })
			.eq('id', userProfile.id);

		if (!error) {
			setIncome(value);
		} else {
			console.error('Failed to update income:', error);
		}
	};

	useEffect(() => {
		if (userProfile?.id) {
			fetchBuckets();
			fetchIncome();
		}
	}, [userProfile?.id]);

	useEffect(() => {
		if (selectedBucket?.id) {
			fetchBudgets();
		}
	}, [selectedBucket?.id]);

	return (
		<BudgetContext.Provider
			value={{
				budgets,
				refetchBudgets: fetchBudgets,
				loading,
				income,
				refetchIncome: fetchIncome,
				updateIncome,

				allBuckets,
				selectedBucket,
				setSelectedBucket,
				refetchBuckets: fetchBuckets,
			}}>
			{children}
		</BudgetContext.Provider>
	);
};

export const useBudget = () => useContext(BudgetContext);
