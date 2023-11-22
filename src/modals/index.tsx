import CreateCoverSheetModal from './template-mgmt/CreateCoverSheetTemplate';
import CreateResumeModal from './template-mgmt/CreateResumeModal';
import CreateResumeTemplate from './template-mgmt/CreateResumeTemplate';
import DeleteConfirmModal from './template-mgmt/DeleteConfirmModal';
import RenameResumeModal from './template-mgmt/RnameResumeTemplate';
import ShowTemplatesModal from './template-mgmt/ShowTemplatesModal';

const ModalWarpper: React.FC = () => {
    return(
        <>
            <CreateResumeTemplate/>
            <CreateCoverSheetModal/>
            <RenameResumeModal/>
            <ShowTemplatesModal/>
            <CreateResumeModal/>
            <DeleteConfirmModal/>
        </>
    )
} 


export default ModalWarpper;