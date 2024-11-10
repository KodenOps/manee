import React from 'react';
import { FiDownload } from 'react-icons/fi';
import { GoShareAndroid } from 'react-icons/go';
interface historytype {
	headertext: string;
	time: string;
	parag: string;
	IconName: React.ComponentType<{ size?: number; color?: string }>;
	isSuccess: boolean;
}
const HistoryDeets = ({
	headertext,
	time,
	parag,
	IconName,
	isSuccess,
}: historytype) => {
	return (
		<div className='flex  md:justify-between justify-center items-center gap-4 w-full md:flex-row flex-col border-b-[1px] pb-[16px] border-[#a3a3a351]'>
			<div className='left w-full md:px-[24px] px-[16px] mt-4 flex items-center gap-4'>
				<div
					className={`icon p-[8px] ${
						isSuccess ? 'bg-[var(--greens)]' : 'bg-[var(--reds)]'
					} rounded-full flex items-center justify-center`}>
					<IconName size={18} />
				</div>
				<div className='texts '>
					<h4 className='text-[var(--text)] dark:text-[var(--whites-dark)] text-md font-medium'>
						{headertext} -{' '}
						<span className='text-[#666363] dark:text-[#00CCCC] text-[12px]'>
							{' '}
							{time}{' '}
						</span>
					</h4>
					<p className='w-full text-sm text-[var(--greys)] dark:text-[#F3EAEA] font-thin'>
						{parag}
					</p>
				</div>
			</div>
			<div className='right md:flex hidden items-center gap-8 pr-4 '>
				<FiDownload size={24} />
				<GoShareAndroid size={24} />
			</div>
		</div>
	);
};

export default HistoryDeets;
