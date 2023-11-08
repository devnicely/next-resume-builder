import isEmpty from 'lodash/isEmpty';
import { Section as SectionRecord, SectionType } from '~/schema';

import Recruiter from '~/components/resume/build/LeftSidebar/sections/Recruiter';
import Basics from '~/components/resume/build/LeftSidebar/sections/Basics';
import { SidebarSection } from '~/types/app';
import WorkExperience from '~/components/resume/build/LeftSidebar/sections/WorkExperience';
import Theme from '~/components/resume/build/LeftSidebar/sections/Theme';
import CandidateInformation from '~/components/resume/build/LeftSidebar/sections/CandidateInformation';
import CandidateSummary from '~/components/resume/build/LeftSidebar/sections/CandidateSummary';
import Skills from '~/components/resume/build/LeftSidebar/sections/Skills';
import Strengths from '~/components/resume/build/LeftSidebar/sections/Strengths';
import Education from '~/components/resume/build/LeftSidebar/sections/Education';
import Awards from '~/components/resume/build/LeftSidebar/sections/Awards';
import References from '~/components/resume/build/LeftSidebar/sections/References';
import Layout from '~/components/resume/build/RightSidebar/sections/Layout';
import Activities from '~/components/resume/build/LeftSidebar/sections/Activities';

export const left: SidebarSection[] = [
  {
    id: 'recruiter',
    icon: <></>,
    component: <Recruiter />
  },

  {
    id: 'candiate_information',
    icon: <></>,
    component: <CandidateInformation/>
  },

  {
    id: 'candiate_summary',
    icon: <></>,
    component: <CandidateSummary/>
  },

  {
    id: 'strenths',
    icon: <></>,
    component: <Strengths/>
  },

  {
    id: 'skills',
    icon: <></>,
    component: <Skills/>
  },

  {
    id: 'work_experience',
    icon: <></>,
    component: <WorkExperience/>,
  },

  {
    id: 'education',
    icon: <></>,
    component: <Education/>,
  },

  {
    id: 'awards',
    icon: <></>,
    component: <Awards/>,
  },

  {
    id: 'activities',
    icon: <></>,
    component: <Activities/>,
  },
  {
    id: 'references',
    icon: <></>,
    component: <References />,
  },
];

export const right: SidebarSection[] = [
  {
    id: 'layout',
    icon: <></>,
    component: <Layout />,
  },
  {
    id: 'theme',
    icon: <></>,
    component: <Theme />,
  },
];

export const getSectionsByType = (sections: Record<string, SectionRecord>, type: SectionType): SectionRecord[] => {
  if (isEmpty(sections)) return [];

  return Object.entries(sections).reduce((acc, [id, section]) => {
    if (section.type.startsWith(type) && section.isDuplicated) {
      return [...acc, { ...section, id }];
    }

    return acc;
  }, [] as SectionRecord[]);
};

export const getCustomSections = (sections: Record<string, SectionRecord>): SectionRecord[] => {
  if (isEmpty(sections)) return [];

  return Object.entries(sections).reduce((acc, [id, section]) => {
    if (section.type === 'custom') {
      return [...acc, { ...section, id }];
    }
    return acc;
  }, [] as SectionRecord[]);
};

const sections = [...left, ...right];

export default sections;
