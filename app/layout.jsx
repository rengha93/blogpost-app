import Header from '@/components/Header';
import './globals.css';
import { ThemeProvider } from '@/context/themeContext';

export const metadata = {
  title: 'MindBytes',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-7xl mx-auto px-4">
          <ThemeProvider>
            <Header />
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
