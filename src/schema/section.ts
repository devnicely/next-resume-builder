import { DateRange } from './atoms';
import { Profile } from './basics';

export type WorkExperience = {
  id?: string;
  organization: string;
  title: string;
  date?: DateRange;
  location: string;
  summary?: string;
};

export type Education = {
  id?: string;
  institution: string;
  major: string;
  degree: string;
  gpa?: string;
  date?: DateRange;
  region: string;
  country?: string;
};

export type Certificate = {
  id?: string;
  name: string;
  issuer: string;
  date?: string;
  url?: string;
  summary?: string;
};


export type Publication = {
  id?: string;
  name: string;
  publisher: string;
  date?: string;
  url?: string;
  summary?: string;
};

export type Skill = {
  skills: string;
};

export type Language = {
  id?: string;
  name: string;
  level: string;
  levelNum: number;
};

export type Interest = {
  id?: string;
  name: string;
  keywords?: string[];
};

export type Project = {
  id?: string;
  name: string;
  description: string;
  date?: DateRange;
  url?: string;
  summary?: string;
  keywords?: string[];
};

export type Reference = {
  id?: string;
  name: string;
  title: string;
  organiztion: string;
  location: string;
  phone?: string;
  email?: string;
};

export type Custom = {
  id?: string;
  title: string;
  subtitle?: string;
  date?: DateRange;
  url?: string;
  level?: string;
  levelNum?: number;
  summary?: string;
  keywords?: string[];
};

export type ProfileSummary = {
  summary?: string;
}

export type Strengths = {
  summary: string;
};

export type CandidateInformation = {
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  candidate_website: string;
};

export type CandidiateSummary = {
  summary?: string
};

export type Award = {
  organization: string;
  title: string;
  year: string;
};


export type ListItem =
  | CandidateInformation
  | CandidiateSummary
  | Skill
  | Strengths
  | WorkExperience
  | Education
  | Award
  | Certificate
  | Language
  | Profile
  | Reference
  | Custom;

export type SectionType =
  | 'basic'
  | 'location'
  | 'profiles'
  | 'education'
  | 'certifications'
  | 'skills'
  | 'languages'
  | 'references'
  | 'custom'
  | 'work'
  | 'profile_summary'
  | 'strengths'
  | 'candidate_information'
  | 'candidate_summary'
  | 'activities';

export type SectionPath = `sections.${string}`;

export type Section = {
  id?: string;
  name: string;
  type: SectionType;
  columns: number;
  visible: boolean;
  items: ListItem[];
  item: string;
  isDuplicated?: boolean;
};
