import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { query } from '@/utils/db';s

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { username, password } = req.body;

		if (!username || !password) {
			return res
				.status(400)
				.json({ message: 'Username and password are required' });
		}

		try {
			// Step 1: Look up user by username (from users_sync raw_json)
			const result = await query(
				`SELECT us.raw_json, au.password_hash 
         FROM neon_auth.users_sync us 
         JOIN auth_users au ON (us.id = au.id) 
         WHERE us.raw_json ->> 'display_name' = $1`,
				[username]
			);

			const row = result.rows[0];
			if (!row) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			const { raw_json, password_hash } = row;

			const isPasswordValid = await bcrypt.compare(password, password_hash);
			if (!isPasswordValid) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			// Step 2: Generate token with user ID and username
			const token = jwt.sign(
				{
					id: raw_json.id,
					username: raw_json.display_name,
					email: raw_json.primary_email,
				},
				process.env.JWT_SECRET,
				{ expiresIn: '1h' }
			);

			// Step 3: Return token and basic user info
			res.status(200).json({
				token,
				user: {
					id: raw_json.id,
					username: raw_json.display_name,
					email: raw_json.primary_email,
					balance: raw_json.balance,
				},
			});
		} catch (error) {
			console.error('Login error:', error);
			res.status(500).json({ message: 'Error logging in', error });
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' });
	}
}
