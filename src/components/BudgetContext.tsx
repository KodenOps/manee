'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';

export interface BudgetCategory {
	id: string;
	user_id: string;
	category: string;
	budget_amount: number;
	created_at: string;
	spent_amount: number;
}

interface BudgetContextType {
	budgets: BudgetCategory[];
	refetchBudgets: () => void;
	loading: boolean;
	income: number;
	refetchIncome: () => void;
	updateIncome: (value: number) => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType>({
	budgets: [],
	refetchBudgets: () => {},
	loading: true,
	income: 0,
	refetchIncome: () => {},
	updateIncome: async () => {},
});

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
	const { userProfile } = useUser();
	const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
	const [income, setIncome] = useState(0);
	const [loading, setLoading] = useState(true);

	const fetchBudgets = async () => {
		if (!userProfile?.id) return;
		setLoading(true);
		const { data, error } = await supabase
			.from('budget_categories')
			.select('*')
			.eq('user_id', userProfile.id)
			.order('created_at', { ascending: false });

		if (!error && data) setBudgets(data);
		else console.error('Error fetching budgets:', error);
		setLoading(false);
	};

	const fetchIncome = async () => {
		if (!userProfile?.id) return;
		const { data, error } = await supabase
			.from('profiles')
			.select('income')
			.eq('id', userProfile.id)
			.single();
		if (!error && data?.income !== undefined) setIncome(Number(data.income));
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
			fetchBudgets();
			fetchIncome();
		}
	}, [userProfile?.id]);

	return (
		<BudgetContext.Provider
			value={{
				budgets,
				refetchBudgets: fetchBudgets,
				loading,
				income,
				refetchIncome: fetchIncome,
				updateIncome,
			}}>
			{children}
		</BudgetContext.Provider>
	);
};

export const useBudget = () => useContext(BudgetContext);
