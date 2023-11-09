import { Button } from 'src/components/common/button';
import cloneDeep from 'lodash/cloneDeep';
import React, { ReactComponentElement, useMemo } from 'react';
import { Resume, Section as SectionRecord } from '~/schema';
import { validate } from 'uuid';

import { getCustomSections, getSectionsByType, left } from '~/config/sections';
import { setSidebarState } from '~/store/build/buildSlice';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { addSection } from '~/store/resume/resumeSlice';

import styles from './LeftSidebar.module.scss';
import Section from './sections/Section';
import { api } from '~/utils/api';

const LeftSidebar = () => {

  const dispatch = useAppDispatch();

  const sections = useAppSelector((state) => state.resume.present.sections);
  const { open } = useAppSelector((state) => state.build.sidebar.left);

  const customSections = useMemo(() => getCustomSections(sections), [sections]);

  const handleOpen = () => dispatch(setSidebarState({ sidebar: 'left', state: { open: true } }));

  const handleClose = () => dispatch(setSidebarState({ sidebar: 'left', state: { open: false } }));


  const handleClick = (id: string) => {
    const elementId = validate(id) ? `#section-${id}` : `#${id}`;
    const section = document.querySelector(elementId);

    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddSection = () => {
    const newSection: SectionRecord = {
      name: 'Custom Section',
      type: 'custom',
      visible: true,
      columns: 2,
      items: [],
    };

    dispatch(addSection({ value: newSection, type: 'custom' }));
  };

  const sectionsList = () => {
    const sectionsComponents: Array<ReactComponentElement<any>> = [];

    for (const item of left) {
      const id = (item as any).id;
      const component = (item as any).component;
      const type = component.props.type;
      const addMore = !!component.props.addMore;

      sectionsComponents.push(
        <section key={id} id={id}>
          {component}
        </section>,
      );

      if (addMore) {
        const additionalSections = getSectionsByType(sections, type);
        const elements = [];
        for (const element of additionalSections) {
          const newId = element.id;

          const props = cloneDeep(component.props);
          props.path = 'sections.' + newId;
          props.name = element.name;
          props.isDeletable = true;
          props.addMore = false;
          props.isDuplicated = true;
          const newComponent = React.cloneElement(component, props);

          elements.push(
            <section key={newId} id={`section-${newId}`}>
              {newComponent}
            </section>,
          );
        }
        sectionsComponents.push(...elements);
      }
    }
    return sectionsComponents;
  };

  const resume: Resume = useAppSelector((state) => state.resume.present);
  const {
    mutateAsync: updateResum,
    isLoading,
    isSuccess,
  } = api.resume.updateResum.useMutation();

  const onClickedBtnResumeSave = () => {
    try {
      updateResum({
        id: resume.id,
        shortId: resume.shortId,
        name: resume.name,
        userId: resume.userid,
        slug: resume.slug,
        image: resume.image,
        recruiter: JSON.stringify(resume.recruiter),
        basics: JSON.stringify(resume.basics),
        sections: JSON.stringify(resume.sections),
        metadata: JSON.stringify(resume.metadata),
        public: resume.public
      });
      alert("Saved Successfully");
    } catch (error) {
      alert("fail");
    }
  }

  return (
    <div className={`${open ? 'left-0' : '-left-full'} absolute top-0 bg-white h-full !shadow-lg transition-all duration-300 z-20`}>
      <div className={styles.container}>
        <main>
          <Button onClick={onClickedBtnResumeSave} color='primary' variant="outline" className={"w-full"}>Resume Save</Button>

          {sectionsList()}
          
          {/* {customSections.map(({ id }) => (
            <section key={id} id={`section-${id}`}>
              <Section path={`sections.${id}`} type="custom" isEditable isHideable isDeletable />
            </section>
          ))} */}

          {/* <div className="py-6 text-right">
            <Button fullWidth variant="outlined" startIcon={<Add />} onClick={handleAddSection}>
              Add New Section
            </Button>
          </div> */}
        </main>
      </div>
    </div>
  );
};

export default LeftSidebar;
