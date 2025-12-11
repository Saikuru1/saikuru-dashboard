export const metadata = {
  title: 'Saikuru Protocol Dashboard',
  description: 'Live trading dashboard for Saikuru AI / Catapult',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="/saikuru-dashboard/styles/globals.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}