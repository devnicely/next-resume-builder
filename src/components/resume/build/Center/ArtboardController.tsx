import {
  ZoomIn,
  ZoomOut,
  Focus,
  Download,
  Minimize2,
  Maximize2
} from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/common/Tooltip";

import dayjs from 'dayjs';
import get from 'lodash/get';
import { useTranslation } from 'next-i18next';
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

const ArtboardController: React.FC<ReactZoomPanPinchHandlers> = ({ zoomIn, zoomOut, centerView }) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  
  const [isDesktop, setIsDesktop] = useState(false);

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

    toast.success(t('common.toast.success.resume-link-copied'));
  };

  const handleExportPDF = async () => {
    const download = (await import('downloadjs')).default;

    const slug = get(resume, 'slug');
    const username = get(resume, 'user.username');
    const updatedAt = get(resume, 'updatedAt');

    const url = await mutateAsync({ username, slug, lastUpdated: dayjs(updatedAt).unix().toString() });

    download(url);
  };

  return (
    <div
      className={cn({
        [styles.container]: true,
        [styles.pushLeft]: left.open,
        [styles.pushRight]: right.open,
      })}
    >
      <div className={styles.controller}>
        {/* <Tooltip arrow placement="top" title={t('builder.controller.tooltip.undo')}>
            <Button variant="ghost" onClick={handleUndo} className={cn({ 'pointer-events-none opacity-50': past.length < 2 })}>
              <UndoOutlined size="24" />
            </Button>
          </Tooltip>
  
          <Tooltip arrow placement="top" title={t('builder.controller.tooltip.redo')}>
            <Button variant="ghost" onClick={handleRedo} className={cn({ 'pointer-events-none opacity-50': future.length === 0 })}>
              <RedoOutlined size="24" />
            </Button>
          </Tooltip>
  
          <Divider />
   */}

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

        {/* <Divider /> */}

        {isDesktop && (
          <>
            {/* <Tooltip arrow placement="top" title={t('builder.controller.tooltip.toggle-orientation')}>
                <Button
                  onClick={handleTogglePageOrientation}
                  className={cn({ 'pointer-events-none opacity-50': pages.length === 1 })}
                >
                  {orientation === 'vertical' ? (
                    <AlignHorizontalCenter size="24" />
                  ) : (
                    <AlignVerticalCenter size="24" />
                  )}
                </Button>
              </Tooltip> */}

            {/* <Tooltip arrow placement="top" title={t('builder.controller.tooltip.toggle-page-break-line')}>
                <Button variant="ghost" onClick={handleTogglePageBreakLine}>
                  <InsertPageBreak size="24" />
                </Button>
              </Tooltip>
   */}

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

            {/* <Divider /> */}
          </>
        )}

        {/* <Tooltip arrow placement="top" title={t('builder.controller.tooltip.copy-link')}>
            <Button variant="ghost" onClick={handleCopyLink}>
              <Link size="24" />
            </Button>
          </Tooltip> */}

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

      </div>
    </div>
  );
};

export default ArtboardController;
