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


export type Skill = {
  skills: string;
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

export type Strengths = {
  id?: string;
  summary: string;
};

export type CandidateInformation = {
  id?: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  candidate_website: string;
};

export type RecruiterInformation = {
  id?: string;
  agency_name: string;
  recruiter_name: string;
  recruiter_title: string;
  recruiter_email: string;
  recruiter_phone: string;
}

export type CandidiateSummary = {
  id?: string;
  summary?: string
};

export type Award = {
  id?: string;
  organization: string;
  title: string;
  year: string;
};


export type ListItem =
  | CandidateInformation
  | CandidiateSummary
  | RecruiterInformation
  | Skill
  | Strengths
  | WorkExperience
  | Education
  | Award
  | Certificate
  | Profile
  | Reference
  | Custom;


export type SectionType =
  | 'recruiter_information'
  | 'candidate_information'
  | 'candidate_summary'
  | 'skills'
  | 'strengths'
  | 'work_experience'
  | 'education'
  | 'awards'
  | 'certifications'
  | 'activities'
  | 'references'

  | 'basic'
  | 'location'
  | 'profiles'
  | 'custom'
  
  | 'cover_agency_name'
  | 'cover_recruiter_name'
  | 'cover_recruiter_title'
  | 'cover_recruiter_email'
  | 'cover_recruiter_phone';

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
