import { docStore } from '@/lib/docStore';
import { DrawState, emptyState } from './types';

export { StorageNotConfigured } from '@/lib/docStore';

// Draw state lives in one document so two spins can never both take the last prize.
export const withState = docStore<DrawState>('draw', emptyState).update;
