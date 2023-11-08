import { create } from "zustand";

type BillingPlansState = {
  customIsLoading: boolean;
  showModal: boolean;
  showConfetti: boolean;
  setCustomIsLoading: (value: boolean) => void;
  setShowModal: (value: boolean) => void;
  setShowConfetti: (value: boolean) => void;
  initialLoadingComplete: boolean;
};

export const useBillingPlansStore = create<BillingPlansState>((set) => ({
  customIsLoading: false,
  showModal: false,
  showConfetti: false,
  initialLoadingComplete: false,
  setCustomIsLoading: (value) => set({ customIsLoading: value }),
  setShowModal: (value) => set({ showModal: value }),
  setShowConfetti: (value) => set({ showConfetti: value }),
}));
