import React, { useState, useEffect } from 'react';
import supabase from '@/helper/supabaseClient';
import { useRouter } from 'next/router';

const page = (WrappedComponent) => {
	const AuthWrapper = () => {
		const [authenticated, setAuthenticated] = useState(false);
		const [loading, setLoading] = useState(true); // Set initial loading state to true
		const router = useRouter();

		useEffect(() => {
			const getSession = async () => {
				try {
					const { data: session, error } = await supabase.auth.getSession();
					if (session) {
						setAuthenticated(true);
						setLoading(false);
					} else {
						setAuthenticated(false);
						setLoading(false);
						router.push('/login'); // Redirect to login page if not authenticated
					}
				} catch (error) {
					console.error('Error fetching session:', error.message);
					setLoading(false);
					router.push('/login'); // Handle any errors by redirecting to login
				}
			};
			getSession();
		}, []);

		if (loading) {
			return <div>Page Loading...</div>;
		} else if (authenticated) {
			return <WrappedComponent />;
		} else {
			return null; // Return null if not authenticated (should redirect already)
		}
	};

	return AuthWrapper;
};

export default page;
