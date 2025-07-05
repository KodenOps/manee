'use client';
import React, { useEffect, useRef, useState } from 'react';
import HeaderNav from '@/components/HeaderNav';
import supabase from '@/helper/supabaseClient';
import { ThemeProvider } from 'next-themes';
import SideNav from '@/components/SideNav';
import AccountCard from '@/components/AccountCard';
import { LuLayoutGrid } from 'react-icons/lu';
import Menuitems from '@/components/Menuitem';
import CardTitle from '@/components/CardTitle';
import { useUser } from '@/components/UserContext';
import ProgessCard from '@/components/ProgessCard';
import { useGoals } from '@/components/GoalsContext';
import type { Goal } from '@/components/GoalsContext';
import WithAuthentication from '@/components/WithAuthentication';
import CardTitleWithAction from '@/components/CardTitleWithAction';

const Page = () => {
	const { userProfile, loading } = useUser();
	const [openMenu, setOpenMenu] = useState<string | null>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const { goals, refetchGoals } = useGoals();
	const [showModal, setShowModal] = useState(false);
	const [goalName, setGoalName] = useState('');
	const [currentAmount, setCurrentAmount] = useState('');
	const [targetAmount, setTargetAmount] = useState('');
	const [deadline, setDeadline] = useState('');
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

	// controlled edit form values
	const [editName, setEditName] = useState('');
	const [editTarget, setEditTarget] = useState('');
	const [editCurrent, setEditCurrent] = useState('');
	const [editDeadline, setEditDeadline] = useState('');

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

	const handleCreateGoal = async () => {
		if (
			!goalName ||
			!currentAmount ||
			!targetAmount ||
			!deadline ||
			!userProfile?.id
		)
			return;

		const { error } = await supabase.from('goals').insert([
			{
				name: goalName,
				target_amount: Number(targetAmount),
				current_amount: Number(currentAmount), // ✅ use input value
				deadline,
				user_id: userProfile.id,
			},
		]);

		if (!error) {
			setShowModal(false);
			setGoalName('');
			setCurrentAmount(''); // ✅ clear current amount
			setTargetAmount('');
			setDeadline('');
			refetchGoals(); // refresh the list
		} else {
			alert('Error creating goal');
			console.error(error.message);
		}
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
				<div className='accountCards shadow-md md:px-[24px] px-[8px] ml-0 gap-2 py-[16px] flex items-center md:justify-start justify-between overflow-x-auto md:mt-0 mt-[80px]'>
					<AccountCard
						accountBal={userProfile.balance}
						accountNum={userProfile.account_number}
						accountType='Income'
						accountName={`${userProfile.first_name} ${userProfile.last_name}`}
					/>
					<AccountCard
						accountBal={userProfile.balance}
						accountNum={userProfile.account_number}
						accountType='Income'
						accountName={`${userProfile.first_name} ${userProfile.last_name}`}
					/>
				</div>

				<div className='flex mt-4 justify-start '>
					<div className='top flex items-start justify-around w-full relative'>
						<CardTitleWithAction
							title='My Goals'
							texts='Create New Goal'
							IconName={LuLayoutGrid}
							onActionClick={() => setShowModal(true)}
						/>

						{openMenu === 'quick' && (
							<div ref={menuRef}>
								<Menuitems
									items={[
										{
											label: 'Create Goal',
											onClick: () => {
												setOpenMenu(null);
												setShowModal(true);
											},
										},
										{ label: 'Menu 2', onClick: () => setOpenMenu(null) },
									]}
								/>
							</div>
						)}
					</div>
				</div>

				{/* GOALS GRID */}
				<div className='maincharts px-8 flex flex-wrap items-start justify-start  w-full mt-4 gap-4'>
					{goals.length === 0 ? (
						<div className='w-full text-center text-gray-500 dark:text-gray-400 py-16'>
							<p className='text-lg font-semibold'>No goals yet</p>
							<p className='text-sm mt-2'>
								Start by creating your first savings goal.
							</p>
							<button
								onClick={() => setShowModal(true)}
								className='mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'>
								Create Goal
							</button>
						</div>
					) : (
						goals.map((goal) => (
							<ProgessCard
								key={goal.id}
								current={goal.current_amount}
								target={goal.target_amount}
								currency='NGN'
								goalname={goal.name}
								deadline={goal.deadline}
								created_at={goal.created_at}
								onClick={() => {
									setSelectedGoal(goal);
									setEditName(goal.name);
									setEditTarget(goal.target_amount.toString());
									setEditCurrent(goal.current_amount.toString());
									setEditDeadline(goal.deadline);
									setShowEditModal(true);
								}}
							/>
						))
					)}
				</div>

				{goals.length > 0 && (
					<div className='mt-6 text-sm text-gray-600 dark:text-gray-400 flex justify-center items-center md:gap-10 gap-4 px-4 flex-wrap'>
						<p>
							<span
								className='inline-block w-3 h-3 rounded-full mr-2'
								style={{ backgroundColor: '#B91C1C' }}></span>{' '}
							Danger (Falling behind)
						</p>
						<p>
							<span
								className='inline-block w-3 h-3 rounded-full mr-2'
								style={{ backgroundColor: '#C2410C' }}></span>{' '}
							Behind
						</p>
						<p>
							<span
								className='inline-block w-3 h-3 rounded-full mr-2'
								style={{ backgroundColor: '#CA8A04' }}></span>{' '}
							Slightly behind
						</p>
						<p>
							<span
								className='inline-block w-3 h-3 rounded-full mr-2'
								style={{ backgroundColor: '#15803D' }}></span>{' '}
							On track
						</p>
					</div>
				)}

				{/* GOAL CREATE MODAL */}
				{showModal && (
					<div className='fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center'>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-md p-6'>
							<h2 className='text-lg font-semibold text-center mb-4'>
								Create New Goal
							</h2>

							<label className='block mb-3'>
								<span className='text-sm font-medium'>Goal Name</span>
								<input
									type='text'
									value={goalName}
									onChange={(e) => setGoalName(e.target.value)}
									placeholder='e.g. Build Emergency Fund'
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							<label className='block mb-3'>
								<span className='text-sm font-medium'>Current Amount</span>
								<input
									type='number'
									value={currentAmount}
									onChange={(e) => setCurrentAmount(e.target.value)}
									placeholder='e.g. 10000'
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							<label className='block mb-3'>
								<span className='text-sm font-medium'>Target Amount</span>
								<input
									type='number'
									value={targetAmount}
									onChange={(e) => setTargetAmount(e.target.value)}
									placeholder='e.g. 50000'
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							<label className='block mb-5'>
								<span className='text-sm font-medium'>Deadline</span>
								<input
									type='date'
									value={deadline}
									onChange={(e) => setDeadline(e.target.value)}
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							<div className='flex justify-end gap-2'>
								<button
									onClick={() => setShowModal(false)}
									className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white'>
									Cancel
								</button>
								<button
									onClick={handleCreateGoal}
									className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'>
									Create
								</button>
							</div>
						</div>
					</div>
				)}
				{showEditModal && selectedGoal && (
					<div className='fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center'>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-lg w-[90%] max-w-md p-6'>
							<h2 className='text-lg font-semibold text-center mb-4'>
								Edit Goal
							</h2>

							{/* Goal Name */}
							<label className='block mb-3'>
								<span className='text-sm font-medium'>Goal Name</span>
								<input
									type='text'
									value={editName}
									onChange={(e) => setEditName(e.target.value)}
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							{/* Current Amount */}
							<label className='block mb-3'>
								<span className='text-sm font-medium'>Current Amount</span>
								<input
									type='number'
									value={editCurrent}
									onChange={(e) => setEditCurrent(e.target.value)}
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							{/* Target Amount */}
							<label className='block mb-3'>
								<span className='text-sm font-medium'>Target Amount</span>
								<input
									type='number'
									value={editTarget}
									onChange={(e) => setEditTarget(e.target.value)}
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							{/* Deadline */}
							<label className='block mb-5'>
								<span className='text-sm font-medium'>Deadline</span>
								<input
									type='date'
									value={editDeadline}
									onChange={(e) => setEditDeadline(e.target.value)}
									className='mt-1 w-full rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white'
								/>
							</label>

							{/* Action Buttons */}
							<div className='flex justify-between items-center flex-wrap gap-3'>
								<button
									onClick={() => setShowEditModal(false)}
									className='px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white'>
									Cancel
								</button>

								<button
									onClick={async () => {
										if (!selectedGoal) return;
										const { error } = await supabase
											.from('goals')
											.update({
												name: editName,
												target_amount: Number(editTarget),
												current_amount: Number(editCurrent),
												deadline: editDeadline,
											})
											.eq('id', selectedGoal.id);

										if (!error) {
											setShowEditModal(false);
											setSelectedGoal(null);
											refetchGoals();
										} else {
											console.error('Error updating goal:', error.message);
										}
									}}
									className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'>
									Save
								</button>

								<button
									onClick={async () => {
										if (!selectedGoal) return;
										const confirmDelete = confirm(
											'Are you sure you want to delete this goal?'
										);
										if (!confirmDelete) return;

										const { error } = await supabase
											.from('goals')
											.delete()
											.eq('id', selectedGoal.id);

										if (!error) {
											setShowEditModal(false);
											setSelectedGoal(null);
											refetchGoals();
										} else {
											console.error('Error deleting goal:', error.message);
										}
									}}
									className='px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700'>
									Delete
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default WithAuthentication(Page);
