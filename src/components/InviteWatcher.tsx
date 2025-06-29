// components/InviteWatcher.tsx
'use client';
import { useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import Button from './Button';
import { useRouter } from 'next/navigation';

const InviteWatcher = () => {
	const [invite, setInvite] = useState<any | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		const init = async () => {
			const { data: authUser } = await supabase.auth.getUser();
			const uid = authUser.user?.id;
			if (!uid) return;

			setUserId(uid);
			const { data: pendingInvite } = await supabase
				.from('room_members')
				.select('*, rooms(stake_amount)')
				.eq('user_id', uid)
				.eq('has_accepted', false)
				.single();

			if (pendingInvite) {
				setInvite(pendingInvite);
			}
		};

		init();
	}, []);

	const handleAcceptInvite = async () => {
		if (!invite || !userId) return;

		// 1. Get profile & balance
		const { data: profile } = await supabase
			.from('profiles')
			.select('balance')
			.eq('id', userId)
			.single();

		if (!profile || profile.balance < invite.rooms.stake_amount) {
			alert('Insufficient balance');
			return;
		}

		// 2. Deduct stake
		const { error: updateErr } = await supabase
			.from('profiles')
			.update({
				balance: profile.balance - invite.rooms.stake_amount,
			})
			.eq('id', userId);

		if (updateErr) return alert('Failed to deduct balance');

		// 3. Mark as accepted
		const { error: acceptErr } = await supabase
			.from('room_members')
			.update({ has_accepted: true, has_paid: true })
			.eq('room_id', invite.room_id)
			.eq('user_id', userId);

		if (acceptErr) return alert('Error accepting invite');

		alert('Joined room successfully!');
		setInvite(null);
		router.push(`/rooms/${invite.room_id}`);
	};

	if (!invite) return null;

	return (
		<div className='fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center space-y-4'>
				<h2 className='text-xl font-bold'>You've been invited to a game</h2>
				<p>Stake Amount: ₦{invite.rooms.stake_amount}</p>
				<div className='flex justify-center gap-4 mt-4'>
					<Button
						text='Ignore'
						type='secondary'
						onclickfunction={() => setInvite(null)}
					/>
					<Button
						text='Accept & Join'
						type='primary'
						onclickfunction={handleAcceptInvite}
					/>
				</div>
			</div>
		</div>
	);
};

export default InviteWatcher;
