import bcrypt from 'bcryptjs';
// import { query } from '@/utils/db';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { username, password, email, balance, accountNumber } = req.body;

		if (!username || !password || !email || !accountNumber || !balance) {
			return res.status(400).json({
				message:
					'All fields are required: username, password, email, balance, accountNumber',
			});
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const id = uuidv4();
		const nowMillis = Date.now();

		const rawJson = {
			id,
			display_name: username,
			primary_email: email,
			signed_up_at_millis: nowMillis.toString(),
			balance: balance.toString(),
			account_number: accountNumber,
		};

		try {
			// Insert into users_sync
			await query(
				`INSERT INTO neon_auth.users_sync (raw_json) VALUES ($1::jsonb)`,
				[JSON.stringify(rawJson)]
			);

			// Optionally, store hashed password in another table
			await query(
				`INSERT INTO auth_users (id, password_hash) VALUES ($1, $2)`,
				[id, hashedPassword]
			);

			res
				.status(201)
				.json({ message: 'User created successfully', user_id: id });
		} catch (error) {
			console.error('Signup error:', error);
			res.status(500).json({ message: 'Error creating user', error });
		}
	} else {
		res.status(405).json({ message: 'Method not allowed' });
	}
}
