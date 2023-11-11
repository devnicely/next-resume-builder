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

export enum TemplateType {
  RESUME = 'resume',
  COVER = 'cover',
  BOTH = 'both',
}

export enum FontType {
  SECTION = 'section',
  SUBTITLE = 'subtitle',
  NORMALTEXT = 'text',
}


const defaultCSS = `/* Enter custom CSS here */

* {
    outline: 1px solid #000;
}`;


export const defaultResumeState: Resume = {
  id: 1,
  type: TemplateType.RESUME,
  shortId: '2323',
  name: 'first cover',
  slug: 'first-cover',
  image: '/images/templates/resumes/1.jpg',
  userid: 'clod19f1p0000vj0o5yxuk7fd',
  basics: {
    email: '',
    headline: '',
    birthdate: '',
    photo: {
      url: '/images/logo/logo.png',
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
      "recruiter_information": {
          "id": 'recruiter_information',
          "name": "Recruiter Information",
          "type": "recruiter_information",
          "columns": 1,
          "visible": true,
          "items": [
              {
                  'id': '27f44ddc-afdd-42b9-b6cf-481f1784ab1a',
                  'agency_name': 'Apple Recruiting Firm',
                  'recruiter_name': 'Daisy Chen',
                  'recruiter_title': 'Senior recruiting consultant',
                  'recruiter_email': 'daisy.sample@abcrecruiting.com',
                  'recruiter_phone': '+852 4344 133'
              }
          ],
          "item": "This is the summary part."
      },
      "candidate_summary": {
          "id": 'candiate_summary',
          "name": "Candidate Summaryddd",
          "type": "candidate_summary",
          "columns": 1,
          "visible": true,
          "items": [],
          "item": "This is the summary part."
      },
      "work_experience": {
          "id": "work_experience",
          "name": "Work Experience",
          "type": "work_experience",
          "items": [
              {
                  "id": "27f44ddc-afdd-42b9-b6cf-481f1784ab1e",
                  "url": "",
                  "date": {
                      "end": "2023-09-14",
                      "start": "2022-04-01"
                  },
                  "organization": "Orange System",
                  "title": "Web Developer",
                  "summary": "•\tLed the design and execution of technical projects. Delivered the partner showcase portal for presentation towards investors in Italy.\n•\t Saved over 100 hours of the developer’s time by optimizing the project development pipeline from 40+ minutes to under five minutes.\n•\tBuilt mobile wallet app for Solana, SPL token based payment EcoSystem using React Native.",
                  "location": "USA"
              }
          ],
          "item": "",
          "columns": 1,
          "visible": true
      },
      "skills": {
          "id": "skills",
          "name": "Skills",
          "type": "basic",
          "items": [],
          "item": "Next, Android, Telegram, React, IOS, Asp.net, Laravel, GPT, Ruby on Rails",
          "columns": 1,
          "visible": true
      },

      "activities": {
          "id": "activities",
          "name": "Activities",
          "type": "basic",
          "items": [],
          "item": "Web and Mobile Developer, Footballer, Singer",
          "columns": 1,
          "visible": true
      },

      "education": {
          "id": "education",
          "name": "Education",
          "type": "basic",
          "items": [
              {
                  "id": "d982ead7-a9bd-465e-80da-118ae8f6a27b",
                  "institution": "University of Wisconsin-Madison",
                  "major": "Journalism, Reporting & Strategic, Communications Tracks",
                  "degree": "BA",
                  "gpa": "GPA",
                  "date": {
                      "start": "Aug 2013",
                      "end": "Aug 2013"
                  },
                  "region": "Madison, WI",
                  "country": "United States"
              }
          ],
          "item": "",
          "columns": 1,
          "visible": true
      },
      "references": {
          "id": "references",
          "name": "References",
          "type": "basic",
          "items": [
              {
                  "id": "d982ead7-a9bd-465e-80da-118ae8f6a27b",
                  "name": "Helane Anderson",
                  "title": "Director",
                  "organization": "The Key Consulting for the Performing Arts",
                  "location": "Culver City, Calif.90232",
                  "phone": "301.945.5481",
                  "email": "hemander@yahoo.com"
              },
              {
                  "id": "879c704c-561f-4a0c-8e5f-2b7f39ef2239",
                  "name": "Dr. George Keeler",
                  "organization": "University of Laverne",
                  "location": "La Verne, Calif.91750",
                  "title": "Director",
                  "phone": "301.945.5481",
                  "email": "hemander@yahoo.com"
              }
          ],
          "item": "",
          "columns": 1,
          "visible": true
      },
     
      "certifications": {
          "id": "certifications",
          "name": "Certifications",
          "type": "basic",
          "items": [],
          "item": "This is the certification part",
          "columns": 1,
          "visible": true
      },
      "strengths": {
          "id": "strengths",
          "name": "Strengths",
          "type": "strengths",
          "items": [],
          "item": "Breaking coverage, Feature writing, Investigative, reporting, Interviewing, Research, Fact-checking, Copy editing, AP Style, Leadership, Mentoring, Training, Headlines, Cutlines, Digital Photo",
          "columns": 1,
          "visible": true
      },
      "awards": {
          "id": "awards",
          "name": "Awards",
          "type": "awards",
          "items": [
              {
                  "id": "d982ead7-a9bd-465e-80da-118ae8f6a27b",
                  "title": "Director",
                  "organization": "The Key Consulting for the Performing Arts",
                  "year": "2023",
              }
          ],
          "item": "",
          "columns": 1,
          "visible": true
      }
  },
  metadata: {
    css: {
      value: defaultCSS,
      visible: false,
    },
    theme: {
      text: '#000000',
      background: '#ffffff',
      primary: '#0065B8',
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
        ['candidate_summary', "strengths", 'work_experience', 'education', 'references', 'activities'],
        ['certifications', 'skills', 'awards'],
      ],
    ],
    template: 'simple',
    typography: {
      family: {
          section: 'Open Sans',
          subtitle: 'Open Sans',
          text: 'Open Sans',
      },
      size: {
          section: 17,
          subtitle: 14,
          text: 14,
      },
      spacing: {
          section: 1.15,
          subtitle: 1.5,
          text: 2
      },
      color: {
          section: '#f44336',
          subtitle: '#f44336',
          text: '#000000'
      },
  },
  ratio: 30,
  },
  public: true,
};



