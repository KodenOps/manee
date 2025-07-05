'use client';
import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import supabase from '@/helper/supabaseClient';

export type UserProfile = {
	id: string;
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
};

interface UserContextType {
	userProfile: UserProfile | null;
	loading: boolean;
	refetchUser: () => void;
}

const UserContext = createContext<UserContextType>({
	userProfile: null,
	loading: true,
	refetchUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchProfile = async () => {
		setLoading(true);
		try {
			const userResponse = await supabase.auth.getUser();
			const user = userResponse.data.user;

			if (user) {
				const { data: profile, error } = await supabase
					.from('profiles')
					.select('first_name, last_name, account_number, balance')
					.eq('id', user.id)
					.single();

				if (!error && profile) {
					setUserProfile({
						...profile,
						email: user.email || '',
						id: user.id,
					});
				}
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	return (
		<UserContext.Provider
			value={{ userProfile, loading, refetchUser: fetchProfile }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
