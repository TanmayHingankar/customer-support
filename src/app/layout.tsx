import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Northstar AI Support',
  description: 'Premium AI-powered customer support assistant with conversation history and analytics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#09090b] text-zinc-100">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" theme="dark" />
        </AuthProvider>
      </body>
    </html>
  );
}
