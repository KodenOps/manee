import React, { useState, useEffect } from 'react';
import { MdSearch } from 'react-icons/md';
import { BsMoonStars } from 'react-icons/bs';
import { MdOutlineNotifications } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { LuSun } from 'react-icons/lu';
import { IoMenu, IoCloseSharp } from 'react-icons/io5';
import Logo from './Logo';
import { GiTakeMyMoney } from 'react-icons/gi';
import SideBtns from './SideBtns';

type UserProfile = {
	first_name: string;
	last_name: string;
	account_number: string;
	balance: number;
	email: string;
};

interface HeaderNavProps {
	userprofile: UserProfile;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ userprofile }) => {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [menuUp, setmenuUp] = useState(true);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className='flex flex-col justify-center items-center h-full w-full bg-[var(--whites)] dark:bg-[var(--primary-dark)] fixed top-0 z-[500] overflow-hidden'>
				<div className='flex flex-col items-center justify-center text-center'>
					<div className='text-[var(--primary)] dark:text-[var(--secondary-dark)] flex items-center  px-[24px] gap-[5px]'>
						<span className='text-[24px] md:text-[80px]'>
							<GiTakeMyMoney />
						</span>
						<h2 className='font-bold text-[24px] md:text-[80px]'>MANEE</h2>
					</div>
					<p className='text-[16px] md:text-[30px]'>
						Swift like a bullet, Reliable like an Instinct.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className='flex md:justify-end justify-between w-full gap-16 md:px-[40px] pr-[16px] py-[24px] shadow-md bg-[var(--whites)] dark:bg-[var(--primary-dark)] sticky top-0 z-[50]'>
			<div className='search md:flex items-center justify-center border-[var(--primary)] dark:border-[var(--inputborder)] rounded-[5px] border-2 gap-2 px-4 hidden '>
				<p className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					<MdSearch size={24} />
				</p>
				<input
					type='text'
					placeholder='Search For Service/Ctrl K'
					className='w-full border-none outline-none bg-transparent pr-[16px] md:py-[8px] py-[16px] placeholder:text-[var(--greys)] dark:placeholder:text-[var(--disabled)]'
				/>
			</div>

			<div className='notidark_btns md:flex hidden items-center justify-center gap-8 text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
				<div className='modetoggle cursor-pointer'>
					{theme === 'light' ? (
						<BsMoonStars
							size={24}
							onClick={() => setTheme('dark')}
						/>
					) : (
						<LuSun
							size={24}
							color='#FF7657'
							onClick={() => setTheme('light')}
						/>
					)}
				</div>
				<div className='notification cursor-pointer'>
					<MdOutlineNotifications size={24} />
				</div>
			</div>

			<div className='user md:flex hidden justify-start items-center gap-2 cursor-pointer'>
				<div className='userimg text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					<FaUserCircle size={32} />
				</div>
				<div className='nameemail'>
					<p className='font-medium text-[var(--primary)] dark:text-[var(--whites-dark)]'>
						{userprofile.first_name} {userprofile.last_name}
					</p>
					<p className='text-[12px] font-normal'>{userprofile.email}</p>
				</div>
			</div>

			{/* mobile navbar */}
			<div className='logo md:hidden'>
				<Logo />
			</div>
			<div
				className='md:hidden text-[var(--primary)] dark:text-[var(--secondary-dark)] z-20'
				onClick={() => setmenuUp(!menuUp)}>
				{menuUp ? (
					<IoMenu size={32} />
				) : (
					<IoCloseSharp
						size={32}
						color='#ff7657'
					/>
				)}
			</div>

			{/* mobile side nav popup */}
			<div
				className={
					!menuUp
						? 'w-screen bg-[#333333c3] h-screen top-0 right-0 -z-[100] absolute'
						: 'hidden'
				}>
				<div
					className={
						!menuUp
							? 'w-[60%] h-screen top-0 right-0 absolute bg-[var(--primary-dark)] pt-[80px]'
							: 'hidden'
					}>
					<SideBtns />
				</div>
			</div>
		</div>
	);
};

export default HeaderNav;
