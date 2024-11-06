import React from 'react';
import InputField from './InputField';
import { MdSearch } from 'react-icons/md';
import { BsMoonStars } from 'react-icons/bs';
import { MdOutlineNotifications } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { LuSun } from 'react-icons/lu';

const HeaderNav = () => {
	const { theme, setTheme } = useTheme();
	return (
		<div className='flex justify-end w-full gap-16 px-[40px] py-[24px] shadow-md bg-[var(--whites)] dark:bg-[var(--primary-dark)]'>
			<div className='search flex items-center justify-center border-[var(--primary)] focus:outline-none dark:focus:border-[var(--inputborder)] dark:border-[var(--inputborder)] rounded-[5px] focus:border-[var(--primary)] border-2 gap-2 px-4 '>
				<p className='text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					<MdSearch size={24} />
				</p>
				<input
					type='text'
					placeholder='Search For Service/Ctrl K'
					className='w-full  border-none outline-none bg-transparent   pr-[16px] md:py-[8px] py-[16px] placeholder:text-[var(--greys)] dark:placeholder:text-[var(--disabled)]  '
				/>
			</div>
			<div className='notidark_btns flex items-center justify-center gap-8 text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
				<div className='modetoggle cursor-pointer'>
					{theme === 'light' ? (
						<BsMoonStars
							size={24}
							onClick={() => {
								setTheme('dark');
							}}
						/>
					) : (
						<LuSun
							size={24}
							color='#FF7657'
							onClick={() => {
								setTheme('light');
							}}
						/>
					)}
				</div>
				<div className='notification cursor-pointer'>
					<MdOutlineNotifications size={24} />
				</div>
			</div>
			<div className='user flex justify-start items-center gap-2 cursor-pointer'>
				<div className='userimg text-[var(--primary)] dark:text-[var(--secondary-dark)]'>
					<FaUserCircle size={32} />
				</div>
				<div className='nameemail '>
					<p className='font-medium text-[var(--primary)] dark:text-[var(--whites-dark)]'>
						Ayoola Coker
					</p>
					<p className='text-[12px] font-normal'>a.coker@gmail.com</p>
				</div>
			</div>
		</div>
	);
};

export default HeaderNav;
