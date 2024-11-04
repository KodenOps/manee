import React from 'react';
import { FaRegCopy } from 'react-icons/fa6';
import { IoEyeOff } from 'react-icons/io5';
import design from '../../public/assets/accdesign.png';
import Image from 'next/image';
const AccountCard = () => {
	return (
		<div className='relative  h-[200px] rounded-md overflow-hidden flex-1 w-full'>
			<div className='content  z-[100] flex flex-col h-full justify-between md:pl-[24px] pl-0 px-[8px] py-[20px]'>
				<div className='top z-[20] '>
					<h4 className='md:text-md text-sm font-mono'>Savings</h4>
					<p className='font-medium md:text-xl text-md tracking-widest flex items-center gap-2'>
						0012202049{' '}
						<span className='text-sm font-mono'>
							<FaRegCopy size={14} />
						</span>
					</p>
				</div>
				<div className='bottom flex flex-col justify-end items-end z-[20]  '>
					<div className='font-medium text-md  md:w-[80%]'>
						<p>Balance</p>
					</div>
					<div className='flex md:flex-row flex-col gap-2'>
						<p className='md:text-[30px] text-[60px] tracking-widest font-bold text-left'>
							$5,002,120.02
						</p>
						<p className='flex justify-center items-center md:flex-col gap-[5px]'>
							<span className='text-sm'>Hide</span>
							<IoEyeOff size={20} />
						</p>
					</div>
				</div>
			</div>
			<div className='dark:bg-[#2a3f80f6] bg-[#aee9eb]  absolute h-full w-full top-0 z-[0] overflow-hidden'>
				<div className='absolute bottom-0 md:w-[30vw]    right-0'>
					<Image
						src={design}
						alt='flow'
						height={600}
					/>
				</div>
			</div>
		</div>
	);
};

export default AccountCard;
