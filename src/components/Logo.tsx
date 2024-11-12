import React from 'react';
import { GiTakeMyMoney } from 'react-icons/gi';

const Logo = () => {
	return (
		<div className='text-[var(--primary)] dark:text-[var(--secondary-dark)] flex items-center  px-[24px] gap-[5px]'>
			<span className=''>
				<GiTakeMyMoney size={32} />
			</span>
			<h2 className='font-bold'>MANEE</h2>
		</div>
	);
};

export default Logo;
