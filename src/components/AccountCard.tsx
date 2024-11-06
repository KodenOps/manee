import React from 'react';
import { FaRegCopy } from 'react-icons/fa6';
import { IoEyeOff } from 'react-icons/io5';
import design from '../../public/assets/bg.png';
import Image from 'next/image';

interface accountInfoType {
	accountType: string;
	accountNum: string;
	accountBal: number;
}

const AccountCard = ({
	accountBal,
	accountNum,
	accountType,
}: accountInfoType) => {
	return (
		<div className='  md:h-[200px] h-[150px] rounded-md relative overflow-hidden flex-1 md:w-full w-[80%]'>
			<div className='content  z-[100] flex flex-col md:gap-0 gap-3 h-full justify-between md:pl-[24px] pl-0 px-[8px] py-[20px]'>
				<div className='top z-[20] md:px-0 px-4 '>
					<h4 className='md:text-[18px] text-[12px] font-semibold dark:text-[var(--accents)]'>
						{accountType}
					</h4>
					<p className='md:font-bold font-normal md:text-lg text-sm tracking-widest flex items-center gap-2 text-[var(--primary-dark)] dark:text-[var(--whites)]'>
						{accountNum}{' '}
						<span className='text-sm font-mono'>
							<FaRegCopy size={14} />
						</span>
					</p>
				</div>
				<div className='bottom flex flex-col justify-start items-start z-[20] md:pl-0 pl-4 '>
					<p className='dark:text-[var(--accents)] md:text-[18px] text-[12px] '>
						Balance
					</p>

					<div className='flex flex-row md:w-full w-full'>
						<p className='md:text-[30px] text-[18px] tracking-widest font-bold text-left text-[var(--primary-dark)] dark:text-[var(--whites)] '>
							${accountBal.toLocaleString()}
						</p>
						<div className='flex justify-center items-end flex-col gap-[5px] w-full pr-4 cursor-pointer'>
							<span className='hidden text-sm md:flex justify-center'>
								Hide <IoEyeOff size={20} />
							</span>
							<span className='md:hidden text-sm ml-2 flex justify-center'>
								<IoEyeOff size={16} />
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className='dark:bg-[#2a3f80f6] bg-[#aee9eb]  absolute h-[100vh] z-[0] top-0	 overflow-hidden'>
				<div className='top-0  h-full w-full object-cover bottom-0 scale-150 float-start  opacity-20 '>
					<Image
						src={design}
						alt='flow'
						height={1000}
						width={1000}
					/>
				</div>
			</div>
		</div>
	);
};

export default AccountCard;