export const defaultCoverState: Resume = {
  id: 1,
  type: TemplateType.COVER,
  shortId: '2323',
  name: 'first cover',
  slug: 'first-cover',
  image: '/images/templates/covers/1.jpg',
  userid: 'clod19f1p0000vj0o5yxuk7fd',
  basics: {
      email: '',
      headline: '',
      birthdate: '',
      photo: {
          url: '/images/logo/logo.png',
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
      "title_recruiter_information": {
          "id": "title_recruiter_information",
          "name": "Recruiter Information",
          "type": "cover_agency_name",
          "items": [],
          "item": "",
          "columns": 1,
          "visible": true
      },
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
          "name": "Job Title",
          "type": "cover_recruiter_title",
          "items": [],
          "item": "Senior Recruiting Consultant, focused on media and marketing",
          "columns": 1,
          "visible": true
      },
      "cover_recruiter_email": {
          "id": "cover_recruiter_email",
          "name": "Email",
          "type": "cover_recruiter_email",
          "items": [],
          "item": "daisy.sample@ABCRecruiting.com",
          "columns": 1,
          "visible": true
      },
      "cover_recruiter_phone": {
          "id": "cover_recruiter_phone",
          "name": "Phone number",
          "type": "cover_recruiter_phone",
          "items": [],
          "item": "+852 5347 1333",
          "columns": 1,
          "visible": true
      },

      "title_candidate_information": {
          "id": "title_candidate_information",
          "name": "Candidate Information",
          "type": "cover_recruiter_phone",
          "items": [],
          "item": "candidate",
          "columns": 1,
          "visible": true
      },

      "cover_candidate_summary": {
          "id": "cover_candidate_summary",
          "name": "Candiate Sumary",
          "type": "cover_agency_name",
          "items": [],
          "item": "Experienced journalist with a background in reporting, editing, breaking coverage, feature writing, investigative reporting, interviwewing, research, fact-checking, copy, editing, AP Style, leadership, mentoring, training, headlines, cutlines, and difital photo",
          "columns": 1,
          "visible": true
      },

      "cover_candidate_name": {
          "id": "cover_candidate_name",
          "name": "Candiate Name",
          "type": "cover_agency_name",
          "items": [],
          "item": "Maxim",
          "columns": 1,
          "visible": true
      },
      "cover_candidate_email": {
          "id": "cover_candidate_email",
          "name": "Candiate Email",
          "type": "cover_agency_name",
          "items": [],
          "item": "maxim@outlook.com",
          "columns": 1,
          "visible": true
      },
      "cover_candidate_phone": {
          "id": "cover_candidate_phone",
          "name": "Candiate Phone",
          "type": "cover_agency_name",
          "items": [],
          "item": "+8512323456",
          "columns": 1,
          "visible": true
      },
      "cover_candidate_website": {
          "id": "cover_candidate_website",
          "name": "Candiate Website",
          "type": "cover_agency_name",
          "items": [],
          "item": "https://hello.com",
          "columns": 1,
          "visible": true
      },
      "cover_current_organization": {
          "id": "cover_current_organization",
          "name": "Current Organization",
          "type": "cover_agency_name",
          "items": [],
          "item": "The Madison Commons",
          "columns": 1,
          "visible": true
      },
      "cover_current_position": {
          "id": "cover_current_position",
          "name": "Current Postion",
          "type": "cover_agency_name",
          "items": [],
          "item": "Position",
          "columns": 1,
          "visible": true
      },

      "cover_current_salary": {
          "id": "cover_current_salary",
          "name": "Current Salary",
          "type": "cover_agency_name",
          "items": [],
          "item": "100",
          "columns": 1,
          "visible": true
      },

      "cover_date_of_availability": {
          "id": "cover_date_of_availability",
          "name": "Date of Availability",
          "type": "cover_agency_name",
          "items": [],
          "item": "12",
          "columns": 1,
          "visible": true
      },

      "cover_target_income": {
          "id": "cover_target_income",
          "name": "Target Infome",
          "type": "cover_agency_name",
          "items": [],
          "item": "type...",
          "columns": 1,
          "visible": true
      },

      "cover_work_visa_status": {
          "id": "cover_work_visa_status",
          "name": "Work Visa Status",
          "type": "cover_agency_name",
          "items": [],
          "item": "visa",
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
          primary: '#0065B8',
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
              [

                  'cover_agency_name', 
                  "cover_recruiter_name", 
                  'cover_recruiter_title',
                  'cover_recruiter_email', 
                  'cover_recruiter_phone',
              ],
              [
                  'title_candidate_information',
                  'cover_candidate_summary',
                  'cover_current_organization',
                  'cover_current_position',
                  'cover_current_salary',
                  'cover_date_of_availability',
                  'cover_target_income',
                  'cover_work_visa_status',
              ],
          ],
      ],
      template: 'simplecoversheet',
      typography: {
          family: {
              section: 'Open Sans',
              subtitle: 'Open Sans',
              text: 'Open Sans',
          },
          size: {
              section: 28,
              subtitle: 14,
              text: 14,
          },
          spacing: {
              section: 1.15,
              subtitle: 1.5,
              text: 2
          },
          color: {
              section: '#f44336',
              subtitle: '#f44336',
              text: '#000000'
          },
      },
      ratio: 50,
  },
  public: true,
};

