import React from 'react';

interface ButtonProps {
	text: string;
	type: 'primary' | 'secondary';
}
// text: the button action name
// type: primary or secondary
const Button = ({ text, type = 'primary' }: ButtonProps) => {
	const primaryStyles =
		'bg-[var(--primary)] dark:bg-[var(--secondary-dark)] dark:text-[var(--primary-dark)] text-[var(--whites)]';
	const secondaryStyles =
		'dark:text-[var(--secondary-dark)] text-[var(--primary)] font-medium underline ';

	return (
		<button
			className={`${
				type === 'primary' ? primaryStyles : secondaryStyles
			}  md:py-[14px] py-[12px] w-full rounded-[5px] font-normal dark:font-medium`}>
			{text}
		</button>
	);
};

export default Button;
