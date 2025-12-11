import '@styles/globals.css';

export const metadata = {
  title: 'Saikuru Protocol Dashboard',
  description: 'Zero-cost trading dashboard for the Saikuru AI / Catapult System.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}