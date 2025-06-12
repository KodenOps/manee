import React, { useState, useEffect } from 'react';
import Button from './Button';
import { BsCaretDown } from 'react-icons/bs';
import { NigeriaBanks } from '@/data/BankDb';
import { userAccounts } from '@/data/userInfo';

interface Bank {
	id: number;
	fullName: string;
	shortName: string;
}

interface Beneficiary {
	id: string;
	shortName: string | null;
	fullName: string;
	accountNumber: string;
	bankName: string;
}

const InterbankForm = (props: Beneficiary) => {
	const [accNum, setaccNum] = useState(props.accountNumber || '');
	const [selectedBank, setSelectedBank] = useState<Bank | null>(
		NigeriaBanks.find((bank) => bank.fullName === props.bankName) || null
	);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [narrations, setnarrations] = useState<string>('');
	const [amount, setAmount] = useState<string>(''); // Formatted amount for display
	const [rawAmount, setRawAmount] = useState<number>(0.0); // Raw amount for calculation
	const [charges, setCharges] = useState<number>(0); // Charges calculated
	const [fullName, setFullName] = useState<string>(props.fullName || ''); // Store the fetched user name

	const MAX_AMOUNT = 5000000; // Maximum amount allowed

	// Function to calculate charges based on the raw amount
	const calcCharges = (amount: number) => {
		if (amount === 0) {
			return 0;
		} else if (amount <= 5000) {
			return (0.01 / 100) * amount;
		} else if (amount > 5000 && amount < 4000000) {
			return (0.02 / 100) * amount;
		} else {
			return (0.04 / 100) * amount;
		}
	};

	// Function to filter banks
	const filteredBanks = NigeriaBanks.filter(
		(bank) =>
			bank.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			bank.shortName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleBankSelect = (bank: Bank) => {
		setSelectedBank(bank);
		setSearchTerm(bank.fullName); // Set the searchTerm to the selected bank's name
	};

	// Format the amount values with commas
	const formatAmount = (value: string): string => {
		// Remove non-numeric characters except for decimal points
		const numericValue = value.replace(/[^0-9.]/g, '');
		// Prevent multiple decimal points
		if ((numericValue.match(/\./g) || []).length > 1) {
			return numericValue; // Allow the user to finish editing
		}
		// Format the number with commas
		return numericValue
			? parseInt(numericValue || '0', 10).toLocaleString()
			: '';
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/,/g, ''); // Remove existing commas
		if (/^\d*$/.test(value)) {
			// Allow only numeric input
			const numericValue = parseInt(value || '0', 10);

			if (numericValue > MAX_AMOUNT) {
				// If the value exceeds the maximum allowed amount, reset the input
				setAmount(formatAmount(MAX_AMOUNT.toString())); // Show the max amount in formatted form
				setRawAmount(MAX_AMOUNT); // Store the max value for calculation
			} else {
				const formatted = formatAmount(value);
				setAmount(formatted); // Set formatted value for display
				setRawAmount(numericValue); // Store raw value for calculation
			}
			// Recalculate charges
			setCharges(calcCharges(numericValue));
		} else if (value === '') {
			setAmount(''); // Allow clearing the input
			setRawAmount(0); // Clear raw value for calculation
			setCharges(0); // Reset charges
		}
	};

	// Effect to check account name when account number is complete
	useEffect(() => {
		if (accNum.length === 10 && selectedBank) {
			// Check if both account number and bank name match
			const matchedAccount = userAccounts.find(
				(account) =>
					account.accountNumber === accNum &&
					account.bankName === selectedBank.fullName // Include bank name in the logic
			);

			if (matchedAccount) {
				setFullName(matchedAccount.fullName); // Set the full name if a match is found
			} else {
				setFullName('Account not found'); // Show error if no match is found
			}
		} else {
			setFullName(''); // Clear the name if conditions are not met
		}
	}, [accNum, selectedBank]);

	// Effect to update fields when props change (e.g., when a beneficiary is clicked)
	useEffect(() => {
		setaccNum(props.accountNumber || '');
		setSelectedBank(
			NigeriaBanks.find((bank) => bank.fullName === props.bankName) || null
		);
		setFullName(props.fullName || '');
	}, [props]);

	return (
		<form className='flex flex-col gap-4 mt-4 w-full'>
			{/* Bank Selection */}
			<div>
				{searchTerm.length > 0 && <p className='ml-2 mb-2'>Select Bank</p>}
				<div className='input-style flex w-full justify-between items-center'>
					<input
						type='text'
						placeholder='Search or Select Bank'
						value={searchTerm || props.bankName}
						className='bg-transparent outline-none h-full w-full placeholder:text-[var(--disabled)] focus:border-[var(--primary)] focus:outline-none dark:focus:border-[var(--inputborder)]'
						onChange={(e) => {
							setSearchTerm(e.target.value);
							if (selectedBank && e.target.value !== selectedBank.fullName) {
								setSelectedBank(null); // Clear selected bank if search term is edited
							}
						}}
					/>
					<p className='text-[var(--primary-dark)] dark:text-[var(--secondary-dark)]'>
						<BsCaretDown size={20} />
					</p>
				</div>
			</div>

			{/* Dropdown for Banks */}
			{searchTerm && !selectedBank && (
				<ul className='z-10 w-full bg-white dark:bg-[var(--background-dark)] border border-[var(--primary)] dark:border-[var(--inputborder)] rounded-md shadow-md max-h-60 overflow-y-auto'>
					{filteredBanks.length > 0 ? (
						filteredBanks.map((bank) => (
							<li
								key={bank.id}
								className='px-4 py-2 cursor-pointer hover:bg-[var(--primary-light)] dark:hover:bg-[var(--inputborder)]'
								onClick={() => handleBankSelect(bank)}>
								{bank.fullName} ({bank.shortName})
							</li>
						))
					) : (
						<li className='px-4 py-2 text-gray-500'>No results found</li>
					)}
				</ul>
			)}

			{/* Account Number Field */}
			<div className='flex w-full justify-end items-end flex-col'>
				<div className='w-full'>
					{accNum.length > 0 && <p className='ml-2 mb-2'>Account Number</p>}
					<input
						type='text'
						placeholder='Enter Account Number'
						value={accNum}
						pattern='\d*'
						maxLength={10}
						className='input-style'
						onChange={(e) => {
							const value = e.target.value;
							// Prevent input of alphabets and only allow numeric values
							if (/^\d*$/.test(value)) {
								setaccNum(value);
							}
						}}
					/>
				</div>
				<p>
					{fullName ||
						(selectedBank?.fullName === props.bankName &&
						accNum === props.accountNumber
							? props.fullName
							: '')}
				</p>
			</div>

			{/* Amount Field */}
			<div className='flex w-full justify-end items-end flex-col'>
				<div className='w-full'>
					{amount.length > 0 && <p className='ml-2 mb-2'>Amount (NGN)</p>}
					<input
						type='text' // Use "text" to allow formatting
						placeholder='Enter Amount'
						value={amount}
						className='input-style bg-transparent'
						onChange={handleAmountChange}
					/>
				</div>
				<p>Charges: NGN {charges ? charges.toLocaleString() : 0}</p>{' '}
				{/* Display charges with formatting */}
			</div>

			{/* Narration */}
			<div className='w-full '>
				{narrations.length > 0 && <p className='ml-2 mb-2'>Narrations</p>}
				<textarea
					placeholder='Narration'
					value={narrations}
					maxLength={100}
					className='flex min-h-[100px] w-full input-style'
					onChange={(e) => {
						const value = e.target.value;
						setnarrations(value);
					}}
				/>
			</div>

			<Button
				text='Proceed To Transfer'
				type='primary'
			/>
		</form>
	);
};

export default InterbankForm;
