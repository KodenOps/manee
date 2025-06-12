'use client';
import { on } from 'events';
import React, { useState } from 'react';
interface inputType {
	placeholder: string;
	type: 'text' | 'password' | 'email' | 'number' | 'date';
	withDesc?: boolean;
	value?: string;
	infoText?: string;
	patterns?: string;
	minval?: number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
}
const InputField = ({
	placeholder,
	type,
	withDesc,
	infoText,
	patterns,
	minval,
	onChange = () => {},
	onClick = () => {},
	value = '',
}: inputType) => {
	return (
		<div className='flex flex-col items-end'>
			<input
				type={type}
				placeholder={placeholder}
				min={minval}
				pattern={patterns}
				value={value}
				required
				autoComplete='on'
				className='
		w-full 
		border-2 
		border-[var(--primary)] 
		dark:border-[var(--inputborder)] 
		rounded-[5px] 
		px-[16px] 
		md:py-[14px] 
		py-[12px]  
		focus:border-[var(--primary)] 
		focus:outline-none 
		dark:focus:border-[var(--inputborder)] 
		placeholder-gray-800 
		dark:placeholder-gray-500
	'
				onChange={onChange}
				onClick={onClick}
			/>

			{withDesc === true ? <p>{infoText}</p> : null}
		</div>
	);
};

export default InputField;
