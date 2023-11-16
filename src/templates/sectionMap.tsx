import find from 'lodash/find';
import get from 'lodash/get';
import React from 'react';
import { validate } from 'uuid';
import { Separator } from '~/utils/template';

export type SectionProps = {
  path: string;
  titlePath?: string | string[];
  subtitlePath?: string | string[];
  headlinePath?: string | string[];
  keywordsPath?: string;
  separator?: Separator;
};

const sectionMap = (Section: React.FC<SectionProps>): Record<string, JSX.Element> => ({
  candidate_summary: <Section key="candidate_summary" path='sections.candidate_summary'/>,
  strengths: <Section key="strengths" path='sections.strengths'/>,
  skills: <Section key="skills" path="sections.skills" titlePath="name" keywordsPath="keywords" />,
  work_experience: <Section key="work" path="sections.work_experience" titlePath={['organization', 'title', 'location']} separator=' | ' />,
  education: (
    <Section
      key="education"
      path="sections.education"
      titlePath={['institution', 'major', 'degree', 'gpa']}
      subtitlePath={['region', 'country']}
      separator=' | '
      headlinePath="score"
      keywordsPath="courses"
    />
  ),
  certifications: (
    <Section key="certifications" path="sections.certifications" titlePath="name" subtitlePath="issuer" />
  ),
  references: <Section key="references" path="sections.references" titlePath={['name', 'title']} 
  subtitlePath={['organization', 'location']} />,
  awards: <Section key="awards" path="sections.awards"/>,
  activities: <Section key="activities" path="sections.activities" />,


  cover_agency_name: <Section key="cover_agency_name" path='sections.cover_agency_name'/>,
  cover_recruiter_name: <Section key="cover_recruiter_name" path='sections.cover_recruiter_name'/>,
  cover_recruiter_title: <Section key="cover_recruiter_title" path='sections.cover_recruiter_title'/>,
  cover_recruiter_email: <Section key="cover_recruiter_email" path='sections.cover_recruiter_email'/>,
  cover_recruiter_phone: <Section key="cover_recruiter_phone" path='sections.cover_recruiter_phone'/>,
  title_candidate_information: <Section key="title_candidate_information" path='sections.title_candidate_information'/>,
  cover_candidate_summary: <Section key="cover_candidate_summary" path='sections.cover_candidate_summary'/>,
  cover_current_organization: <Section key="cover_current_organization" path='sections.cover_current_organization'/>,
  cover_current_position: <Section key="cover_current_position" path='sections.cover_current_position'/>,
  cover_current_salary: <Section key="cover_current_salary" path='sections.cover_current_salary'/>,
  cover_date_of_availability: <Section key="cover_date_of_availability" path='sections.cover_date_of_availability'/>,
  cover_target_income: <Section key="cover_target_income" path='sections.cover_target_income'/>,
  cover_work_visa_status: <Section key="cover_work_visa_status" path='sections.cover_work_visa_status'/>,
    
});

export const getSectionById = (id: string, Section: React.FC<SectionProps>): JSX.Element | null => {
  if (!id) return null;

  // Check if section id is a custom section (is a valid uuid)
  if (validate(id)) return <Section key={id} path={`sections.${id}`} />;

  // Check if section id is a predefined seciton in config
  const predefinedSection = get(sectionMap(Section), id);

  if (predefinedSection) {
    return predefinedSection;
  }

  // Otherwise, section must be a cloned section
  const section = find(sectionMap(Section), (_element, key) => id.includes(key));
  if (section) return React.cloneElement(section, { path: `sections.${id}` });

  return null;
};

export default sectionMap;
