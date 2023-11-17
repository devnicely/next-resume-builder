import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ModalName = 
'create-resume-template' 
| 'rename-resume-template' 
| 'create-coversheet-template'
| 'show-template-modal'
| 'create-integrated-resume-modal';

export type ModalState = {
    open: boolean;
    template_id?: string;
    payload?: { path?: string; item?: any; onComplete?: (newItem: any) => void };
  };
  

export type PayloadType = {
    modal: ModalName;
    state: ModalState;
};

const initialState: Record<ModalName, ModalState> = {
    "create-resume-template": {open: false, template_id: ""}, // resume template
    'rename-resume-template': {open: false}, // resume template
    'create-coversheet-template': {open: false}, // cover template
    'show-template-modal': {open: false}, //
    'create-integrated-resume-modal': {open: false}
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