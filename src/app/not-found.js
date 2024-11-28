'use client';
// app/not-found.js
import Image from 'next/image';
import Link from 'next/link';
import error from '../../public/assets/error.png';
import HeaderNav from '@/components/HeaderNav';
import SideNav from '@/components/SideNav';
export default function NotFound() {
	return (
		<div className='w-full h-screen flex items-start justify-between'>
			<div className='md:block hidden'>
				<SideNav />
			</div>
			<div className='dark:bg-[var(--primary-dark)] h-full '>
				<HeaderNav />
				<div className='md:pl-[210px] md:mt-[32px] mt-[48px] flex md:flex-row  flex-col items-center justify-center   w-full'>
					<div className='md:w-[50%] w-[100%]'>
						<Image
							src={error}
							alt='error page'
						/>
					</div>
					<div className='md:w-[50%] px-[24px] flex flex-col gap-4'>
						<h1 className='md:text-[50px] text-[32px] md:font-bold dark:text-[var(--whites)] text-[var(--primary-dark)]'>
							404 - Page Not Found
						</h1>
						<p className='md:text-[24px] md:w-[80%] md:text-left text-center'>
							The page you're looking for doesn't exist or has been moved.
						</p>
						<Link
							href='/'
							className='md:w-[20%] text-lg dark:text-[var(--accents)] text-[var(--primary)] font-medium md:text-left text-center'>
							Go Back Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
