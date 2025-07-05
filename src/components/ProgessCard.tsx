// components/ProgessCard.tsx
import React from 'react';
import GoalProgress from './GoalProgress';

interface ProgessCardProps {
	current: number;
	target: number;
	currency: string;
	goalname: string;
	deadline?: string;
	created_at?: string;
	onClick?: () => void;
}

const ProgessCard = ({
	current,
	target,
	currency,
	goalname,
	deadline,
	created_at,
	onClick,
}: ProgessCardProps) => {
	return (
		<div
			className='bg-white dark:bg-[var(--card-bg-dark)] mb-4 shadow-md rounded-lg p-6 w-[250px] max-w-sm mx-auto cursor-pointer hover:shadow-lg transition'
			onClick={onClick}>
			<GoalProgress
				current={current}
				target={target}
				currency={currency}
				created_at={created_at || ''}
				deadline={deadline || ''}
			/>
			<h4 className='w-full text-center mt-4 font-mono text-xl capitalize'>
				{goalname}
			</h4>
			<p className='text-sm text-center text-gray-500 dark:text-gray-400'>
				Deadline: {deadline}
			</p>
		</div>
	);
};

export default ProgessCard;
