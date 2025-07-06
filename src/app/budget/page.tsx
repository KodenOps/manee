'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { LuLayoutGrid } from 'react-icons/lu';

import HeaderNav from '@/components/HeaderNav';
import SideNav from '@/components/SideNav';
import BudgetSummary from '@/components/BudgetSummary';
import SetBudgetModal from '@/components/SetBudgetModal';
import CreateBucketModal from '@/components/CreateBucketModal';
import { useUser } from '@/components/UserContext';
import BudgetGauge from '@/components/BudgetGuage';
import supabase from '@/helper/supabaseClient';
import { IoMdAddCircleOutline } from 'react-icons/io';
import WithAuthentication from '@/components/WithAuthentication';
import CardTitle from '@/components/CardTitle';
import Menuitems from '@/components/Menuitem';

const Page = () => {
	const { userProfile, loading } = useUser();

	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [showCreateBucket, setShowCreateBucket] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);
	const [selectedBucketId, setSelectedBucketId] = useState<string>('');
	const [availableBuckets, setAvailableBuckets] = useState<any[]>([]);
	const [showCloseConfirm, setShowCloseConfirm] = useState(false);
	const [budgetCount, setBudgetCount] = useState<number>(0);

	const quickMenuRef = useRef<HTMLDivElement | null>(null);
	const budgetMenuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const fetchBuckets = async () => {
			if (!userProfile?.id) return;
			const now = new Date().toISOString();

			await supabase
				.from('budget_buckets')
				.update({ status: 'closed' })
				.lt('end_date', now)
				.eq('user_id', userProfile.id)
				.eq('status', 'open');

			const { data, error } = await supabase
				.from('budget_buckets')
				.select('*')
				.eq('user_id', userProfile.id)
				.eq('status', 'open')
				.gte('end_date', now)
				.order('created_at', { ascending: false });

			if (!error && data?.length) {
				setAvailableBuckets(data);
				setSelectedBucketId(data[0].id);
			} else {
				setAvailableBuckets([]);
				setSelectedBucketId('');
			}
		};

		fetchBuckets();
	}, [refreshKey, userProfile?.id]);

	// Fetch budget count for selected bucket
	useEffect(() => {
		const fetchBudgets = async () => {
			if (!selectedBucketId || !userProfile?.id) return;

			const { data, error } = await supabase
				.from('budget_categories')
				.select('id')
				.eq('user_id', userProfile.id)
				.eq('bucket_id', selectedBucketId);

			if (!error && data) {
				setBudgetCount(data.length);
			}
		};

		fetchBudgets();
	}, [selectedBucketId, userProfile?.id, refreshKey]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				openMenu &&
				!quickMenuRef.current?.contains(target) &&
				!budgetMenuRef.current?.contains(target)
			) {
				setOpenMenu(null);
			}
		};

		if (openMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openMenu]);

	const handleSetBudgetClick = async () => {
		if (!userProfile?.id) return;

		const now = new Date().toISOString();

		const { data: openBuckets, error } = await supabase
			.from('budget_buckets')
			.select('id')
			.eq('user_id', userProfile.id)
			.eq('status', 'open')
			.gte('end_date', now);

		if (error) {
			console.error('Failed to fetch budget buckets:', error);
			return;
		}

		if (openBuckets && openBuckets.length > 0) {
			setShowModal(true);
		} else {
			setShowCreateBucket(true);
		}
	};

	const handleCloseBucket = async () => {
		if (!selectedBucketId || !userProfile?.id) return;

		const { error } = await supabase
			.from('budget_buckets')
			.update({ status: 'closed' })
			.eq('id', selectedBucketId)
			.eq('user_id', userProfile.id);

		if (error) {
			console.error('Error closing bucket:', error.message);
			return;
		}

		setShowCloseConfirm(false);
		setRefreshKey((prev) => prev + 1);
		setSelectedBucketId('');
	};

	if (loading || !userProfile) {
		return (
			<ThemeProvider
				attribute='class'
				defaultTheme='system'>
				<div className='text-center mt-20 text-gray-500 dark:text-gray-400'>
					Loading profile...
				</div>
			</ThemeProvider>
		);
	}

	return (
		<div className='bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px] w-full overflow-x-hidden'>
			<SideNav />
			<HeaderNav userprofile={userProfile} />

			<div className='mainbody md:ml-[210px]'>
				<div className='top flex items-start justify-between w-full md:mt-10 mt-[100px] px-4 relative'>
					<CardTitle
						title='Finance Summary'
						handleMenuClick={() =>
							setOpenMenu((prev) => (prev === 'quick' ? null : 'quick'))
						}
						IconName={LuLayoutGrid}
					/>
					{openMenu === 'quick' && (
						<div
							ref={quickMenuRef}
							className='absolute right-4 top-12 z-50'>
							<Menuitems
								items={[
									{ label: 'Menu 1', onClick: () => setOpenMenu(null) },
									{ label: 'Menu 2', onClick: () => setOpenMenu(null) },
								]}
							/>
						</div>
					)}
				</div>

				<div className='accountCards shadow-md md:px-[24px] px-[8px] gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto'>
					{selectedBucketId && <BudgetSummary bucketId={selectedBucketId} />}
				</div>

				<div className='flex justify-between w-full px-[16px] py-[8px] items-center'>
					<div className='titleIcon flex items-center gap-4'>
						<span className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
							<LuLayoutGrid size={24} />
						</span>
						<h2 className='text-[var(--primary)] dark:text-[var(--secondary-dark)] font-semibold text-lg'>
							{availableBuckets.find((b) => b.id === selectedBucketId)?.title ||
								'My Budgets'}
						</h2>
					</div>
					<div className='flex items-center gap-2 md:p-4 p-2'>
						<div
							className='flex items-center gap-2 justify-end md:p-4 p-2 rounded-md bg-[var(--primary)] dark:bg-[var(--secondary-dark)] dark:text-black text-white cursor-pointer'
							onClick={handleSetBudgetClick}>
							<span className='md:block hidden'>
								{budgetCount === 0 ? 'Add New Budget' : 'Add More Budget'}
							</span>
							<IoMdAddCircleOutline size={24} />
						</div>
					</div>
				</div>

				<div className='maincharts px-4 md:px-8 flex flex-col items-start w-full mt-4'>
					{selectedBucketId && (
						<>
							<BudgetGauge
								key={refreshKey}
								bucketId={selectedBucketId}
							/>
						</>
					)}
				</div>

				{showCloseConfirm && (
					<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
						<div className='bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl'>
							<h2 className='text-xl font-bold text-red-700 dark:text-red-300 mb-4'>
								Close This Bucket?
							</h2>
							<p className='text-gray-700 dark:text-gray-300 mb-6'>
								Closing this bucket means you've completed the budget and
								spending for this particular income. <br />
								<span className='font-semibold'>Use "Delete Budget"</span>{' '}
								instead if you only want to remove a particular budget inside
								this bucket.
							</p>
							<div className='flex justify-end gap-3'>
								<button
									onClick={() => setShowCloseConfirm(false)}
									className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400'>
									Cancel
								</button>
								<button
									onClick={handleCloseBucket}
									className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>
									Yes, Close Bucket
								</button>
							</div>
						</div>
					</div>
				)}

				{showModal && selectedBucketId && (
					<SetBudgetModal
						onClose={() => setShowModal(false)}
						onBudgetSaved={() => {
							setShowModal(false);
							setRefreshKey((prev) => prev + 1);
						}}
						bucketId={selectedBucketId}
					/>
				)}

				{showCreateBucket && (
					<CreateBucketModal
						onClose={() => setShowCreateBucket(false)}
						onCreated={() => {
							setShowCreateBucket(false);
							setShowModal(true);
							setRefreshKey((prev) => prev + 1);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default WithAuthentication(Page);
