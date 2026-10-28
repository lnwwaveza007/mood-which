import type { Metadata } from 'next';
import AdminPanel from '@/components/draw/AdminPanel';

export const metadata: Metadata = {
  title: 'Draw Admin • MoodWhich',
  robots: { index: false, follow: false },
};

export default function DrawAdminPage() {
  return <AdminPanel />;
}
