'use client';
import React, { useState, useRef, useEffect } from 'react';
import CardTitle from './CardTitle';
import { GiOpenBook } from 'react-icons/gi';
import HistoryDeets from './HistoryDeets';
import { IoMdTrendingUp, IoMdTrendingDown } from 'react-icons/io';
import Menuitems from './Menuitem';
import supabase from '@/helper/supabaseClient';

const PAGE_SIZE = 10;

interface HistoryProps {
	userId: string;
}

const History: React.FC<HistoryProps> = ({ userId }) => {
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [page, setPage] = useState(0);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const kebabRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!kebabRef.current?.contains(event.target as Node)
			) {
				setOpenMenu(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		if (userId) {
			fetchTransactions(userId);
		}
	}, [userId, page]);

	const fetchTransactions = async (uid: string) => {
		const start = page * PAGE_SIZE;
		const end = start + PAGE_SIZE - 1;

		const { data, error } = await supabase
			.from('transactions')
			.select('*')
			.or(`sender_id.eq.${uid},recipient_id.eq.${uid}`)
			.order('created_at', { ascending: false })
			.range(start, end);

		if (error) {
			console.error('Failed to fetch transactions:', error.message);
		} else {
			setTransactions(data);
		}
	};

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp);
		return date.toLocaleString('en-NG', {
			dateStyle: 'medium',
			timeStyle: 'short',
		});
	};

	return (
		<div className='w-full relative'>
			<CardTitle
				title='Past Transactions'
				handleMenuClick={() =>
					setOpenMenu((prev) => (prev === 'history' ? null : 'history'))
				}
				IconName={GiOpenBook}
				menuRef={kebabRef}
			/>
			{openMenu === 'history' && (
				<Menuitems
					items={[
						{
							label: 'Menu 1',
							onClick: () => setOpenMenu(null),
						},
						{
							label: 'Menu 2',
							onClick: () => setOpenMenu(null),
						},
					]}
					dropdownRef={dropdownRef}
				/>
			)}

			<div className='historydetails px-4'>
				{transactions.length === 0 ? (
					<p className='text-gray-400'>No transactions yet.</p>
				) : (
					transactions.map((tx) => {
						const isCredit = tx.recipient_id === userId;
						return (
							<HistoryDeets
								key={tx.id}
								headertext={isCredit ? 'Credit Alert' : 'Debit Alert'}
								time={formatTime(tx.created_at)}
								parag={
									isCredit
										? `₦${tx.amount.toLocaleString()} was received from ${
												tx.sender_account
										  }`
										: `₦${tx.amount.toLocaleString()} was sent to ${
												tx.recipient_account
										  }`
								}
								IconName={isCredit ? IoMdTrendingDown : IoMdTrendingUp}
								isSuccess={isCredit}
							/>
						);
					})
				)}
			</div>

			<div className='flex justify-between items-center mt-4 px-4'>
				<button
					onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
					disabled={page === 0}
					className='text-sm bg-gray-200 px-3 py-1 rounded disabled:opacity-50'>
					Previous
				</button>
				<button
					onClick={() => setPage((prev) => prev + 1)}
					className='text-sm bg-blue-500 text-white px-3 py-1 rounded'>
					Next
				</button>
			</div>
		</div>
	);
};

export default History;
