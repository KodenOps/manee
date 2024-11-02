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
		<html lang='en'>
			<body>{children}</body>
		</html>
	);
}
