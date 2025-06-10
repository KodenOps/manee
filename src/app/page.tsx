import React from 'react';
import Link from 'next/link';
import { BiUser, BiUserCircle } from 'react-icons/bi';
import { GiTakeMyMoney } from 'react-icons/gi';

const page = () => {
	return (
		<section className='px-4 flex flex-col pt-[10%] min-h-screen bg-[var(--whites)] dark:bg-[var(--primary-dark)]'>
			<div className='sm:w-[30%] sm:mx-[35%]'>
				<div className='text-[var(--primary)] dark:text-[var(--secondary-dark)] flex items-center justify-center w-full  px-[24px] gap-[5px]'>
					<span className='text-[24px] md:text-[80px]'>
						<div>
							<GiTakeMyMoney size={40} />
						</div>
					</span>
					<h2 className='font-bold text-[32px] md:text-[40px]'>MANEE</h2>
				</div>
				{/* <h1 className='text-3xl font-bold text-center mt-10'>
					Welcome to Manee
				</h1> */}
				<p className='text-center mt-4 text-xl'>
					Swift as a bullet, Reliable as an instinct
				</p>
				<div className='flex flex-wrap mt-8 items-center justify-center gap-4'>
					<Link
						href={'/login'}
						className='md:w-50 w-full  bg-blue-500 px-10 py-4 flex items-center justify-center text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 gap-4 font-bold text-md'>
						<BiUserCircle
							size={40}
							color='white'
						/>
						Go To Login
					</Link>
					<Link
						href={'/register'}
						className='md:w-50 w-full  bg-green-500 px-10 py-4 flex items-center justify-center text-white rounded-lg shadow-lg hover:bg-green-600 transition-colors duration-300 gap-4 font-bold text-md'>
						<BiUserCircle
							size={40}
							color='white'
						/>
						No account? Register{' '}
					</Link>
				</div>
			</div>
		</section>
	);
};

export default page;
