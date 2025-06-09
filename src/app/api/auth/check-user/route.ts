import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return NextResponse.json({ error: 'Email is required' }, { status: 400 });
		}

		// List all users (or paginate if you have many)
		const { data, error } = await supabaseAdmin.auth.admin.listUsers();

		if (error) {
			return NextResponse.json(
				{ error: 'Error fetching users' },
				{ status: 500 }
			);
		}

		// Filter users by email (case-insensitive)
		const user = data.users.find(
			(u) => u.email?.toLowerCase() === email.toLowerCase()
		);

		if (!user) {
			// No user found — safe to register
			return NextResponse.json({ exists: false });
		}

		// User found, check confirmation
		const isConfirmed = !!user.email_confirmed_at;

		return NextResponse.json({ exists: isConfirmed });
	} catch (err) {
		return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
	}
}
