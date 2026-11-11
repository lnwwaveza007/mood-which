import type { Metadata } from 'next';
import PosPanel from '@/components/pos/PosPanel';

export const metadata: Metadata = {
  title: 'POS • MoodWhich',
  robots: { index: false, follow: false },
};

export default function PosPage() {
  return <PosPanel />;
}
