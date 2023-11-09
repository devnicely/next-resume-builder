import CreateResumeTemplate from './template-mgmt/CreateResumeTemplate';
import RenameResumeModal from './template-mgmt/RnameResumeTemplate';


const ModalWarpper: React.FC = () => {
    return(
        <>
            <CreateResumeTemplate/>
            <RenameResumeModal/>
        </>
    )
} 


export default ModalWarpper;