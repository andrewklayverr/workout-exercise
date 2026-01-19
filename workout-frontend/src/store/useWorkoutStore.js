import { create } from 'zustand';

const useWorkoutStore = create((set) => ({
  stats: { A: 0, B: 0, C: 0, D: 0 },
  updateStats: (day) =>
    set((state) => ({
      stats: {
        ...state.stats,
        [day]: (state.stats[day] || 0) + 1
      }
    })),
  setStats: (newStats) => set({ stats: newStats })
}));

export default useWorkoutStore;
