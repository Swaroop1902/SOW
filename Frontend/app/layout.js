import './globals.css';

export const metadata = {
  title: 'SOW Tracker',
  description: 'Manage your SOW documents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
