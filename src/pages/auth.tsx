import { useUser } from '@stackframe/stack';
import React, { useState } from 'react';

const AuthPage = () => {
	const user = useUser({ or: 'redirect' });

	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
		const myuser = await user.update({
			clientMetadata: {
				mailingAddress: '123 Main St',
			},
		});
		console.log(myuser);
		const data = await response.json();
		if (response.ok) {
			alert(isLogin ? `Login successful: ${data.token}` : 'Signup successful');
		} else {
			alert(data.message);
		}
	};

	return (
		<div className='auth-container'>
			<h1>{isLogin ? 'Login' : 'Signup'}</h1>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type='submit'>{isLogin ? 'Login' : 'Signup'}</button>
			</form>
			<button onClick={() => setIsLogin(!isLogin)}>
				Switch to {isLogin ? 'Signup' : 'Login'}
			</button>
		</div>
	);
};

export default AuthPage;
