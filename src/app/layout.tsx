// app/layout.tsx
import '@/app/globals.css';
import { ThemeProvider } from '../../theme-provider';
import InviteWatcher from '@/components/InviteWatcher';

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
					{/* 👇 Client-only wrapper */}
					<div className='relative'>
						<InviteWatcher />
						{children}
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
