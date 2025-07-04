'use client';

import {
	CircularProgressbarWithChildren,
	buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useEffect, useState } from 'react';

interface GoalProgressProps {
	current: number;
	target: number;
	currency?: string;
	duration?: number; // duration in ms
}

export default function GoalProgress({
	current,
	target,
	currency = 'NGN',
	duration = 1000, // default 1 second
}: GoalProgressProps) {
	const targetPercentage = Math.min(Math.round((current / target) * 100), 100);
	const formatter = new Intl.NumberFormat('en-NG');
	const [percentage, setPercentage] = useState(0);

	useEffect(() => {
		let start = 0;
		const increment = targetPercentage / (duration / 10);

		const interval = setInterval(() => {
			start += increment;
			if (start >= targetPercentage) {
				start = targetPercentage;
				clearInterval(interval);
			}
			setPercentage(Math.round(start));
		}, 10);

		return () => clearInterval(interval);
	}, [targetPercentage, duration]);

	return (
		<div className='w-[200px] mx-auto'>
			<CircularProgressbarWithChildren
				value={percentage}
				strokeWidth={10}
				styles={buildStyles({
					pathColor: '#3B82F6', // blue-500
					trailColor: '#2e2e2e',
					pathTransition: 'stroke-dashoffset 0.5s ease',
				})}>
				<div className='text-center'>
					<div className='text-blue-500 font-semibold text-3xl'>
						{percentage} <span className='text-2xl'>%</span>
					</div>
					<div className='text-gray-400 mt-1 text-sm'>
						{formatter.format(current)} / {formatter.format(target)}
					</div>
					<div className='text-gray-400 text-sm'>{currency}</div>
				</div>
			</CircularProgressbarWithChildren>
		</div>
	);
}
