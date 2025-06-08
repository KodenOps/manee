import '@/app/globals.css';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { ThemeProvider } from '../../theme-provider';
export const metadata = {
	title: 'Manee',
	description: 'Swift as a bullet, Reliable as an instinct',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='en'
			className='light'
			suppressHydrationWarning>
			<body><StackProvider app={stackServerApp}><StackTheme>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'>
					{children}
				</ThemeProvider>
			</StackTheme></StackProvider></body>
		</html>
	);
}
