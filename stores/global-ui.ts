import create from 'zustand';

interface GlobalUIState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

const useGlobalUI = create<GlobalUIState>(set => ({
  isLoading: false,
  setLoading: isLoading =>
    set(state => {
      return {
        ...state,
        isLoading,
      };
    }),
}));

export default useGlobalUI;
