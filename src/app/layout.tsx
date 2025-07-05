// app/layout.tsx
import '@/app/globals.css';
import { ThemeProvider } from '../../theme-provider';
import { UserProvider } from '@/components/UserContext';
import { GoalsProvider } from '@/components/GoalsContext'; // 👈 import your new context

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
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'>
					<UserProvider>
						<GoalsProvider>
							<div className='relative'>{children}</div>
						</GoalsProvider>
					</UserProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
