'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import Button from '@/components/Button';

const MAX_PLAYERS = 6;
interface RoomMemberPayload {
	room_id: string;
	[key: string]: any;
}
const RoomDetailPage = () => {
	const params = useParams();
	const id: string = Array.isArray(params.id) ? params.id[0] : params.id ?? '';
	const [room, setRoom] = useState<any>(null);
	const [members, setMembers] = useState<any[]>([]);
	const [emailOrAccount, setEmailOrAccount] = useState('');
	const [chatMessages, setChatMessages] = useState<any[]>([]);
	const [chatInput, setChatInput] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (id) {
			fetchRoomData(id);
			fetchRoomChats(id);

			const chatSub = supabase
				.channel('room_chats')
				.on(
					'postgres_changes',
					{ event: 'INSERT', schema: 'public', table: 'room_chats' },
					(payload) => {
						if (payload.new.room_id === id) {
							setChatMessages((prev) => [...prev, payload.new]);
						}
					}
				)
				.subscribe();

			const memberSub = supabase
				.channel('room_members')
				.on(
					'postgres_changes',
					{ event: '*', schema: 'public', table: 'room_members' },
					(payload) => {
						if ((payload.new as RoomMemberPayload).room_id === id) {
							fetchRoomData(id);
						}
					}
				)
				.subscribe();

			return () => {
				supabase.removeChannel(chatSub);
				supabase.removeChannel(memberSub);
			};
		}
	}, [id]);

	const fetchRoomData = async (roomId: string) => {
		const { data: roomData } = await supabase
			.from('rooms')
			.select('*')
			.eq('id', roomId)
			.single();

		const { data: memberData, error } = await supabase
			.from('room_members')
			.select(
				`*, profiles:profiles!room_members_user_id_fkey(id, email, account_number, first_name, last_name)`
			)
			.eq('room_id', roomId);

		if (error) {
			console.error('Error fetching members:', error);
		}

		setRoom(roomData);
		setMembers(memberData || []);
	};

	const fetchRoomChats = async (roomId: string) => {
		const { data: messages } = await supabase
			.from('room_chats')
			.select('*')
			.eq('room_id', roomId)
			.order('sent_at', { ascending: true });
		setChatMessages(messages || []);
	};

	const handleAddUser = async () => {
		if (members.length >= MAX_PLAYERS) {
			alert('Maximum number of players reached');
			return;
		}

		setLoading(true);
		try {
			const { data: profiles, error } = await supabase
				.from('profiles')
				.select('id')
				.or(`email.eq.${emailOrAccount},account_number.eq.${emailOrAccount}`)
				.single();

			if (error || !profiles) throw new Error('User not found');

			const alreadyExists = members.some((m) => m.user_id === profiles.id);
			if (alreadyExists) throw new Error('User is already in the room');

			const { error: insertError } = await supabase
				.from('room_members')
				.insert([
					{
						room_id: id,
						user_id: profiles.id,
						has_paid: false,
						has_accepted: false,
					},
				]);

			if (insertError) throw insertError;

			setEmailOrAccount('');
		} catch (err: any) {
			alert(err.message);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveUser = async (userId: string) => {
		await supabase
			.from('room_members')
			.delete()
			.match({ room_id: id, user_id: userId });
		fetchRoomData(id);
	};

	const handleSendMessage = async () => {
		if (!chatInput.trim()) return;

		const user = await supabase.auth.getUser();
		const userId = user.data.user?.id;
		if (!userId) return;

		await supabase.from('room_chats').insert([
			{
				room_id: id,
				user_id: userId,
				message: chatInput.trim(),
			},
		]);
		setChatInput('');
	};

	const handleStartGame = async () => {
		await supabase.from('rooms').update({ status: 'active' }).eq('id', id);
		alert('Game started! (You can now redirect to /game/[roomId])');
	};

	if (!room) return <div className='text-center mt-10'>Loading room...</div>;
	return (
		<div className='max-w-4xl mx-auto p-6 space-y-8'>
			<h1 className='text-2xl font-bold'>Room ID: {id}</h1>
			<p>Stake: ₦{room.stake_amount}</p>
			<p>
				Players: {members.length}/{MAX_PLAYERS}
			</p>

			<div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4'>
				<h2 className='text-lg font-semibold'>Add Players</h2>
				<div className='flex gap-2'>
					<input
						type='text'
						placeholder='Enter email or account number'
						value={emailOrAccount}
						onChange={(e) => setEmailOrAccount(e.target.value)}
						className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600'
					/>
					<Button
						text={loading ? 'Adding...' : 'Add'}
						type='primary'
						onclickfunction={handleAddUser}
					/>
				</div>

				<ul className='space-y-2'>
					{members.map((m, idx) => (
						<li
							key={idx}
							className='flex justify-between items-center border rounded p-3 bg-white dark:bg-gray-800'>
							<div>
								<p className='text-sm'>
									{m.profiles?.first_name} {m.profiles?.last_name} (
									{m.profiles?.email || m.profiles?.account_number})
								</p>
								<p className='text-xs text-gray-500'>
									Has paid: {m.has_paid ? 'Yes' : 'No'}
								</p>
							</div>
							<button
								onClick={() => handleRemoveUser(m.user_id)}
								className='text-red-500 text-sm hover:underline'>
								Remove
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4'>
				<h2 className='text-lg font-semibold'>Live Chat</h2>
				<div className='max-h-64 overflow-y-auto border p-2 rounded'>
					{chatMessages.map((msg, i) => (
						<p
							key={i}
							className='text-sm mb-1'>
							<span className='font-semibold'>{msg.user_id.slice(0, 6)}:</span>{' '}
							{msg.message}
						</p>
					))}
				</div>
				<div className='flex gap-2'>
					<input
						type='text'
						placeholder='Type your message'
						value={chatInput}
						onChange={(e) => setChatInput(e.target.value)}
						className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600'
					/>
					<Button
						text='Send'
						type='primary'
						onclickfunction={handleSendMessage}
					/>
				</div>
			</div>

			<div className='text-center'>
				<Button
					text='Start Wordle Game'
					type='primary'
					onclickfunction={handleStartGame}
				/>
			</div>
		</div>
	);
};

export default RoomDetailPage;
