'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { LuLayoutGrid } from 'react-icons/lu';

import HeaderNav from '@/components/HeaderNav';
import SideNav from '@/components/SideNav';
import Menuitems from '@/components/Menuitem';
import CardTitle from '@/components/CardTitle';
import BudgetSummary from '@/components/BudgetSummary';
import SetBudgetModal from '@/components/SetBudgetModal';
import { useUser } from '@/components/UserContext';
import BudgetGauge from '@/components/BudgetGuage';
import WithAuthentication from '@/components/WithAuthentication';
import CategoryPieChart from '@/components/CategoryPieChart';
import IncomeTrendLineChart from '@/components/IncomeTrendLineChart';
import supabase from '@/helper/supabaseClient';

const Page = () => {
	const { userProfile, loading } = useUser();

	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [openBucketId, setOpenBucketId] = useState<string | null>(null);

	const financeMenuRef = useRef<HTMLDivElement | null>(null);
	const expenseMenuRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (openMenu === 'finance' && !financeMenuRef.current?.contains(target)) {
				setOpenMenu(null);
			} else if (
				openMenu === 'expenses' &&
				!expenseMenuRef.current?.contains(target)
			) {
				setOpenMenu(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [openMenu]);

	useEffect(() => {
		const fetchOpenBucket = async () => {
			if (!userProfile?.id) return;
			const now = new Date().toISOString();
			const { data, error } = await supabase
				.from('budget_buckets')
				.select('id')
				.eq('user_id', userProfile.id)
				.eq('status', 'open')
				.gte('end_date', now)
				.order('created_at', { ascending: false })
				.limit(1);
			if (!error && data?.length) {
				setOpenBucketId(data[0].id);
			} else {
				setOpenBucketId(null);
			}
		};
		fetchOpenBucket();
	}, [userProfile?.id]);

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
				{/* Finance Summary Section */}
				<div className='top flex items-start justify-between w-full md:mt-10 mt-[100px] px-4 relative'>
					<CardTitle
						title='Finance Summary'
						handleMenuClick={() =>
							setOpenMenu((prev) => (prev === 'finance' ? null : 'finance'))
						}
						IconName={LuLayoutGrid}
						menuRef={financeMenuRef}
					/>
					{openMenu === 'finance' && (
						<div
							ref={financeMenuRef}
							className='absolute right-4 top-12 z-50'>
							<Menuitems
								items={[
									{ label: 'Refresh', onClick: () => setOpenMenu(null) },
									{ label: 'Export Summary', onClick: () => setOpenMenu(null) },
								]}
							/>
						</div>
					)}
				</div>

				{/* Summary Cards */}
				<div className='accountCards shadow-md md:px-[24px] px-[8px] gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto'>
					{openBucketId && <BudgetSummary bucketId={openBucketId} />}
				</div>

				{/* Expenses Overview Section */}
				<div className='top flex items-start justify-between w-full mt-10 px-4 relative'>
					<CardTitle
						title='Expenses Overview'
						handleMenuClick={() =>
							setOpenMenu((prev) => (prev === 'expenses' ? null : 'expenses'))
						}
						IconName={LuLayoutGrid}
						menuRef={expenseMenuRef}
					/>
					{openMenu === 'expenses' && (
						<div
							ref={expenseMenuRef}
							className='absolute right-4 top-12 z-50'>
							<Menuitems
								items={[
									{
										label: 'View All Expenses',
										onClick: () => setOpenMenu(null),
									},
									{ label: 'Export to CSV', onClick: () => setOpenMenu(null) },
								]}
							/>
						</div>
					)}
				</div>

				{/* dashboards */}
				<div className='p-4 flex flex-wrap md:flex-nowrap items-start justify-start gap-4'>
					<div className='md:w-[400px] w-full mb-4'>
						<div className='h-[400px]'>
							<CategoryPieChart bucketId={openBucketId} />
						</div>
					</div>
					<div className='md:w-[400px] w-full mb-4'>
						<div className='h-[400px]'>
							<IncomeTrendLineChart />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WithAuthentication(Page);
