import {
  ZoomIn,
  ZoomOut,
  Focus,
  Download,
  Minimize2,
  Save,
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/common/Tooltip";

import get from 'lodash/get';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { ReactZoomPanPinchHandlers } from 'react-zoom-pan-pinch';
import { ActionCreators } from 'redux-undo';

import { ServerError } from '~/services/axios';
import { printResumeAsPdf, PrintResumeAsPdfParams } from '~/services/printer';
import { togglePageBreakLine, togglePageOrientation, toggleSidebar } from '~/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import getResumeUrl from '~/utils/getResumeUrl';
import { cn } from '~/utils/styles';
import styles from './ArtboardController.module.scss';
import { Button } from '~/components/common/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ScreenLoading from '~/components/common/ScreenLoading';
import { api } from '~/utils/api';
import useFetchTemplates from '~/hooks/useFetchTemplates';
import { TemplateType } from '~/constants';

const ArtboardController: React.FC<ReactZoomPanPinchHandlers> = ({ zoomIn, zoomOut, centerView }) => {

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isDesktop, setIsDesktop] = useState(false);
  const { refetchGetTemplates } = useFetchTemplates();

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1280); // Set breakpoint value according to your needs
    };

    handleResize(); // Initial check

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { past, present: resume, future } = useAppSelector((state) => state.resume);
  const pages = get(resume, 'metadata.layout');
  const { left, right } = useAppSelector((state) => state.build.sidebar);
  const orientation = useAppSelector((state) => state.build.page.orientation);

  const { mutateAsync, isLoading } = useMutation<string, ServerError, PrintResumeAsPdfParams>(printResumeAsPdf);

  const handleUndo = () => dispatch(ActionCreators.undo());
  const handleRedo = () => dispatch(ActionCreators.redo());
  const handleTogglePageBreakLine = () => dispatch(togglePageBreakLine());
  const handleTogglePageOrientation = () => dispatch(togglePageOrientation());

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar({ sidebar: 'left' }));
    dispatch(toggleSidebar({ sidebar: 'right' }));
  };

  const handleCopyLink = async () => {
    const url = getResumeUrl(resume, { withHost: true });
    await navigator.clipboard.writeText(url);                                        
    toast.success('A link to your resume has been copied to your clipboard.');
  };

  const handleExportPDF = async () => {
    const download = (await import('downloadjs')).default;
    const id: string = get(resume, 'id').toString();
    // const username = get(resume, 'user.username', '');
    // const updatedAt = get(resume, 'updatedAt');
    const url = await mutateAsync({ id });
    download(url);
  };

  const {
    mutateAsync: updateResum,
    isLoading: isSaving,
    isSuccess,
  } = api.template.updateResum.useMutation();

  const handleSave = async () => {
    try {
      await updateResum({
        id: resume.id,
        shortId: resume.shortId,
        name: resume.name,
        userId: resume.userid,
        slug: resume.slug,
        image: resume.image,
        basics: JSON.stringify(resume.basics),
        sections: JSON.stringify(resume.sections),
        metadata: JSON.stringify(resume.metadata),
        public: resume.public,
        resumeId: resume.resumeId
      });

      refetchGetTemplates();
      toast.success("Saved Resume Successfully");
    } catch (error) {
      toast.error("Failed to save the resume.");
    }
  }


  return (
    isLoading || isSaving ? <ScreenLoading />
      :
      <div
        className={cn({
          [styles.container]: true,
          [styles.pushLeft]: left.open,
          [styles.pushRight]: right.open,
        })}
      >
        <div className={styles.controller}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => zoomIn(0.25)}>
                  <ZoomIn size="24" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-700 text-white">
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => zoomOut(0.25)}>
                  <ZoomOut size="24" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-700 text-white">
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => centerView(0.95)}>
                  <Focus size="24" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-700 text-white">
                <p>Focus To Center</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isDesktop && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" onClick={handleToggleSidebar}>
                      <Minimize2 size="24" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-zinc-700 text-white">
                    <p>Extend View</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={handleSave} disabled={isSaving}>
                  <Save size="24" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-700 text-white">
                <p>Save</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {resume.type === TemplateType.RESUME &&
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={handleExportPDF} disabled={isLoading}>
                    <Download size="24" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-700 text-white">
                  <p>Download to PDF</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        </div>
      </div>

  );
};

export default ArtboardController;
