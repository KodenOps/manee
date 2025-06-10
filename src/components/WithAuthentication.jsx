'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import supabase from '@/helper/supabaseClient';

const WithAuthentication = (WrappedComponent) => {
	const AuthWrapper = (props) => {
		const [authenticated, setAuthenticated] = useState(false);
		const [loading, setLoading] = useState(true);
		const router = useRouter();

		useEffect(() => {
			const getSession = async () => {
				try {
					const { data, error } = await supabase.auth.getSession();
					if (data?.session) {
						setAuthenticated(true);
					} else {
						router.push('/login'); 
					}
				} catch (err) {
					console.error('Error fetching session:', err);
					router.push('/login');
				} finally {
					setLoading(false);
				}
			};

			getSession();
		}, []);

		if (loading) {
			return <div>Page Loading...</div>;
		}

		if (!authenticated) {
			return null; // Already redirecting
		}

		return <WrappedComponent {...props} />;
	};

	return AuthWrapper;
};

export default WithAuthentication;
