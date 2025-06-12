import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const AddNewBene = ({ openAddBeneModal }: any) => {
	return (
		<div
			className='flex flex-col items-center shadow-sm rounded-[10px] dark:bg-[var(--greys)] bg-[var(--greys)]   min-w-[140px] h-[80px] px-[16px] py-[12px] gap-2 cursor-pointer '
			onClick={openAddBeneModal}>
			<span className='text-[white] dark:text-[var(--primary-dark)]'>
				<FaUserCircle size={32} />
			</span>
			<p className='font-medium md:text-md text-sm dark:text-[var(--whites-dark)] text-[white]  text-center w-full'>
				Add Beneficiary
			</p>
		</div>
	);
};

export default AddNewBene;
