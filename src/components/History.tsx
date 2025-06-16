'use client';
import React, { useState, useRef, useEffect } from 'react';
import CardTitle from './CardTitle';
import { GiOpenBook } from 'react-icons/gi';
import HistoryDeets from './HistoryDeets';
import { IoMdTrendingUp, IoMdTrendingDown } from 'react-icons/io';
import { FiDownload, FiShare2 } from 'react-icons/fi';
import Menuitems from './Menuitem';
import supabase from '@/helper/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import mylogo from '../../public/assets/logo-dash.svg';
const PAGE_SIZE = 5;

interface HistoryProps {
	userId?: string;
}

const History: React.FC<HistoryProps> = ({ userId: initialUserId }) => {
	const [userId, setUserId] = useState<string>(initialUserId || '');
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [transactions, setTransactions] = useState<any[]>([]);
	const [totalCount, setTotalCount] = useState(0);

	const [page, setPage] = useState(0);
	// const [userId, setUserId] = useState<string>('');

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
		const fetchUserAndTransactions = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUserId(user.id);
				fetchTransactions(user.id);
			}
		};
		fetchUserAndTransactions();
	}, []);

	useEffect(() => {
		if (userId) {
			fetchTransactions(userId);
		}
	}, [page]);

	const fetchTransactions = async (uid: string) => {
		const start = page * PAGE_SIZE;
		const end = start + PAGE_SIZE - 1;

		// Fetch total count first
		const { count } = await supabase
			.from('transactions')
			.select('*', { count: 'exact', head: true })
			.or(`sender_id.eq.${uid},recipient_id.eq.${uid}`);

		if (count !== null) {
			setTotalCount(count);
		}

		// Fetch paginated data
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

	const downloadReceipt = async (tx: any) => {
		const isCredit = tx.recipient_id === userId;
		const doc = new jsPDF();

		// Add logo
		const img = new Image();
		img.src = '/assets/logo.png';
		await new Promise((res) => {
			img.onload = res;
		});
		doc.addImage(img, 'SVG', 80, 10, 50, 20);

		doc.setFontSize(16);
		doc.text('Transaction Receipt', 20, 40);
		doc.setFontSize(12);

		autoTable(doc, {
			startY: 50,
			head: [['Field', 'Details']],
			body: [
				['Transaction ID', tx.id],
				['Date', formatTime(tx.created_at)],
				['Type', isCredit ? 'Credit' : 'Debit'],
				['Amount', `₦${tx.amount.toLocaleString()}`],
				[
					isCredit ? 'From' : 'To',
					isCredit ? tx.sender_account : tx.recipient_account,
				],
				['Narration', tx.narration || 'N/A'],
			],
		});

		doc.save(`manee_receipt_${tx.id}.pdf`);
	};
	const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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
							<div
								key={tx.id}
								className='relative'>
								<HistoryDeets
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
								<div className='absolute top-2 right-2 flex gap-2 text-blue-500 text-lg'>
									<button
										onClick={() => downloadReceipt(tx)}
										title='Download Receipt'>
										<FiDownload />
									</button>
									<button
										onClick={() => alert('Share functionality coming soon')}
										title='Share Receipt'>
										<FiShare2 />
									</button>
								</div>
							</div>
						);
					})
				)}
			</div>

			<div className='flex justify-center items-center mt-4 px-4 gap-6 text-sm'>
				<button
					onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
					disabled={page === 0}
					className='text-gray-600 dark:text-gray-300 disabled:text-gray-400'>
					&lt; Prev
				</button>

				<span className='text-gray-600 dark:text-gray-300'>
					Page {page + 1} of {totalPages || 1}
				</span>

				<button
					onClick={() =>
						setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
					}
					disabled={page + 1 >= totalPages}
					className='text-gray-600 dark:text-gray-300 disabled:text-gray-400'>
					Next &gt;
				</button>
			</div>
		</div>
	);
};

export default History;
