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
import * as DialogPrimitive from "@radix-ui/react-dialog";
import styles from './BaseModal.module.scss';
import { Cross2Icon } from "@radix-ui/react-icons";
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
      onOpenChange={() => {onClose(null, null)}}
      >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inline-block">
            {icon}
            {icon && <span className="mx-2 opacity-25">/</span>}
            {heading}
          </DialogTitle>
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Cross2Icon onClick={onIconClose} className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogHeader>

        <div>{children}</div>

        <DialogFooter className="sm:justify-end">
          {footerChildren ? <footer className={styles.footer}>{footerChildren}</footer> : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export default BaseModal;
