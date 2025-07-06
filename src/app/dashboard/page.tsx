'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import CardTitle from '@/components/CardTitle';
import { LuLayoutGrid } from 'react-icons/lu';
import SideNav from '@/components/SideNav';
import HeaderNav from '@/components/HeaderNav';
import {
	FaBullseye,
	FaHandHoldingDollar,
	FaMoneyBillTransfer,
	FaScaleBalanced,
} from 'react-icons/fa6';
import WithAuthentication from '@/components/WithAuthentication';
import supabase from '@/helper/supabaseClient';
import Menuitems from '@/components/Menuitem';
import NavBox from '@/components/NavBox';
import { AiOutlinePieChart } from 'react-icons/ai';
import { useUser } from '@/components/UserContext';
import { BsBank } from 'react-icons/bs';
import BudgetSummary from '@/components/BudgetSummary';

const Page = () => {
	const { userProfile, loading } = useUser();
	const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
	const [isCardMenuOpen, setIsCardMenuOpen] = useState(false);
	const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);

	const topMenuRef = useRef<HTMLDivElement>(null);
	const cardMenuRef = useRef<HTMLDivElement>(null);

	// Close menus on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				isTopMenuOpen &&
				topMenuRef.current &&
				!topMenuRef.current.contains(e.target as Node)
			) {
				setIsTopMenuOpen(false);
			}
			if (
				isCardMenuOpen &&
				cardMenuRef.current &&
				!cardMenuRef.current.contains(e.target as Node)
			) {
				setIsCardMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isTopMenuOpen, isCardMenuOpen]);

	// Get current budget bucket
	useEffect(() => {
		const fetchCurrentBucket = async () => {
			if (!userProfile?.id) return;

			const { data, error } = await supabase
				.from('budget_buckets')
				.select('*')
				.eq('user_id', userProfile.id)
				.eq('status', 'open')
				.order('start_date', { ascending: false })
				.limit(1)
				.single();

			if (data) {
				setSelectedBucketId(data.id);
			} else {
				console.warn('No open budget bucket found or error:', error);
			}
		};

		fetchCurrentBucket();
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
		<ThemeProvider
			attribute='class'
			defaultTheme='system'>
			<div className='flex bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px] w-full overflow-x-hidden'>
				<SideNav />
				<div className='w-full'>
					<HeaderNav userprofile={userProfile} />

					{/* Top Menu */}
					<div className='md:ml-[210px] pt-8 px-4 relative md:my-0 mt-[60px]'>
						<CardTitle
							title='Main Menu'
							handleMenuClick={() => setIsTopMenuOpen((prev) => !prev)}
							IconName={LuLayoutGrid}
						/>
						{isTopMenuOpen && (
							<div
								ref={topMenuRef}
								className='absolute z-50 mt-2 right-4'>
								<Menuitems
									items={[
										{
											label: 'Top Menu 1',
											onClick: () => setIsTopMenuOpen(false),
										},
										{
											label: 'Top Menu 2',
											onClick: () => setIsTopMenuOpen(false),
										},
									]}
								/>
							</div>
						)}
					</div>

					{/* Budget Summary */}
					<div className='md:ml-[210px] accountCards shadow-md md:px-[24px] px-[8px] gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto'>
						{selectedBucketId && <BudgetSummary bucketId={selectedBucketId} />}
					</div>

					{/* Card Menu */}
					<div className='md:ml-[210px] flex'>
						<div className='top flex items-start justify-around w-full'>
							<div className='px-[8px] mt-4 shadow-md pb-4 relative flex-1 w-full'>
								<CardTitle
									title='What Are We doing today?'
									handleMenuClick={() => setIsCardMenuOpen((prev) => !prev)}
									IconName={LuLayoutGrid}
								/>
								{isCardMenuOpen && (
									<div
										ref={cardMenuRef}
										className='absolute z-50 mt-2 right-4'>
										<Menuitems
											items={[
												{
													label: 'Quick Action 1',
													onClick: () => setIsCardMenuOpen(false),
												},
												{
													label: 'Quick Action 2',
													onClick: () => setIsCardMenuOpen(false),
												},
											]}
										/>
									</div>
								)}

								<div className='linkList mt-4 flex items-center md:justify-around justify-center md:gap-4 px-4 gap-2 w-full flex-wrap'>
									<NavBox
										IconName={AiOutlinePieChart}
										boxText='Personal Budgets'
										subtext='Track monthly budget'
										url='/budget'
									/>
									<NavBox
										IconName={FaBullseye}
										boxText='Personal Goals'
										subtext='Track financial goals'
										url='/mygoals'
									/>
									<NavBox
										IconName={BsBank}
										boxText='Loan Management'
										subtext='Track your Debts'
										url='#'
									/>
									<NavBox
										IconName={FaHandHoldingDollar}
										boxText='Thrift (Ajo) Contribution'
										subtext='Save with friends'
										url='#'
									/>
									<NavBox
										IconName={FaScaleBalanced}
										boxText='Finance Overview'
										subtext='Track your finance'
										url='#'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ThemeProvider>
	);
};

export default WithAuthentication(Page);
