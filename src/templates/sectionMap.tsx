import find from 'lodash/find';
import get from 'lodash/get';
import React from 'react';
import { validate } from 'uuid';

export type SectionProps = {
  path: string;
  titlePath?: string | string[];
  subtitlePath?: string | string[];
  headlinePath?: string | string[];
  keywordsPath?: string;
};

const sectionMap = (Section: React.FC<SectionProps>): Record<string, JSX.Element> => ({
  candidate_summary: <Section key="candidate_summary" path='sections.candidate_summary'/>,
  strengths: <Section key="strengths" path='sections.strengths'/>,
  skills: <Section key="skills" path="sections.skills" titlePath="name" keywordsPath="keywords" />,
  work: <Section key="work" path="sections.work" titlePath="name" subtitlePath="position" />,
  education: (
    <Section
      key="education"
      path="sections.education"
      titlePath="institution"
      subtitlePath={['degree', 'area']}
      headlinePath="score"
      keywordsPath="courses"
    />
  ),
  certifications: (
    <Section key="certifications" path="sections.certifications" titlePath="name" subtitlePath="issuer" />
  ),
  references: <Section key="references" path="sections.references" />,
  awards: <Section key="awards" path="sections.awards"/>,
  activities: <Section key="activities" path="sections.activities" />,

  cover_agency_name: <Section key="cover_agency_name" path='sections.cover_agency_name'/>
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
