'use client';
import AccountCard from '@/components/AccountCard';
import BeneCard from '@/components/BeneficiaryBox';
import CardTitle from '@/components/CardTitle';
import HeaderNav from '@/components/HeaderNav';
import History from '@/components/History';
import InterbankForm from '@/components/InterbankForm';
import IntrabankForm from '@/components/Intrabankforms';
import SideNav from '@/components/SideNav';
import { ThemeProvider } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import WithAuthentication from '@/components/WithAuthentication';
import supabase from '@/helper/supabaseClient';
import BeneficiaryModal from '@/components/BeneficiaryModal';
import AddNewBene from '@/components/AddNewBene';
import ManageBeneficiariesModal from '@/components/ManageBeneficiariesModal';

interface UserBankInfo {
	id: string;
	shortName: string;
	fullName: string;
	bankName: string;
	accountNumber: string;
}

type UserProfile = {
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
};

interface Beneficiary {
	id: number;
	profile_id: string;
	first_name: string;
	last_name: string;
	account_number: string;
	bank_name: string;
	bank_short_name: string;
	created_at: string;
	updated_at: string;
}

const page = () => {
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [isinter, setisinter] = useState(true);
	const [loading, setLoading] = useState(true);
	const [userBeneficiaries, setUserBeneficiaries] = useState<Beneficiary[]>([]);
	const [user, setUser] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isManageOpen, setIsManageOpen] = useState(false);

	const [userBankInfo, setuserBankInfo] = useState<UserBankInfo>({
		id: '',
		shortName: '',
		fullName: '',
		bankName: '',
		accountNumber: '',
	});

	// Dropdown logic
	const [menuOpen, setMenuOpen] = useState(false);
	const kebabRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

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
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const fetchProfileAndBeneficiaries = async () => {
			try {
				const userResponse = await supabase.auth.getUser();
				const user = userResponse.data.user;
				setUser(user);

				if (user) {
					const { data: profile, error: profileError } = await supabase
						.from('profiles')
						.select('first_name, last_name, account_number, balance')
						.eq('id', user.id)
						.single();

					if (!profileError && profile) {
						setUserProfile({
							...profile,
							email: user.email || '',
						});
					}

					const { data: beneficiaries, error: beneficiariesError } =
						await supabase
							.from('beneficiaries')
							.select('*')
							.eq('profile_id', user.id);

					if (!beneficiariesError && beneficiaries) {
						setUserBeneficiaries(beneficiaries);
					}
				}
			} catch (error) {
				console.error('Unexpected error:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfileAndBeneficiaries();
	}, []);

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

					<div className='flex w-full items-start justify-start mt-4 py-8'>
						<div className='mainTransSection px-[8px] md:ml-[210px] md:pr-[16px] flex-1 ml-0 md:w-[45%] w-full shadow-md pb-8 relative'>
							{/* Card Title with Dropdown Trigger */}
							<CardTitle
								title='Beneficiaries'
								handleMenuClick={() => setMenuOpen((prev) => !prev)}
								menuRef={kebabRef}
							/>

							{/* Dropdown modal below kebab */}
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

							{/* Beneficiaries Section */}
							<div className='beneficiary flex items-center justify-start w-full overflow-x-scroll gap-6 py-4 scrollbar-hidden'>
								{userBeneficiaries.length > 0 ? (
									userBeneficiaries.map((beneficiary) => (
										<div
											key={beneficiary.id}
											className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--primary)] bg-[var(--primary)] min-w-[140px] h-[80px] px-[16px] py-[12px] gap-2 cursor-pointer'
											onClick={() => {
												setuserBankInfo({
													id: beneficiary.id.toString(),
													shortName:
														beneficiary.first_name +
														'.' +
														beneficiary.last_name[0],
													fullName:
														beneficiary.first_name +
														' ' +
														beneficiary.last_name,
													bankName: beneficiary.bank_name,
													accountNumber: beneficiary.account_number,
												});
											}}>
											<span className='text-white dark:text-[var(--primary-dark)]'>
												<FaUserCircle size={32} />
											</span>
											<p className='font-medium md:text-md text-sm dark:text-[var(--whites-dark)] text-white text-center w-full'>
												{beneficiary.first_name +
													' .' +
													beneficiary.last_name[0]}
											</p>
										</div>
									))
								) : (
									<AddNewBene openAddBeneModal={() => setIsModalOpen(true)} />
								)}
								{userBeneficiaries.length > 0 && (
									<AddNewBene openAddBeneModal={() => setIsModalOpen(true)} />
								)}
							</div>

							{/* Transfer Forms */}
							{isinter ? (
								<InterbankForm
									id={userBankInfo.id}
									accountNumber={userBankInfo.accountNumber}
									shortName={userBankInfo.shortName}
									fullName={userBankInfo.fullName}
									bankName={userBankInfo.bankName}
								/>
							) : (
								<IntrabankForm />
							)}
						</div>

						{/* Transaction History */}
						<div className='pb-8 shadow-md w-1/2 pr-[16px] md:block hidden'>
							<History />
						</div>
					</div>
				</div>

				{/* Add Beneficiary Modal */}
				<BeneficiaryModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					profileId={user?.id}
					onSuccess={async () => {
						if (!user?.id) return;
						const { data: beneData, error } = await supabase
							.from('beneficiaries')
							.select('*')
							.eq('profile_id', user.id);
						if (!error) {
							setUserBeneficiaries(beneData || []);
						}
					}}
				/>
			</div>
			<ManageBeneficiariesModal
				isOpen={isManageOpen}
				onClose={() => setIsManageOpen(false)}
				profileId={user?.id}
				onUpdate={async () => {
					const { data, error } = await supabase
						.from('beneficiaries')
						.select('*')
						.eq('profile_id', user.id);

					if (!error) {
						setUserBeneficiaries(data || []);
					}
				}}
			/>
		</ThemeProvider>
	);
};

export default WithAuthentication(page);
