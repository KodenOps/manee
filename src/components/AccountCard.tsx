import React, { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa6';
import { IoEyeOff } from 'react-icons/io5';
import design from '../../public/assets/bg.png';
import Image from 'next/image';
import { IoEyeSharp } from 'react-icons/io5';

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
	const [balVisible, setbalVisible] = useState(false);
	return (
		<div className='  md:h-[200px] h-[150px] rounded-md relative overflow-hidden flex-1 w-full '>
			<div className='content  z-[100] flex flex-col md:gap-0 h-full justify-between md:pl-[24px] pl-0 px-[8px] py-[20px]'>
				<div className='top z-[20] md:px-0 px-4 '>
					<h4 className='md:text-[18px] text-[12px] font-semibold dark:text-[var(--accents)]'>
						{accountType}
					</h4>
					<p className='md:font-bold font-normal md:text-lg text-sm tracking-widest flex items-center gap-2 text-[var(--primary-dark)] dark:text-[var(--whites)]'>
						{accountNum}{' '}
						<span className='text-sm font-mono cursor-pointer'>
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
							{balVisible === true
								? `$${accountBal.toLocaleString()}`
								: 'xxx,xxx'}
						</p>
						{/* hide button */}
						<button
							className='flex justify-center items-end flex-col gap-[5px] w-full pr-4 cursor-pointer'
							onClick={() => setbalVisible(!balVisible)}>
							<span className='hidden text-sm md:flex items-center gap-2 justify-center'>
								{balVisible ? 'Hide' : 'Show'}{' '}
								{balVisible ? <IoEyeOff size={20} /> : <IoEyeSharp size={20} />}
							</span>
							<span className='md:hidden text-sm ml-2 flex justify-center'>
								<IoEyeOff size={16} />
							</span>
						</button>
						{/* End of hide toggle button */}
					</div>
				</div>
			</div>
			<div className='dark:bg-[#2a3f80f6] bg-[#aee9eb]  absolute h-[100%] z-[0] top-0	 overflow-hidden'>
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
