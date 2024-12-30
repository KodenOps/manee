'use client';
import React, { useState } from 'react';
interface inputType {
	placeholder: string;
	type: 'text' | 'password' | 'email' | 'number' | 'date';
	withDesc?: boolean;
	infoText?: string;
	patterns?: string;
	minval?: number;
	Inputvalue: any;
}
const InputField = ({
	placeholder,
	type,
	withDesc,
	infoText,
	patterns,
	minval,
	Inputvalue,
}: inputType) => {
	return (
		<div className='flex flex-col items-end'>
			<input
				type={type}
				placeholder={placeholder}
				min={minval}
				pattern={patterns}
				className='w-full border-2 border-[var(--primary)] dark:border-[var(--inputborder)] rounded-[5px] px-[16px] md:py-[14px] py-[12px] placeholder:text-[var(--disabled)] focus:border-[var(--primary)] focus:outline-none dark:focus:border-[var(--inputborder)] bg-transparent'
				onChange={(e) => {
					console.log(e.target.value);
					Inputvalue = e.target.value;
				}}
			/>
			{withDesc === true ? <p>{infoText}</p> : null}
		</div>
	);
};

export default InputField;
