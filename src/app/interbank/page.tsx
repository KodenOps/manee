'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { FaUserCircle } from 'react-icons/fa';
import WithAuthentication from '@/components/WithAuthentication';
import supabase from '@/helper/supabaseClient';
import SideNav from '@/components/SideNav';
import HeaderNav from '@/components/HeaderNav';
import AccountCard from '@/components/AccountCard';
import CardTitle from '@/components/CardTitle';
import AddNewBene from '@/components/AddNewBene';
import History from '@/components/History';
import InterbankForm from '@/components/InterbankForm';
import IntrabankForm from '@/components/Intrabankforms';
import BeneficiaryModal from '@/components/BeneficiaryModal';
import ManageBeneficiariesModal from '@/components/ManageBeneficiariesModal';

interface UserProfile {
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
}

interface Beneficiary {
	id: number;
	profile_id: string;
	first_name: string;
	last_name: string;
	account_number: string;
	created_at: string;
	updated_at: string;
}

interface UserBankInfo {
	id: string;
	shortName: string;
	fullName: string;
	accountNumber: string;
}

const Page: React.FC = () => {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [menuOpen, setMenuOpen] = useState(false);
	const [isInter, setIsInter] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isManageOpen, setIsManageOpen] = useState(false);
	const [userBeneficiaries, setUserBeneficiaries] = useState<Beneficiary[]>([]);
	const [userBankInfo, setUserBankInfo] = useState<UserBankInfo>({
		id: '',
		shortName: '',
		fullName: '',
		accountNumber: '',
	});

	const kebabRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const fetchUserProfile = async () => {
		const { data, error } = await supabase
			.from('profiles')
			.select('first_name, last_name, account_number, balance')
			.eq('id', user.id)
			.single();

		if (data) {
			setUserProfile({ ...data, email: user.email || '' });
		}
	};
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!kebabRef.current?.contains(event.target as Node)
			) {
				setMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { data: userData } = await supabase.auth.getUser();
				const user = userData?.user;
				setUser(user);

				if (user) {
					const [{ data: profile }, { data: beneficiaries }] =
						await Promise.all([
							supabase
								.from('profiles')
								.select('first_name, last_name, account_number, balance')
								.eq('id', user.id)
								.single(),
							supabase
								.from('beneficiaries')
								.select('*')
								.eq('profile_id', user.id),
						]);

					if (profile) setUserProfile({ ...profile, email: user.email || '' });
					if (beneficiaries) setUserBeneficiaries(beneficiaries);
				}
			} catch (error) {
				console.error('Unexpected error:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const handleBeneficiaryClick = (b: Beneficiary) => {
		setUserBankInfo({
			id: String(b.id),
			shortName: `${b.first_name}.${b.last_name[0]}`,
			fullName: `${b.first_name} ${b.last_name}`,
			accountNumber: b.account_number,
		});
	};

	const refreshBeneficiaries = async () => {
		const { data } = await supabase
			.from('beneficiaries')
			.select('*')
			.eq('profile_id', user.id);
		if (data) setUserBeneficiaries(data);
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
		<ThemeProvider
			attribute='class'
			defaultTheme='system'>
			<div className='flex bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px] relative'>
				<SideNav />
				<div className='w-full'>
					<HeaderNav userprofile={userProfile} />

					<div className='accountCards shadow-md md:ml-[210px] md:px-[24px] px-[8px] ml-0 gap-2 py-[16px] flex items-center md:justify-start justify-between'>
						<AccountCard
							accountBal={userProfile.balance}
							accountNum={userProfile.account_number}
							accountType='Savings'
							accountName={`${userProfile.first_name} ${userProfile.last_name}`}
						/>
					</div>

					<div className='flex w-full items-start justify-center py-6'>
						<div className='mainTransSection px-[8px] md:ml-[210px] md:pr-[16px] flex-1 ml-0 md:w-[45%] w-full shadow-md pb-8 relative'>
							<CardTitle
								title='Beneficiaries'
								handleMenuClick={() => setMenuOpen(!menuOpen)}
								menuRef={kebabRef}
							/>

							{menuOpen && (
								<div
									ref={dropdownRef}
									className='absolute right-6 mt-2 z-50 w-[200px] rounded-lg shadow-md bg-white dark:bg-[var(--card-bg-dark)] border border-gray-200 dark:border-gray-600'>
									<ul className='py-2 text-sm text-gray-700 dark:text-gray-200'>
										<li>
											<button
												onClick={() => {
													setIsModalOpen(true);
													setMenuOpen(false);
												}}
												className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
												Add New Beneficiary
											</button>
										</li>
										<li>
											<button
												onClick={() => {
													setIsManageOpen(true);
													setMenuOpen(false);
												}}
												className='block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600'>
												Manage Beneficiaries
											</button>
										</li>
									</ul>
								</div>
							)}

							<div className='beneficiary flex items-center justify-start w-full overflow-x-scroll gap-6 py-4 scrollbar-hidden px-6'>
								{userBeneficiaries.map((b) => (
									<div
										key={b.id}
										className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--primary)] bg-[var(--primary)] min-w-[140px] h-[80px] px-[16px] py-[12px] gap-2 cursor-pointer'
										onClick={() => handleBeneficiaryClick(b)}>
										<span className='text-white dark:text-[var(--primary-dark)]'>
											<FaUserCircle size={32} />
										</span>
										<p className='font-medium md:text-md text-sm dark:text-[var(--whites-dark)] text-white text-center w-full'>
											{`${b.first_name} .${b.last_name[0]}`}
										</p>
									</div>
								))}
								<AddNewBene openAddBeneModal={() => setIsModalOpen(true)} />
							</div>

							<div className='w-full px-6'>
								{isInter ? (
									<InterbankForm
										key={userBankInfo.accountNumber}
										id={user.id}
										fullName={userBankInfo.fullName}
										accountNumber={userBankInfo.accountNumber}
										onSuccess={() => {
											fetchUserProfile();
											setUserBankInfo({
												id: '',
												fullName: '',
												shortName: '',
												accountNumber: '',
											});
										}}
									/>
								) : (
									<IntrabankForm />
								)}
							</div>
						</div>

						<div className='pb-8 shadow-md w-1/2 pr-[16px] md:block hidden'>
							<History userId={user?.id} />
						</div>
					</div>
				</div>

				<BeneficiaryModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					profileId={user?.id}
					onSuccess={refreshBeneficiaries}
				/>

				<ManageBeneficiariesModal
					isOpen={isManageOpen}
					onClose={() => setIsManageOpen(false)}
					profileId={user?.id}
					onUpdate={refreshBeneficiaries}
				/>
			</div>
		</ThemeProvider>
	);
};

export default WithAuthentication(Page);
