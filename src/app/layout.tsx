import '@/app/globals.css';
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
			style={{ colorScheme: 'light' }}
			suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
