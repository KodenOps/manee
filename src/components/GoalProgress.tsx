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
	created_at: string;
	deadline: string;
}

export default function GoalProgress({
	current,
	target,
	currency = 'NGN',
	created_at,
	deadline,
}: GoalProgressProps) {
	const percentage = Math.min(Math.round((current / target) * 100), 100);
	const formatter = new Intl.NumberFormat('en-NG');

	// Calculate RAG status based on deadline
    const getColor = (): string => {
			const now = new Date();
			const created = new Date(created_at);
			const due = new Date(deadline);

			const totalDuration = due.getTime() - created.getTime();
			const timeLeft = due.getTime() - now.getTime();

			if (totalDuration <= 0) return '#6B7280'; // Neutral Gray for invalid

			const timeElapsedPercent = 100 - (timeLeft / totalDuration) * 100;
			const goalProgress = (current / target) * 100;

			if (goalProgress < timeElapsedPercent - 20) return '#B91C1C'; // Deep red (AAA)
			if (goalProgress < timeElapsedPercent) return '#C2410C'; // Burnt orange
			if (goalProgress < timeElapsedPercent + 15) return '#CA8A04'; // Warm yellow
			return '#15803D'; // Deep green
		};
    

	const color = getColor();

	return (
		<div className='w-[200px] mx-auto'>
			<CircularProgressbarWithChildren
				value={percentage}
				strokeWidth={10}
				styles={buildStyles({
					pathColor: color,
					trailColor: 'var(--trail)',
					pathTransition: 'stroke-dashoffset 0.5s ease',
				})}>
				<div className='text-center'>
					<div
						className={`font-semibold text-3xl`}
						style={{ color }}>
						{percentage} <span className='text-2xl'>%</span>
					</div>
					<div className='text-gray-500 dark:text-gray-400 mt-1 text-sm'>
						{formatter.format(current)} / {formatter.format(target)}
					</div>
					<div className='text-gray-500 dark:text-gray-400 text-sm'>
						{currency}
					</div>
				</div>
			</CircularProgressbarWithChildren>
		</div>
	);
}
