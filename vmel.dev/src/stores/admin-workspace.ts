'use client';

import { create } from 'zustand';

type Workspace = {
  filter: 'all' | 'commercial' | 'personal';
  editingId: string | null;
  setFilter: (filter: Workspace['filter']) => void;
  edit: (id: string | null) => void;
};

export const useAdminWorkspace = create<Workspace>((set) => ({
  filter: 'all', editingId: null,
  setFilter: (filter) => set({ filter }),
  edit: (editingId) => set({ editingId }),
}));
