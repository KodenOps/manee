// components/GoalsContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';

export type Goal = {
	id: string;
	user_id: string;
	name: string;
	target_amount: number;
	current_amount: number;
	deadline: string;
	created_at: string;
};

interface GoalsContextType {
	goals: Goal[];
	loading: boolean;
	refetchGoals: () => void;
}

const GoalsContext = createContext<GoalsContextType>({
	goals: [],
	loading: true,
	refetchGoals: () => {},
});

export const useGoals = () => useContext(GoalsContext);

export const GoalsProvider = ({ children }: { children: React.ReactNode }) => {
	const { userProfile } = useUser();
	const [goals, setGoals] = useState<Goal[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchGoals = async () => {
		if (!userProfile) {
			console.warn('No user profile found');
			return;
		}

		console.log('Fetching goals for user_id:', userProfile.id);

		setLoading(true);
		const { data, error } = await supabase
			.from('goals')
			.select('*')
			.eq('user_id', userProfile.id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching goals:', error.message);
		} else {
			console.log('Goals fetched:', data);
			setGoals(data || []);
		}

		setLoading(false);
	};

	useEffect(() => {
		if (userProfile?.id) {
			fetchGoals();
		}
	}, [userProfile?.id]);

	return (
		<GoalsContext.Provider value={{ goals, loading, refetchGoals: fetchGoals }}>
			{children}
		</GoalsContext.Provider>
	);
};
