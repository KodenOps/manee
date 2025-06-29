'use client';
import React, { useEffect, useState } from 'react';
import supabase from '@/helper/supabaseClient';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

interface CreateRoomModalProps {
	onClose: () => void;
}

const CreateRoomModal = ({ onClose }: CreateRoomModalProps) => {
	const [stakeAmount, setStakeAmount] = useState(0);
	const [balance, setBalance] = useState(0);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchBalance = async () => {
			const user = await supabase.auth.getUser();
			const userId = user.data.user?.id;
			if (!userId) return;

			const { data, error } = await supabase
				.from('profiles')
				.select('balance')
				.eq('id', userId)
				.single();

			if (!error && data) {
				setBalance(data.balance);
			}
		};
		fetchBalance();
	}, []);

	const handleCreateRoom = async () => {
		setLoading(true);
		try {
			const user = await supabase.auth.getUser();
			const userId = user.data.user?.id;

			if (!userId) throw new Error('User not authenticated');
			if (stakeAmount < 1000) throw new Error('Minimum stake amount is ₦1000');
			if (stakeAmount > balance)
				throw new Error('Stake exceeds available balance');

			const { data: wordList, error: wordError } = await supabase
				.from('wordle_words')
				.select('id');

			if (wordError || !wordList || wordList.length === 0)
				throw new Error('Failed to fetch a word');

			const randomIndex = Math.floor(Math.random() * wordList.length);
			const word = wordList[randomIndex];

			const { data: room, error: roomError } = await supabase
				.from('rooms')
				.insert([
					{
						owner_id: userId,
						stake_amount: stakeAmount,
						word_id: word.id,
						status: 'waiting',
					},
				])
				.select()
				.single();

			if (roomError) throw roomError;

			await supabase.from('room_members').insert([
				{
					room_id: room.id,
					user_id: userId,
					has_paid: true,
				},
			]);

			const { error: balanceError } = await supabase
				.from('profiles')
				.update({ balance: balance - stakeAmount })
				.eq('id', userId);

			if (balanceError) throw balanceError;

			router.push(`/rooms/${room.id}`);
		} catch (err: any) {
			alert(err.message);
		} finally {
			setLoading(false);
		}
	};

	const quickStakes = [100, 500, 1000, 2000];

	return (
		<div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50'>
			<div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl'>
				<h2 className='text-xl font-bold mb-4 text-center'>
					Create a Game Room
				</h2>

				<input
					type='number'
					placeholder='Enter stake amount'
					value={stakeAmount}
					onChange={(e) => {
						const newValue = Number(e.target.value);
						if (newValue <= balance) setStakeAmount(newValue);
					}}
					className='w-full px-4 py-2 border rounded-md mb-2 dark:bg-gray-700 dark:border-gray-600'
				/>
				<p className='text-sm mb-2 text-gray-500 dark:text-gray-400'>
					Available balance: ₦{balance.toLocaleString()}
				</p>

				<div className='flex gap-2 flex-wrap mb-4'>
					{quickStakes.map((amount) => (
						<button
							key={amount}
							onClick={() => {
								const newStake = stakeAmount + amount;
								if (newStake <= balance) {
									setStakeAmount(newStake);
								} else {
									alert('Stake exceeds your available balance');
								}
							}}
							className='px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-600'>
							+₦{amount}
						</button>
					))}
				</div>

				<div className='flex justify-between gap-4'>
					<Button
						text='Cancel'
						type='secondary'
						onclickfunction={onClose}
					/>
					<Button
						text={loading ? 'Creating...' : 'Create Room'}
						type='primary'
						onclickfunction={handleCreateRoom}
					/>
				</div>
			</div>
		</div>
	);
};

export default CreateRoomModal;
