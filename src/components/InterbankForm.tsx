	'use client';
	import React, { useEffect, useState } from 'react';
	import supabase from '@/helper/supabaseClient';
	import Button from './Button';

	interface BeneficiaryProps {
		id: string; // sender's profile ID
		fullName: string;
		accountNumber: string;
		onSuccess?: () => void;
	}

	const MAX_AMOUNT = 5_000_000;

	const InterbankForm: React.FC<BeneficiaryProps> = ({
		id: senderProfileId,
		fullName: initialFullName,
		accountNumber: initialAccNum,
		onSuccess,
	}) => {
		const [accountNumber, setAccountNumber] = useState(initialAccNum || '');
		const [accountName, setAccountName] = useState(initialFullName || '');
		const [amount, setAmount] = useState('');
		const [rawAmount, setRawAmount] = useState(0);
		const [charges, setCharges] = useState(0);
		const [narration, setNarration] = useState('');
		const [loading, setLoading] = useState(false);
		const [error, setError] = useState('');
		const [success, setSuccess] = useState('');
		useEffect(() => {
			setAccountName(initialFullName);
			setAccountNumber(initialAccNum);
		}, [initialFullName, initialAccNum]);
		const formatWithCommas = (value: number | string) =>
			parseInt(value.toString(), 10).toLocaleString();

		const calculateCharges = (amount: number) => {
			if (amount === 0) return 0;
			if (amount <= 5000) return (0.01 / 100) * amount;
			if (amount < 4000000) return (0.02 / 100) * amount;
			return (0.04 / 100) * amount;
		};

		const resolveAccountName = async (accNum: string) => {
			if (accNum.length !== 10) return;

			const { data, error } = await supabase
				.from('profiles')
				.select('first_name, last_name')
				.eq('account_number', accNum)
				.single();

			if (error || !data) {
				setAccountName('Account not found');
			} else {
				setAccountName(`${data.first_name} ${data.last_name}`);
			}
		};

		const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = e.target.value.replace(/,/g, '');
			if (!/^\d*$/.test(raw)) return;

			const numeric = parseInt(raw || '0', 10);
			const capped = Math.min(numeric, MAX_AMOUNT);

			setRawAmount(capped);
			setAmount(formatWithCommas(capped));
			setCharges(calculateCharges(capped));
		};

		const handleAccountNumberChange = async (value: string) => {
			if (!/^\d{0,10}$/.test(value)) return;
			setAccountNumber(value);

			if (value.length === 10) {
				await resolveAccountName(value);
			} else {
				setAccountName('');
			}
		};

		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			setLoading(true);
			setError('');
			setSuccess('');

			if (!accountNumber || rawAmount <= 0) {
				setError('Enter a valid account and amount');
				setLoading(false);
				return;
			}

			const totalDebit = rawAmount + charges;

			// Fetch sender profile
			const { data: sender, error: senderErr } = await supabase
				.from('profiles')
				.select('balance')
				.eq('id', senderProfileId)
				.single();
			console.log('Sender Profile ID:', senderProfileId);

			if (senderErr || !sender) {
				setError('Failed to fetch sender balance.');
				setLoading(false);
				return;
			}

			if (sender.balance < totalDebit) {
				setError('Insufficient balance.');
				setLoading(false);
				return;
			}

			// Fetch recipient profile
			const { data: recipient, error: recipientErr } = await supabase
				.from('profiles')
				.select('id, balance')
				.eq('account_number', accountNumber)
				.single();

			if (recipientErr || !recipient) {
				setError('Recipient account not found.');
				setLoading(false);
				return;
			}

			// Perform transfer atomically
			const { error: txError } = await supabase.rpc('transfer_funds', {
				sender_id: senderProfileId,
				recipient_id: recipient.id,
				amount: rawAmount,
				charges,
				narration,
				recipient_account: accountNumber,
			});
			if (txError) {
				setError('Transaction failed. ' + txError.message);
			} else {
				setSuccess('Transfer successful!');
				setTimeout(() => {
					setAccountNumber('');
					setAccountName('');
					setAmount('');
					setRawAmount(0);
					setCharges(0);
					setNarration('');
					if (onSuccess) onSuccess();
				}, 1500);
			}
		};

		useEffect(() => {
			setAccountNumber(initialAccNum);
			setAccountName(initialFullName);
		}, [senderProfileId, initialAccNum, initialFullName]);

		return (
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-4 mt-4 w-full'>
				{/* Account Number */}
				<div className='flex flex-col'>
					<p className='ml-2 mb-2'>Account Number</p>
					<input
						type='text'
						value={accountNumber}
						onChange={(e) => handleAccountNumberChange(e.target.value)}
						placeholder='Enter Account Number'
						maxLength={10}
						className='input-style'
					/>
					{accountNumber.length === 10 && (
						<p className='mt-1 text-md font-semibold capitalize text-gray-500 w-full text-end'>
							{accountName}
						</p>
					)}
				</div>

				{/* Amount */}
				<div className='flex flex-col'>
					<p className='ml-2 mb-2'>Amount (NGN)</p>
					<input
						type='text'
						value={amount}
						onChange={handleAmountChange}
						placeholder='Enter Amount'
						className='input-style'
					/>
					<p className='mt-1 text-sm w-full text-end'>
						Charges: NGN {formatWithCommas(charges)}
					</p>
				</div>

				{/* Narration */}
				<div>
					<p className='ml-2 mb-2'>Narration</p>
					<textarea
						value={narration}
						onChange={(e) => setNarration(e.target.value)}
						className='input-style w-full min-h-[100px]'
						maxLength={100}
						placeholder='Narration'
					/>
				</div>

				{error && <p className='text-red-500'>{error}</p>}
				{success && <p className='text-green-500'>{success}</p>}

				<Button
					text={loading ? 'Processing...' : 'Proceed To Transfer'}
					type='primary'
				/>
			</form>
		);
	};

	export default InterbankForm;
