'use client';

import {
	PieChart,
	Pie,
	Tooltip,
	Cell,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import supabase from '@/helper/supabaseClient';
import { useUser } from './UserContext';

const COLORS = [
	'#0088FE',
	'#00C49F',
	'#FFBB28',
	'#FF8042',
	'#A93EFF',
	'#EF4444',
];

const timeRanges = ['Today', 'This Week', 'This Month', 'This Year'] as const;
type TimeRange = (typeof timeRanges)[number];

interface CategoryPieChartProps {
	bucketId: string | null;
}

// ✅ Custom tooltip
const CustomTooltip = ({
	active,
	payload,
}: {
	active?: boolean;
	payload?: any;
}) => {
	if (active && payload && payload.length) {
		return (
			<div className='bg-white dark:bg-gray-900 border dark:border-gray-700 p-2 rounded shadow text-sm'>
				<p className='text-gray-800 dark:text-white font-medium'>
					{payload[0].name}
				</p>
				<p className='text-gray-600 dark:text-gray-300'>
					₦{payload[0].value.toLocaleString()}
				</p>
			</div>
		);
	}
	return null;
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ bucketId }) => {
	const { userProfile } = useUser();
	const [range, setRange] = useState<TimeRange>('This Month');
	const [chartData, setChartData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

	const getStartDate = () => {
		const now = new Date();
		switch (range) {
			case 'Today':
				return startOfDay(now);
			case 'This Week':
				return startOfWeek(now, { weekStartsOn: 1 });
			case 'This Month':
				return startOfMonth(now);
			case 'This Year':
				return startOfYear(now);
		}
	};

	useEffect(() => {
		if (!userProfile?.id || !bucketId) return;

		const fetchData = async () => {
			setLoading(true);
			const fromDate = getStartDate().toISOString().split('T')[0];

			const { data, error } = await supabase
				.from('expenses')
				.select('category, amount')
				.eq('user_id', userProfile.id)
				.eq('bucket_id', bucketId)
				.gte('spent_at', fromDate);

			if (error) {
				console.error('Error fetching expenses:', error.message);
				setLoading(false);
				return;
			}

			const grouped = data?.reduce((acc: any, curr: any) => {
				if (!acc[curr.category]) acc[curr.category] = 0;
				acc[curr.category] += Number(curr.amount);
				return acc;
			}, {});

			const result = Object.entries(grouped || {}).map(([category, total]) => ({
				name: category,
				value: total,
			}));

			setChartData(result);
			setLoading(false);
		};

		fetchData();
	}, [range, userProfile?.id, bucketId]);

	return (
		<div className='w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-full'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
					Expense Categories
				</h2>
				<select
					value={range}
					onChange={(e) => setRange(e.target.value as TimeRange)}
					className='p-2 bg-gray-100 dark:bg-gray-700 rounded'>
					{timeRanges.map((r) => (
						<option
							key={r}
							value={r}>
							{r}
						</option>
					))}
				</select>
			</div>

			{loading ? (
				<p className='text-center text-gray-500 dark:text-gray-400'>
					Loading chart...
				</p>
			) : chartData.length ? (
				<ResponsiveContainer
					width='100%'
					height={300}>
					<PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
						<Pie
							dataKey='value'
							isAnimationActive
							data={chartData}
							cx='50%'
							cy='50%'
							outerRadius={80}
							label>
							{chartData.map((_, index) => (
								<Cell
									key={`cell-${index}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip
							content={<CustomTooltip />}
							cursor={false}
							wrapperStyle={{
								...(isMobile && {
									left: '10%',
									transform: 'translateX(-50%)',
								}),
							}}
							position={isMobile ? { x: 120, y: 120 } : undefined}
						/>
						<Legend />
					</PieChart>
				</ResponsiveContainer>
			) : (
				<p className='text-center text-gray-500 dark:text-gray-400'>
					No expenses in selected range.
				</p>
			)}
		</div>
	);
};

export default CategoryPieChart;
