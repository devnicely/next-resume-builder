import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ModalName = 'create-resume' | 'rename-resume';

export type ModalState = {
    open: boolean;
    payload?: { path?: string; item?: any; onComplete?: (newItem: any) => void };
  };
  

export type PayloadType = {
    modal: ModalName;
    state: ModalState;
};

const initialState: Record<ModalName, ModalState> = {
    "create-resume": {open: false},
    'rename-resume': {open: false},
};

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setModalState: (state: Record<ModalName, ModalState>, action: PayloadAction<PayloadType>) => {
            state[action.payload.modal] = action.payload.state;
        },
    }
});

export const {setModalState} = modalSlice.actions;

export default modalSlice.reducer;