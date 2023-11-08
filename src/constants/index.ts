import { Resume } from "~/schema";

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
      "work": {
          "id": "work",
          "name": "Work Experience",
          "type": "work",
          "items": [
              {
                  "id": "27f44ddc-afdd-42b9-b6cf-481f1784ab1e",
                  "url": "",
                  "date": {
                      "end": "2023-09-14",
                      "start": "2022-04-01"
                  },
                  "name": "Orange System",
                  "summary": "•\tLed the design and execution of technical projects. Delivered the partner showcase portal for presentation towards investors in Italy.\n•\t Saved over 100 hours of the developer’s time by optimizing the project development pipeline from 40+ minutes to under five minutes.\n•\tBuilt mobile wallet app for Solana, SPL token based payment EcoSystem using React Native.",
                  "position": "Fullstack Developer"
              },
              {
                  "id": "184cd72d-96c8-4fce-8a2f-e695741a1512",
                  "url": "",
                  "date": {
                      "end": "2022-02-10",
                      "start": "2020-01-15"
                  },
                  "name": "AMAZD",
                  "summary": "• Planned and executed the migration from Heroku to Google Cloud for the company’s back-end infrastructure, including APIs, databases, caching, workflows, etc. Saved lots of money for the client and improved the scalability of systems.\n• Integrated Segment.io tracking in their back-end application to better understand the customer behavior and system actions. It helped them in generating useful metrics to show to their investors.",
                  "position": "Fullstack Web Developer"
              },
          ],
          "columns": 1,
          "visible": true
      },
      "awards": {
          "id": "awards",
          "name": "Awards",
          "type": "basic",
          "items": [],
          "columns": 2,
          "visible": true
      },
      "skills": {
          "id": "skills",
          "name": "Skills",
          "type": "basic",
          "items": [
              {
                  "summary": "Next, Android, Telegram, React, IOS, Asp.net, Laravel, GPT, Ruby on Rails"
              },
          ],
          "columns": 1,
          "visible": true
      },
      
      "work-1": {
          "name": "Work Experience-1",
          "type": "work",
          "items": [],
          "columns": 2,
          "visible": true,
          "isDuplicated": true
      },
      "projects": {
          "id": "projects",
          "name": "Projects",
          "type": "basic",
          "items": [],
          "columns": 2,
          "visible": true
      },
      "education": {
          "id": "education",
          "name": "Education",
          "type": "basic",
          "items": [],
          "columns": 2,
          "visible": true
      },
      "interests": {
          "id": "interests",
          "name": "Interests",
          "type": "basic",
          "items": [],
          "columns": 2,
          "visible": true
      },
      "languages": {
          "id": "languages",
          "name": "Languages",
          "type": "basic",
          "items": [
              {
                  "id": "2579d148-92e2-459d-ab33-b9a86260dc37",
                  "name": "English",
                  "level": "8",
                  "levelNum": 9
              },
              {
                  "id": "910f7bc5-c6e4-441c-9b65-7cc3a815515f",
                  "name": "Chinese",
                  "level": "5",
                  "levelNum": 0
              }
          ],
          "columns": 2,
          "visible": true
      },
      "volunteer": {
          "id": "volunteer",
          "name": "Volunteer Experience",
          "type": "basic",
          "items": [],
          "columns": 2,
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
                  "organization": "The Key Consulting for the Performing Arts",
                  "location": "Culver City, Calif.90232",
                  "title": "Director",
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
          "columns": 1,
          "visible": true
      },
      "publications": {
          "id": "publications",
          "name": "Publications",
          "type": "basic",
          "items": [],
          "columns": 2,
          "visible": true
      },
      "certifications": {
          "id": "certifications",
          "name": "Certifications",
          "type": "basic",
          "items": [],
          "columns": 2,
          "visible": true
      },
      "profile_summary": {
          "id": "profile_summary",
          "name": "Profile Summary",
          "type": "work",
          "items": [
              {
                  "summary": "**Most recently working as City Life Editor at The Madison Commons, with a total working experience of 2 years.**\
                  \nExprerienced jounalist with a background in reporting, editing, breaking coverage, feature writing, interstiative reporting,\
                  interviewing, research, fact-checking, copy editing, AP Style, leadership, mentoring, training, headlines, cutines, and digital photo."
              },
          ],
          "columns": 1,
          "visible": true
      },
      "strenths": {
          "id": "strenths",
          "name": "Strenths",
          "type": "work",
          "items": [
              {
                  "summary": "Breaking coverage, Feature writing, Investigative, reporting, Interviewing, Research, Fact-checking, Copy editing, AP Style, Leadership, Mentoring, Training, Headlines, Cutlines, Digital Photo"
              },
          ],
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
        ['work', 'candidate_summary', 'education', 'projects', 'volunteer', 'references'],
        ['skills', 'interests', 'languages', 'awards', 'certifications', 'publications'],
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