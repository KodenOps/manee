'use client';
import React from 'react';
import NavBtn from './NavBtn';
import { LuLayoutGrid } from 'react-icons/lu';
import { FaMoneyBillTransfer } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { FiPhoneCall } from 'react-icons/fi';
import { RiWifiFill } from 'react-icons/ri';
import { TbMoneybag } from 'react-icons/tb';

const SideBtns = () => {
	return (
		<div>
			{/* FIRST LINK BOX */}
			<div className='topLinks mt-[32px]'>
				<NavBtn
					text='Dashboard'
					IconText={LuLayoutGrid}
					url='/'
				/>
				<h4 className='px-[24px] font-medium text-sm mt-4 mb-2 tracking-wider dark:text-[var(--whites-dark)]'>
					TRANSACT
				</h4>
				<NavBtn
					text='Transfers'
					IconText={FaMoneyBillTransfer}
					url='/interbank'
				/>
				<NavBtn
					text='Pay Bills'
					IconText={GiPayMoney}
					url='/pay-bills'
				/>
				<NavBtn
					text='Airtime Purchase'
					IconText={FiPhoneCall}
					url='/airtime'
				/>
				<NavBtn
					text='Data Purchase'
					IconText={RiWifiFill}
					url='/data'
				/>
				<NavBtn
					text='Quick Loans'
					IconText={TbMoneybag}
					url='/loans'
				/>
			</div>
			{/* SECOND LINK BOX */}
			<div className='topLinks mt-[32px]'>
				<h4 className='px-[24px] font-medium text-sm mt-4 mb-2 tracking-wider dark:text-[var(--whites-dark)]'>
					ACCOUNT
				</h4>
				<NavBtn
					text='Account Update'
					IconText={FaMoneyBillTransfer}
					url='/account-update'
				/>
				<NavBtn
					text='Complaints'
					IconText={GiPayMoney}
					url='/complaints'
				/>
				<NavBtn
					text='Requests'
					IconText={GiPayMoney}
					url='/requests'
				/>
			</div>
			<div className='user  flex flex-col justify-start px-4 items-start mt-8 gap-2 cursor-pointer'>
				<div className='userimg text-[var(--primary)] dark:text-[var(--secondary-dark)]'></div>
				<div className='nameemail'>
					<p className='font-medium text-[var(--primary)] dark:text-[var(--whites-dark)]'>
						Ayomide .F.
					</p>
					<p className='text-[12px] font-normal'>ayopumping@example.com</p>
				</div>
				<button>Logout</button>
			</div>
		</div>
	);
};

export default SideBtns;
