import isEmpty from 'lodash/isEmpty';
import { Section as SectionRecord, SectionType } from '~/schema';
import Recruiter from '~/components/resume/build/LeftSidebar/sections/Recruiter';
import { SidebarSection } from '~/types/app';
import WorkExperience from '~/components/resume/build/LeftSidebar/sections/WorkExperience';
import CandidateInformation from '~/components/resume/build/LeftSidebar/sections/CandidateInformation';
import CandidateSummary from '~/components/resume/build/LeftSidebar/sections/CandidateSummary';
import Skills from '~/components/resume/build/LeftSidebar/sections/Skills';
import Strengths from '~/components/resume/build/LeftSidebar/sections/Strengths';
import Education from '~/components/resume/build/LeftSidebar/sections/Education';
import Awards from '~/components/resume/build/LeftSidebar/sections/Awards';
import References from '~/components/resume/build/LeftSidebar/sections/References';
import Layout from '~/components/resume/build/RightSidebar/sections/Layout';
import Activities from '~/components/resume/build/LeftSidebar/sections/Activities';
import Certifications from '~/components/resume/build/LeftSidebar/sections/Certifications';
import Spacing from '~/components/resume/build/RightSidebar/sections/Spacing';
import { TemplateType } from '~/constants';
import CoverInputSection from '~/components/resume/build/LeftSidebar/sections/cover/CoverInputSection';
import CoverSectionTitle from '~/components/resume/build/LeftSidebar/sections/cover/CoverSectionTitle';
import CoverLayout from '~/components/resume/build/RightSidebar/sections/cover/CoverLayout';
import Basics from '~/components/resume/build/LeftSidebar/sections/Basics';
import SidebarMain from '~/components/resume/build/RightSidebar/sections/SidbarMain';
import DateFormat from '~/components/resume/build/RightSidebar/sections/DateFormat';
import Typography from '~/components/resume/build/RightSidebar/sections/Typography';
import ColorTone from '~/components/resume/build/RightSidebar/sections/ColorTone';


export const left: SidebarSection[] = [
 
  {
    id: 'basics',
    kind: TemplateType.BOTH,
    component: <Basics />,
  },
  
  {
    id: 'recruiter',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Recruiter />
  },
  {
    id: 'candiate_information',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <CandidateInformation/>
  },

  {
    id: 'candiate_summary',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <CandidateSummary/>
  },

  {
    id: 'strenths',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Strengths/>
  },

  {
    id: 'skills',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Skills/>
  },

  {
    id: 'work_experience',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <WorkExperience/>,
  },

  {
    id: 'education',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Education/>,
  },

  {
    id: 'awards',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Awards/>,
  },

  {
    id: 'certifications',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Certifications/>,
  },

  {
    id: 'activities',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Activities/>,
  },
  
  {
    id: 'references',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <References />,
  },

  {
    id: 'cover_section_title_recruiter_information',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverSectionTitle path='sections.title_recruiter_information'/>,
  },

  {
    id: 'agency_name',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Agency Name' path='sections.cover_agency_name'/>,
  },

  {
    id: 'recruiter_name',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Recruiter Name' path='sections.cover_recruiter_name'/>,
  },

  {
    id: 'recruiter_title',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Recruiter Title' path='sections.cover_recruiter_title'/>,
  },

  {
    id: 'recruiter_email',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Recruiter Email' path='sections.cover_recruiter_email'/>,
  },

  {
    id: 'recruiter_phone',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Recruiter Phone' path='sections.cover_recruiter_phone'/>,
  },

  {
    id: 'cover_section_title_candidate_information',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverSectionTitle path='sections.title_candidate_information'/>,
  },

  {
    id: 'cover_candidate_summary',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection type='textarea' name='Candidate Summary' path='sections.cover_candidate_summary'/>,
  },

  {
    id: 'cover_candidate_name',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Candidate Name' path='sections.cover_candidate_name'/>,
  },

  {
    id: 'cover_candidate_email',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Candidate Email' path='sections.cover_candidate_email'/>,
  },

  {
    id: 'cover_candidate_phone',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Candidate Phone' path='sections.cover_candidate_phone'/>,
  },

  {
    id: 'cover_candidate_website',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Candidate Website' path='sections.cover_candidate_website'/>,
  },

  {
    id: 'cover_candidate_organizaion',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Current Organization' path='sections.cover_current_organization'/>,
  },

  {
    id: 'cover_current_position',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Current Posistion' path='sections.cover_current_position'/>,
  },

  {
    id: 'cover_current_salary',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Current Salary' path='sections.cover_current_salary'/>,
  },

  {
    id: 'cover_date_of_available',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Date Of Availability' type='date' path='sections.cover_date_of_availability'/>,
  },

  {
    id: 'cover_target_income',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Target Income' path='sections.cover_target_income'/>,
  },

  {
    id: 'cover_work_visa_status',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverInputSection name='Work Visa Status' path='sections.cover_work_visa_status'/>,
  },
];

export const right: SidebarSection[] = [
  {
    id: 'layout',
    kind: TemplateType.RESUME_TEMPLATE,
    component: <Layout />,
  },

  {
    id: 'cover_layout',
    kind: TemplateType.COVER_TEMPLATE,
    component: <CoverLayout />,
  },

  {
    id: 'spacing',
    kind: TemplateType.BOTH,
    component: <Spacing />,
  },

  {
    id: 'sidebar_main',
    kind: TemplateType.BOTH,
    component: <SidebarMain/>
  },

  {
    id: 'date_format',
    kind: TemplateType.BOTH,
    component: <DateFormat/>
  },

  {
    id: 'typography',
    kind: TemplateType.BOTH,
    component: <Typography/>
  },

  {
    id: 'colortone',
    kind: TemplateType.BOTH,
    component: <ColorTone/>
  }

  // {
  //   id: 'theme',
  //   kind: TemplateType.BOTH,
  //   component: <Theme />,
  // },
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
