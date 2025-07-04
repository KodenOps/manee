// app/layout.tsx
import '@/app/globals.css';
import { ThemeProvider } from '../../theme-provider';
import InviteWatcher from '@/components/InviteWatcher';
import { UserProvider } from '@/components/UserContext'; // 👈 import the context

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
						{' '}
						<div className='relative'>
							<InviteWatcher />
							{children}
						</div>
					</UserProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
