'use client';

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
	Legend,
} from 'recharts';
import { useEffect, useState } from 'react';
import {
	format,
	startOfWeek,
	startOfMonth,
	startOfYear,
	eachDayOfInterval,
} from 'date-fns';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';

const IncomeTrendLineChart = () => {
	const { userProfile } = useUser();
	const [chartData, setChartData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [range, setRange] = useState<'week' | 'month'>('month');
	const [currentBucket, setCurrentBucket] = useState<any>(null);

	useEffect(() => {
		if (!userProfile?.id) return;

		const fetchData = async () => {
			setLoading(true);

			// 1. Get latest active budget bucket
			const { data: bucket, error: bucketError } = await supabase
				.from('budget_buckets')
				.select('*')
				.eq('user_id', userProfile.id)
				.eq('status', 'open')
				.order('start_date', { ascending: false })
				.limit(1)
				.single();

			if (bucketError || !bucket) {
				console.error('Error fetching current bucket:', bucketError?.message);
				setLoading(false);
				return;
			}

			setCurrentBucket(bucket);
			const income = bucket.total_income || 0;

			// 2. Determine time range
			let start: Date;
			const today = new Date();

			if (range === 'week') {
				start = startOfWeek(today, { weekStartsOn: 1 });
			} else if (range === 'month') {
				start = startOfMonth(today);
			} else {
				start = startOfYear(today);
			}

			// 3. Get expenses for that bucket only
			const { data: expenses, error: expenseError } = await supabase
				.from('expenses')
				.select('amount, spent_at')
				.eq('user_id', userProfile.id)
				.eq('bucket_id', bucket.id)
				.gte('spent_at', start.toISOString().split('T')[0]);

			if (expenseError) {
				console.error('Error fetching expenses:', expenseError.message);
				setLoading(false);
				return;
			}

			// 4. Aggregate and transform
			const expensesPerDay: Record<string, number> = {};
			for (const row of expenses || []) {
				const day = format(new Date(row.spent_at), 'yyyy-MM-dd');
				expensesPerDay[day] = (expensesPerDay[day] || 0) + Number(row.amount);
			}

			const days = eachDayOfInterval({ start, end: today });
			let balance = income;
			const trend = days.map((date) => {
				const key = format(date, 'yyyy-MM-dd');
				const spent = expensesPerDay[key] || 0;
				balance -= spent;
				return {
					date: format(date, 'MMM d'),
					balance: Math.max(balance, 0),
					spent,
				};
			});

			setChartData(trend);
			setLoading(false);
		};

		fetchData();
	}, [userProfile?.id, range]);

	return (
		<div className='w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
					Income Flow / Time ({range})
				</h2>
				<div className='flex gap-2'>
					{(['week', 'month'] as const).map((r) => (
						<button
							key={r}
							className={`px-3 py-1 rounded text-sm ${
								range === r
									? 'bg-blue-600 text-white'
									: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
							}`}
							onClick={() => setRange(r)}>
							{r.charAt(0).toUpperCase() + r.slice(1)}
						</button>
					))}
				</div>
			</div>

			{loading ? (
				<p className='text-center text-gray-500 dark:text-gray-400'>
					Loading chart...
				</p>
			) : chartData.length ? (
				<ResponsiveContainer
					width='100%'
					height={300}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='date' />
						<YAxis />
						<Tooltip
							formatter={(value: number, name: string) => {
								if (name === 'balance')
									return [`₦${value.toLocaleString()}`, 'Balance Left'];
								if (name === 'spent')
									return [`₦${value.toLocaleString()}`, 'Spent Today'];
								return [value, name];
							}}
						/>
						<Legend />
						<ReferenceLine
							y={5000}
							stroke='red'
							strokeDasharray='3 3'
							label={{
								value: '₦5,000 Threshold',
								position: 'right',
								fill: 'red',
								fontSize: 12,
							}}
						/>
						<Line
							type='monotone'
							dataKey='balance'
							stroke='#1E90FF'
							strokeWidth={2}
							dot={false}
							name='Balance Left'
							isAnimationActive={true}
						/>
						<Line
							type='monotone'
							dataKey='spent'
							stroke='#FF5733'
							strokeWidth={1}
							dot={{ r: 3 }}
							name='Spent Today'
							strokeDasharray='5 5'
							isAnimationActive={true}
						/>
					</LineChart>
				</ResponsiveContainer>
			) : (
				<p className='text-center text-gray-500 dark:text-gray-400'>
					No expenses recorded for this {range}.
				</p>
			)}
		</div>
	);
};

export default IncomeTrendLineChart;
