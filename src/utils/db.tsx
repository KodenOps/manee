// db.ts
import { Pool } from 'pg';

const pool = new Pool({
	connectionString: process.env.DATABASE_URL, // use Neon URL or local
	ssl: {
		rejectUnauthorized: false,
	},
});

export async function syncUserToDb(user: {
	id: string;
	display_name: string;
	primary_email: string;
	signed_up_at_millis: string; // or number
	balance: string; // should be numeric string
	account_number: string;
}) {
	const client = await pool.connect();
	try {
		const raw_json = JSON.stringify(user);

		await client.query(
			`INSERT INTO neon_auth.users_sync (raw_json)
       VALUES ($1::jsonb)
       ON CONFLICT (id) DO NOTHING`, // or update if needed
			[raw_json]
		);
	} catch (err) {
		console.error('Error inserting user into users_sync:', err);
	} finally {
		client.release();
	}
}
