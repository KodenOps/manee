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
import React, { useEffect, useState } from 'react';
import { beneficiaries } from '@/data/beneficiary';
import { FaUserCircle } from 'react-icons/fa';
import WithAuthentication from '@/components/WithAuthentication';
import supabase from '@/helper/supabaseClient';
import { HiH2 } from 'react-icons/hi2';
import BeneficiaryModal from '@/components/BeneficiaryModal';
import AddNewBene from '@/components/AddNewBene';

// Define the type for userBankInfo
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
	const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
	const [user, setUser] = useState<any>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Use the defined type for userBankInfo
	const [userBankInfo, setuserBankInfo] = useState<UserBankInfo>({
		id: '',
		shortName: '',
		fullName: '',
		bankName: '',
		accountNumber: '',
	});
	function toggleSwitcher(isinter: boolean) {
		setisinter(!isinter);
	}

	useEffect(() => {
		const fetchProfileAndBeneficiaries = async () => {
			try {
				const userResponse = await supabase.auth.getUser();
				const user = userResponse.data.user;
				setUser(user);
				if (user) {
					// Fetch profile
					const { data: profile, error: profileError } = await supabase
						.from('profiles')
						.select('first_name, last_name, account_number, balance')
						.eq('id', user.id)
						.single();

					if (profileError) {
						console.error('Error fetching profile:', profileError);
					} else if (profile) {
						setUserProfile({
							...profile,
							email: user.email || '',
						});
					} else {
						console.warn('No profile found for user ID:', user.id);
					}

					// Fetch beneficiaries
					const { data: beneficiaries, error: beneficiariesError } =
						await supabase
							.from('beneficiaries')
							.select('*')
							.eq('profile_id', user.id);

					if (beneficiariesError) {
						console.error('Error fetching beneficiaries:', beneficiariesError);
					} else {
						setUserBeneficiaries(beneficiaries); // You should have a state like const [userBeneficiaries, setUserBeneficiaries] = useState([]);
					}
				}
			} catch (error) {
				console.error('Unexpected error fetching data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProfileAndBeneficiaries();

		console.log(beneficiaries);
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
			<div className=' flex bg-[var(--whites)] min-h-screen dark:bg-[var(--primary-dark)] pb-[100px]'>
				<SideNav />
				<div className='w-full '>
					<HeaderNav userprofile={userProfile} />
					<div className='accountCards shadow-md md:ml-[210px] md:px-[24px] px-[8px] ml-0  gap-2 py-[16px] flex items-center md:justify-start justify-between'>
						<AccountCard
							accountBal={userProfile?.balance || 50000}
							accountNum={userProfile?.account_number || '0000000000'}
							accountType='Savings'
							accountName={
								userProfile?.first_name + ' ' + userProfile?.last_name
							}
						/>
					</div>
					<div className='flex w-full items-start justify-start mt-4 py-8'>
						<div className='mainTransSection px-[8px] md:ml-[210px] md:pr-[16px]  flex-1 ml-0 md:w-[45%] w-full shadow-md pb-8'>
							{/* <HeaderSwitcher
							buttonText1='Interbank Transfer'
							buttonText2='Intrabank Transfer'
							isFirst={isinter}
							actions={toggleSwitcher}
						/> */}

							{/* header switcher */}
							<div>
								{isinter ? (
									<div className='w-full shadow-md flex items-center justify-center md:h-[60px] h-[60px] rounded-sm'>
										<button
											className='leftMenu text-center bg-[var(--primary)] dark:bg-[var(--secondary-dark)] text-[var(--whites)] dark:text-[var(--primary-dark)] font-medium flex-1 h-full flex items-center md:text-lg text-[12px] justify-center'
											onClick={() => setisinter(true)}>
											Interbank Transfer
										</button>
										<button
											className='rightMenu text-center bg-[var(--whites)] font-medium text-[var(--text)] dark:bg-[var(--card-bg-dark)] dark:text-[var(--whites-dark)] flex-1 h-full flex items-center justify-center md:text-lg text-[12px] '
											onClick={() => {
												setisinter(false);
											}}>
											Intrabank Transfer
										</button>
									</div>
								) : (
									<>
										<div className='w-full shadow-md flex items-center justify-center md:h-[60px] h-[60px]'>
											<button
												className='leftMenu text-center bg-[var(--whites)] font-medium text-[var(--text)] dark:bg-[var(--card-bg-dark)] dark:text-[var(--whites-dark)] flex-1 h-full flex items-center justify-center md:text-lg text-[12px] '
												onClick={() => {
													setisinter(true);
												}}>
												Interbank Transfer
											</button>
											<button
												className='rightMenu text-center bg-[var(--primary)] dark:bg-[var(--secondary-dark)] text-[var(--whites)] dark:text-[var(--primary-dark)] font-medium flex-1 h-full flex items-center md:text-lg text-[12px]  justify-center'
												onClick={() => setisinter(false)}>
												Intrabank Transfer
											</button>
										</div>
									</>
								)}
							</div>
							<div className='mt-2'>
								<CardTitle title='Beneficiaries' />
								<div className='beneficiary flex  items-center justify-start w-full overflow-x-scroll gap-6 py-4 scrollbar-hidden'>
									{userBeneficiaries.length > 0 ? (
										userBeneficiaries.map((beneficiary) => {
											return (
												<div
													key={beneficiary.id}
													className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--primary)] bg-[var(--primary)]   min-w-[140px] h-[80px] px-[16px] py-[12px] gap-2 cursor-pointer '
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
														console.log(beneficiary);
													}}>
													<span className='text-[white] dark:text-[var(--primary-dark)]'>
														<FaUserCircle size={32} />
													</span>
													<p className='font-medium md:text-md text-sm dark:text-[var(--whites-dark)] text-[white]  text-center w-full'>
														{beneficiary.first_name +
															' .' +
															beneficiary.last_name[0]}
													</p>
												</div>
											);
										})
									) : (
										<AddNewBene openAddBeneModal={() => setIsModalOpen(true)} />
									)}
									{userBeneficiaries.length > 0 ? (
										<AddNewBene openAddBeneModal={() => setIsModalOpen(true)} />
									) : (
										''
									)}
								</div>
							</div>

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
						{/* History section */}
						<div className='pb-8 shadow-md w-1/2 pr-[16px] md:block hidden'>
							<History />
						</div>
					</div>
				</div>
				{/* end of body */}
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

						if (error) {
							console.error('Failed to refetch beneficiaries:', error);
						} else {
							setUserBeneficiaries(beneData || []);
						}
					}}
				/>
			</div>
		</ThemeProvider>
	);
};

export default WithAuthentication(page);
