'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { LuLayoutGrid } from 'react-icons/lu';

import HeaderNav from '@/components/HeaderNav';
import SideNav from '@/components/SideNav';
import AccountCard from '@/components/AccountCard';
import Menuitems from '@/components/Menuitem';
import CardTitle from '@/components/CardTitle';
import BudgetSummary from '@/components/BudgetSummary';
import SetBudgetModal from '@/components/SetBudgetModal';
import { useUser } from '@/components/UserContext';
import BudgetGauge from '@/components/BudgetGuage';
import CardTitleWithAction from '@/components/CardTitleWithAction';

const Page = () => {
	const { userProfile, loading } = useUser();

	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	// Refs for detecting clicks outside each menu
	const quickMenuRef = useRef<HTMLDivElement | null>(null);
	const budgetMenuRef = useRef<HTMLDivElement | null>(null);

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

				{/* Summary Cards */}
				<div className='accountCards shadow-md md:px-[24px] px-[8px] gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto'>
					<BudgetSummary />
				</div>

				{/* Budgets Header and Menu */}
				<div className='flex mt-6 px-4'>
					<div className='top flex items-start justify-between w-full relative'>
						<CardTitleWithAction
							title='My Budgets'
							IconName={LuLayoutGrid}
							onActionClick={() => setShowModal(true)}
						/>

						{openMenu === 'budget' && (
							<div
								ref={budgetMenuRef}
								className='absolute right-0 top-12 z-50'>
								<Menuitems
									items={[
										{
											label: 'Set New Budget',
											onClick: () => {
												setOpenMenu(null);
												setShowModal(true);
											},
										},
										{
											label: 'Another Action',
											onClick: () => setOpenMenu(null),
										},
									]}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Budget List */}
				<div className='maincharts px-4 md:px-8 flex flex-wrap w-full justify-start mt-4'>
					<BudgetGauge />
				</div>

				{/* Modal */}
				{showModal && (
					<SetBudgetModal
						onClose={() => setShowModal(false)}
						onBudgetSaved={() => {
							setShowModal(false);
							setRefreshKey((prev) => prev + 1); // re-render list
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Page;
