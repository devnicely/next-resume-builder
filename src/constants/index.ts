import { Resume } from "~/schema";
import { Cover } from "~/schema/cover";

// React Queries
export const FONTS_QUERY = 'fonts';
export const RESUMES_QUERY = 'resumes';
export const SHORT_ID_LENGTH = 8;


// Regular Expressions
export const VALID_URL_REGEX = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

// Date Formats
export const FILENAME_TIMESTAMP = 'DDMMYYYYHHmmss';

// Links
export const DOCS_URL = 'https://docs.rxresu.me';
export const DONATION_URL = 'https://paypal.me/amruthde';
export const TRANSLATE_URL = 'https://translate.rxresu.me/';
export const DIGITALOCEAN_URL = 'https://pillai.xyz/digitalocean';
export const REDDIT_URL = 'https://www.reddit.com/r/reactiveresume/';
export const GITHUB_URL = 'https://github.com/AmruthPillai/Reactive-Resume';
export const PRODUCT_HUNT_URL = 'https://www.producthunt.com/posts/reactive-resume-v3';
export const GITHUB_ISSUES_URL = 'https://github.com/AmruthPillai/Reactive-Resume/issues/new/choose';

// Default Error Message
export const DEFAULT_ERROR_MESSAGE =
  'Something went wrong while performing this action, please report this issue on GitHub.';

export enum TemplateType{
  RESUME = 'resume',
  COVER = 'cover',
  BOTH = 'both',
}


const defaultCSS = `/* Enter custom CSS here */

* {
    outline: 1px solid #000;
}`;

export const defaultResumeState: Partial<Resume> = {
  "recruiter": {
      "section_name": "Recruiter Information",
      "agency_name": "Apple Recruiting Firm",
      "recruiter_name": "Daisy Chen",
      "recruiter_title": "Senior recruiting consultant",
      "recruiter_email": "daisy.sample@abcrecruiting.com",
      "recruiter_phone": "+852 4344 1333"
  },
  basics: {
    email: '',
    headline: '',
    birthdate: '',
    photo: {
      url: '',
      visible: true,
      filters: {
        size: 128,
        shape: 'square',
        border: false,
        grayscale: false,
      },
    },
    name: '',
    phone: '',
    summary: '',
    website: '',
    location: {
      address: '',
      city: '',
      country: '',
      region: '',
      postalCode: '',
    },
    profiles: [],
  },
  "sections": {
    "candidate_summary": {
        "id": "candidate_summary",
        "name": "Candidate Summary",
        "type": "basic",
        "items": [],
        "item": "",
        "columns": 1,
        "visible": true
    },
      "work": {
          "id": "work",
          "name": "Work Experience",
          "type": "work",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      },
      "awards": {
          "id": "awards",
          "name": "Awards",
          "type": "basic",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      },
      "skills": {
          "id": "skills",
          "name": "Skills",
          "type": "basic",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      }, 
      "education": {
          "id": "education",
          "name": "Education",
          "type": "basic",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      },
      "references": {
          "id": "references",
          "name": "References",
          "type": "basic",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      },
      
      "certifications": {
          "id": "certifications",
          "name": "Certifications",
          "type": "basic",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      },
      
      "strengths": {
          "id": "strengths",
          "name": "Strengths",
          "type": "basic",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      },
      
      "activities": {
        "id": "activities",
        "name": "Activities",
        "type": "basic",
        "items": [],
        "item": "",
        "columns": 1,
        "visible": true
    },
  },
  metadata: {
    css: {
      value: defaultCSS,
      visible: false,
    },
    theme: {
      text: '#000000',
      background: '#ffffff',
      primary: '#f44336',
    },
    locale: 'en',
    date: {
      format: 'MMMM DD, YYYY',
    },
    page: {
      format: 'A4',
    },
    layout: [
      [
        ['candidate_summary', "strengths", 'work', 'education', 'references', 'activities'],
          ['certifications', 'skills', 'awards'],
      ],
    ],
    template: 'kakuna',
    typography: {
      family: {
        heading: 'Open Sans',
        body: 'Open Sans',
      },
      size: {
        heading: 28,
        body: 14,
      },
    },
  },
  public: true,
};



export const defaultCoverState: Cover = {
  id: 1,
  shortId: '2323',
  name: 'first cover',
  slug: 'first-cover',
  image: '/images/templates/covers/1.jpg',
  userid: 'clod19f1p0000vj0o5yxuk7fd',
  metadata: {
    css: {
      value: defaultCSS,
      visible: false,
    },
    theme: {
      text: '#000000',
      background: '#ffffff',
      primary: '#f44336',
    },
    locale: 'en',
    date: {
      format: 'MMMM DD, YYYY',
    },
    page: {
      format: 'A4',
    },
    layout: [
      [
        ['candidate_summary', "strengths", 'work', 'education', 'references', 'activities'],
          ['certifications', 'skills', 'awards'],
      ],
    ],
    template: 'kakuna',
    typography: {
      family: {
        heading: 'Open Sans',
        body: 'Open Sans',
      },
      size: {
        heading: 28,
        body: 14,
      },
    },
  },
  sections: {
    "cover_agency_name": {
          "id": "cover_agency_name",
          "name": "Agency Name",
          "type": "cover_agency_name",
          "items": [],
          "item": "Apple Recruiter Firm",
          "columns": 1,
          "visible": true
    },
    "cover_recruiter_name": {
      "id": "cover_recruiter_name",
      "name": "Recruiter Name",
      "type": "cover_recruiter_name",
      "items": [],
      "item": "Daisy Chen",
      "columns": 1,
      "visible": true
    },
    "cover_recruiter_title": {
      "id": "cover_recruiter_title",
      "name": "Cover Recruiter Title",
      "type": "cover_recruiter_title",
      "items": [],
      "item": "Senior Recruiting Consultant, focused on media and marketing",
      "columns": 1,
      "visible": true
    }
  },
  public: true,
}