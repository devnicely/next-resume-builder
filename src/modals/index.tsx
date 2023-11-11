import CreateCoverSheetModal from './template-mgmt/CreateCoverSheetModal';
import CreateResumeTemplate from './template-mgmt/CreateResumeTemplate';
import RenameResumeModal from './template-mgmt/RnameResumeTemplate';


const ModalWarpper: React.FC = () => {
    return(
        <>
            <CreateResumeTemplate/>
            <CreateCoverSheetModal/>
            <RenameResumeModal/>
        </>
    )
} 


export default ModalWarpper;