import { DragDropContext, Draggable, DraggableLocation, Droppable, DropResult } from '@hello-pangea/dnd';
import { Plus as Add, XIcon as Close, RotateCcw as Restore } from 'lucide-react';

import { Button } from 'src/components/common/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'src/components/common/Tooltip';

import clsx from 'clsx';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import Heading from '~/components/shared/Heading';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { addPage, deletePage, setResumeState } from '~/store/resume/resumeSlice';

import styles from './Layout.module.scss';
import { TemplateType } from '~/constants';

const getIndices = (location: DraggableLocation) => ({
  page: +location.droppableId.split('.')[0],
  column: +location.droppableId.split('.')[1],
  section: +location.index,
});

const Layout = () => {
  
  const dispatch = useAppDispatch();

  const layout = useAppSelector((state) => state.resume.present.metadata.layout);
  const resumeSections = useAppSelector((state) => state.resume.present.sections);
  const resume = useAppSelector((state) => state.resume.present);

  const onDragEnd = (dropResult: DropResult) => {
    const { source: srcLoc, destination: destLoc } = dropResult;

    if (!destLoc) return;

    const newLayout = cloneDeep(layout);

    const srcIndex = getIndices(srcLoc);
    const destIndex = getIndices(destLoc);
    const section = layout[srcIndex.page][srcIndex.column][srcIndex.section];

    // Remove item at source
    newLayout[srcIndex.page][srcIndex.column].splice(srcIndex.section, 1);

    // Insert item at destination
    newLayout[destIndex.page][destIndex.column].splice(destIndex.section, 0, section);

    dispatch(setResumeState({ path: 'metadata.layout', value: newLayout }));
  };

  const handleAddPage = () => dispatch(addPage());

  const handleDeletePage = (page: number) => dispatch(deletePage({ page }));

  return (
    <>
      <Heading
        path="metadata.layout"
        name="Layout"
      />

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Pages */}
        {layout.map((columns, pageIndex) => (
          <div key={pageIndex} className={styles.page}>
            <div className="flex items-center justify-between pr-3">
              <p className={styles.heading}>
                Page {pageIndex + 1}
              </p>

              <div className={clsx(styles.delete, { hidden: pageIndex === 0 })}>
                <Close onClick={() => handleDeletePage(pageIndex)} size="28" />
              </div>
            </div>

            <div className={styles.container}>
              {/* Sections */}
              {columns.map((sections, columnIndex) => {
                const index = `${pageIndex}.${columnIndex}`;

                return (
                  <Droppable key={index} droppableId={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} className={styles.column} {...provided.droppableProps}>
                        <p className={styles.heading}>{columnIndex ? 'Sidebar' : 'Main'}</p>

                        <div className={styles.base} />
                        {/* Sections */}
                        {sections.map((sectionId, sectionIndex) => (
                          <Draggable key={sectionId} draggableId={sectionId} index={sectionIndex}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div
                                  className={clsx(styles.section)}
                                >
                                  {get(resumeSections, `${sectionId}.name`, '') as string}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-end">
          <Button variant="secondary" onClick={handleAddPage}>
            <Add className="mr-2 h-4 w-4" /> Add New Page
          </Button>
        </div>
      </DragDropContext>
    </>
  );
};

export default Layout;
