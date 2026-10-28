'use client';

import React, { useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isMuted, setMuted, subscribeMuted, sfx } from '@/lib/sound';

/** Round speaker button: mutes / unmutes music and sound effects (remembered per browser). */
export default function SoundToggle({ className = '' }: { className?: string }) {
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => false);

  const toggle = () => {
    setMuted(!muted);
    if (muted) sfx.tap();
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
      aria-pressed={!muted}
      className={`w-9 h-9 rounded-full border-2 border-ink flex items-center justify-center cursor-pointer transition-transform active:scale-90 ${
        muted ? 'bg-white/90 text-ink' : 'bg-yellow text-ink'
      } ${className}`}
    >
      {muted ? <VolumeX className="w-4.5 h-4.5" strokeWidth={2.5} /> : <Volume2 className="w-4.5 h-4.5" strokeWidth={2.5} />}
    </button>
  );
}
