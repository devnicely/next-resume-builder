import { WarningOutlined } from "@mui/icons-material";
import { get, noop } from "lodash";
import { Button } from "~/components/common/button"
import BaseModal from "~/components/shared/BaseModal"
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { ModalState, setModalState } from "~/store/modal/modalSlice";

const DeleteConfirmModal: React.FC = () => {
    const { open, payload } = useAppSelector((state) => state.modal['delete-confirm-modal']) as ModalState;

    const onComplete = get(payload, 'onComplete', noop);
    const dispatch = useAppDispatch();
    const handleClose = () => {
        dispatch(setModalState({
            modal: 'delete-confirm-modal',
            state: {open: false}
        }));
    }

    return (
        <BaseModal
            isOpen={open}
            icon={<WarningOutlined/>}
            heading="Are you sure you want to delete this?"
            handleClose={handleClose}
            footerChildren={
                <div className="flex gap-3">
                    <Button type="submit" onClick={() => onComplete(0)}>
                        Yes
                    </Button>
                    <Button type="submit" onClick={() => handleClose()}>
                        No
                    </Button>
                </div>
            }
        >
        </BaseModal>
    )
}

export default DeleteConfirmModal;