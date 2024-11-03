'use client';
import React from 'react';
import { useTheme } from 'next-themes';
const SideBar = () => {
	const { theme, setTheme } = useTheme();
	return (
		<div>
			<h2>Hello Junkies</h2>
			<button onClick={() => setTheme('light')}>Light</button>
			<button onClick={() => setTheme('dark')}>Dark</button>
		</div>
	);
};

export default SideBar;
