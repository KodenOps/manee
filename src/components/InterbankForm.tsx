import React from 'react';
import InputField from './InputField';
import Button from './Button';

const InterbankForm = () => {
	return (
		<form className='flex flex-col gap-4 mt-4'>
			<InputField
				placeholder='Acount Number'
				type='text'
				withDesc={true}
				infoText='name will appear here'
				patterns='\d*'
			/>
			<InputField
				placeholder='Bank Name'
				type='text'
				withDesc={false}
				infoText=''
				patterns='\d*'
			/>
			<InputField
				placeholder='Amount'
				type='number'
				withDesc={false}
				infoText=''
				patterns='\d*'
			/>
			<InputField
				placeholder='Narration'
				type='number'
				withDesc={false}
				infoText=''
				patterns='\d*'
			/>
			<Button
				text='Proceed To Transfer'
				type='primary'
			/>
		</form>
	);
};

export default InterbankForm;
