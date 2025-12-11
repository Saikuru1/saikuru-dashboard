import './styles/globals.css';

export const metadata = {
  title: 'Saikuru Protocol Dashboard',
  description: 'Live trading dashboard for Saikuru AI / Catapult',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}