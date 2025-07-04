import React from 'react';
import GoalProgress from './GoalProgress';

const ProgessCard = () => {
	return (
		<div className='bg-white dark:bg-[var(--card-bg-dark)] mb-4 shadow-md rounded-lg p-6 w-[300px] max-w-md mx-auto'>
			<GoalProgress
				current={890000}
				target={5000000}
				currency='NGN'
			/>
			<h4 className='w-full text-center mt-4 font-mono text-xl'>A New Car</h4>
		</div>
	);
};

export default ProgessCard;
