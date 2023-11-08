import { useRouter } from 'next/router';
import { useEffect } from 'react';

import CreateResumeModal from '../modals/template-mgmt/CreateResumeModal';


const ModalWarpper: React.FC = () => {
    return(
        <>
            <CreateResumeModal/>
        </>
    )
} 


export default ModalWarpper;