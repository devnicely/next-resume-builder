import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "~/components/common/dialog";

import { useRouter } from 'next/router';

import styles from './BaseModal.module.scss';

type Props = {
  isOpen: boolean;
  heading: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footerChildren?: React.ReactNode;
  handleClose: () => void;
};

const BaseModal: React.FC<Props> = ({ icon, isOpen, heading, children, handleClose, footerChildren }) => {
  const router = useRouter();
  const { pathname, query } = router;

  const onClose = (event: object | null, reason: string | null) => {
    router.push({ pathname, query }, '');
    if (reason === 'backdropClick') return;
    handleClose();
  };

  const onIconClose = () => {
    router.push({ pathname, query }, '');
    handleClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(event, reason) => onClose(event, reason)}
      >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inline-block">
            {icon}
            {icon && <span className="mx-2 opacity-25">/</span>}
            {heading}
          </DialogTitle>
        </DialogHeader>
        {/* <DialogClose></DialogClose> */}

        <div>{children}</div>

        <DialogFooter className="sm:justify-end">
          {footerChildren ? <footer className={styles.footer}>{footerChildren}</footer> : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default BaseModal;
