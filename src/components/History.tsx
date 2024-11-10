import React from 'react';
import CardTitle from './CardTitle';
import { GiOpenBook } from 'react-icons/gi';
import HistoryDeets from './HistoryDeets';
import { IoMdTrendingUp } from 'react-icons/io';
import { IoMdTrendingDown } from 'react-icons/io';

const History = () => {
	return (
		<div>
			<CardTitle
				title='Past Transactions'
				IconName={GiOpenBook}
			/>
			<div className='historydetails'>
				<HistoryDeets
					headertext='Transfer Failed'
					time='2 Hours Ago'
					parag='Transfer of #4,500 to 2011032044 was failed...'
					IconName={IoMdTrendingUp}
					isSuccess={false}
				/>
				<HistoryDeets
					headertext='Credit Alert'
					time='2 Minutes Ago'
					parag='#4,500 was successfully received from jo...'
					IconName={IoMdTrendingDown}
					isSuccess={true}
				/>
				<HistoryDeets
					headertext='Transfer Failed'
					time='24 Nov'
					parag='Transfer of #4,500 to 2011032044 was failed...'
					IconName={IoMdTrendingUp}
					isSuccess={false}
				/>
				<HistoryDeets
					headertext='Credit Alert'
					time='10 Aug'
					parag='#42,700 was successfully received from Mi...'
					IconName={IoMdTrendingDown}
					isSuccess={true}
				/>
			</div>
		</div>
	);
};

export default History;
