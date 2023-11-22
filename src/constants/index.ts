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
    RESUME_TEMPLATE = 'resume_template', // resume template
    COVER_TEMPLATE = 'cover_template',
    BOTH = 'both', // both of templates, cover and resume
    RESUME = 'resume'
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


export let emptyDefaultResume: Resume = {
    id: "",
    type: TemplateType.RESUME_TEMPLATE,
    checked: false,
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
            "items": [],
            "isUppercase": true,
            "item": ""
        },
        "candidate_information": {
            "id": 'candidate_information',
            "name": "Candidate Information",
            "type": "candidate_information",
            "columns": 1,
            "visible": false,
            "items": [{
                id: "",
                candidate_name: "",
                candidate_email: "",
                candidate_phone: "",
                candidate_website: ""
            }],
            "isUppercase": true,
            "item": ""
        },
        "candidate_summary": {
            "id": 'candiate_summary',
            "name": "Candidate Summary",
            "type": "candidate_summary",
            "columns": 1,
            "visible": true,
            "items": [],
            "isUppercase": true,
            "item": ""
        },
        "work_experience": {
            "id": "work_experience",
            "name": "Work Experience",
            "type": "work_experience",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "skills": {
            "id": "skills",
            "name": "Skills",
            "type": "basic",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "activities": {
            "id": "activities",
            "name": "Activities",
            "type": "basic",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "education": {
            "id": "education",
            "name": "Education",
            "type": "basic",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "references": {
            "id": "references",
            "name": "References",
            "type": "basic",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "certifications": {
            "id": "certifications",
            "name": "Certifications",
            "type": "basic",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "strengths": {
            "id": "strengths",
            "name": "Strengths",
            "type": "strengths",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "awards": {
            "id": "awards",
            "name": "Awards",
            "type": "awards",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "title_recruiter_information": {
            "id": "title_recruiter_information",
            "name": "Recruiter Information",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_agency_name": {
            "id": "cover_agency_name",
            "name": "Agency Name",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_name": {
            "id": "cover_recruiter_name",
            "name": "Recruiter Name",
            "type": "cover_recruiter_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_title": {
            "id": "cover_recruiter_title",
            "name": "Job Title",
            "type": "cover_recruiter_title",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_email": {
            "id": "cover_recruiter_email",
            "name": "Email",
            "type": "cover_recruiter_email",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_phone": {
            "id": "cover_recruiter_phone",
            "name": "Phone number",
            "type": "cover_recruiter_phone",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "title_candidate_information": {
            "id": "title_candidate_information",
            "name": "Candidate Information",
            "type": "cover_recruiter_phone",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_candidate_summary": {
            "id": "cover_candidate_summary",
            "name": "Candiate Sumary",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_candidate_name": {
            "id": "cover_candidate_name",
            "name": "Candiate Name",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_email": {
            "id": "cover_candidate_email",
            "name": "Candiate Email",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_phone": {
            "id": "cover_candidate_phone",
            "name": "Candiate Phone",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_website": {
            "id": "cover_candidate_website",
            "name": "Candiate Website",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_current_organization": {
            "id": "cover_current_organization",
            "name": "Current Organization",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_current_position": {
            "id": "cover_current_position",
            "name": "Current Postion",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_current_salary": {
            "id": "cover_current_salary",
            "name": "Current Salary",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_date_of_availability": {
            "id": "cover_date_of_availability",
            "name": "Date of Availability",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_target_income": {
            "id": "cover_target_income",
            "name": "Target Infome",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_work_visa_status": {
            "id": "cover_work_visa_status",
            "name": "Work Visa Status",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
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
            format: 'M.D.YYYY',
        },
        page: {
            format: 'A4',
        },
        hasCover: 1,
        layout: [
            [
                ['candidate_information', 'candidate_summary', "strengths", 'work_experience', 'education', 'references', 'activities'],
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
    covermetadata: {
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
            format: 'M.D.YYYY',
        },
        page: {
            format: 'A4',
        },
        hasCover: 1,
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
                    'cover_candidate_name',
                    'cover_candidate_email',
                    'cover_candidate_phone',
                    'cover_candidate_website',
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


export let defaultResumeState: Resume = {
    id: "",
    type: TemplateType.RESUME_TEMPLATE,
    checked: false,
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
            "isUppercase": true,
            "visible": true,
            "items": [
                {
                    'id': 'c8c53993-e4ef-498c-812f-0a9076dcb82c',
                    'agency_name': 'Apple Recruiting Firm',
                    'recruiter_name': 'Recruiter',
                    'recruiter_title': 'Senior recruiting consultant',
                    'recruiter_email': 'recruiter@sample.com',
                    'recruiter_phone': '+000 0000 000'
                }
            ],
            "item": "Lorem ipsum dolor sit amet"
        },
        "candidate_information": {
            "id": 'candidate_information',
            "name": "Candidate Information",
            "type": "candidate_information",
            "columns": 1,
            "visible": false,
            "items": [{
                id: "",
                candidate_name: "",
                candidate_email: "",
                candidate_phone: "",
                candidate_website: ""
            }],
            "isUppercase": true,
            "item": ""
        },
        "candidate_summary": {
            "id": 'candiate_summary',
            "name": "Candidate Summary",
            "type": "candidate_summary",
            "columns": 1,
            "visible": true,
            "items": [],
            "isUppercase": true,
            "item": "Lorem ipsum dolor sit amet"
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
                    "organization": "Sample Company",
                    "title": "Web Developer",
                    "summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                    "location": "USA"
                }
            ],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "skills": {
            "id": "skills",
            "name": "Skills",
            "type": "basic",
            "items": [],
            "item": "Next, Android, Telegram, React, IOS, Asp.net, Laravel, GPT, Ruby on Rails",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "activities": {
            "id": "activities",
            "name": "Activities",
            "type": "basic",
            "items": [],
            "item": "Web and Mobile Developer, Footballer, Singer",
            "columns": 1,
            "isUppercase": true,
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
                        "start": "2020-11-10",
                        "end": "2023-11-19"
                    },
                    "region": "Madison, WI",
                    "country": "United States"
                }
            ],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "references": {
            "id": "references",
            "name": "References",
            "type": "basic",
            "items": [
                {
                    "id": "d982ead7-a9bd-465e-80da-118ae8f6a27b",
                    "name": "Reference",
                    "title": "Director",
                    "organization": "The Key Consulting for the Performing Arts",
                    "location": "Culver City, Calif.90232",
                    "phone": "111.111.1111",
                    "email": "reference@sample.com"
                },
            ],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "certifications": {
            "id": "certifications",
            "name": "Certifications",
            "type": "basic",
            "items": [],
            "item": "This is the certification part",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "strengths": {
            "id": "strengths",
            "name": "Strengths",
            "type": "strengths",
            "items": [],
            "item": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "awards": {
            "id": "awards",
            "name": "Awards",
            "type": "awards",
            "items": [
                {
                    "id": "99b79111-e600-4035-96a7-0b94ad935671",
                    "title": "Director",
                    "organization": "The Key Consulting for the Performing Arts",
                    "year": "2023",
                }
            ],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "title_recruiter_information": {
            "id": "title_recruiter_information",
            "name": "Recruiter Information",
            "type": "cover_agency_name",
            "items": [],
            "item": "",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_agency_name": {
            "id": "cover_agency_name",
            "name": "Agency Name",
            "type": "cover_agency_name",
            "items": [],
            "item": "Apple Recruiter Firm",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_name": {
            "id": "cover_recruiter_name",
            "name": "Recruiter Name",
            "type": "cover_recruiter_name",
            "items": [],
            "item": "Daisy Chen",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_title": {
            "id": "cover_recruiter_title",
            "name": "Job Title",
            "type": "cover_recruiter_title",
            "items": [],
            "item": "Senior Recruiting Consultant, focused on media and marketing",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_email": {
            "id": "cover_recruiter_email",
            "name": "Email",
            "type": "cover_recruiter_email",
            "items": [],
            "item": "recruiter@sample.com",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_phone": {
            "id": "cover_recruiter_phone",
            "name": "Phone number",
            "type": "cover_recruiter_phone",
            "items": [],
            "item": "+111 1111 1111",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "title_candidate_information": {
            "id": "title_candidate_information",
            "name": "Candidate Information",
            "type": "cover_recruiter_phone",
            "items": [],
            "item": "candidate",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_candidate_summary": {
            "id": "cover_candidate_summary",
            "name": "Candiate Sumary",
            "type": "cover_agency_name",
            "items": [],
            "item": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_candidate_name": {
            "id": "cover_candidate_name",
            "name": "Candiate Name",
            "type": "cover_agency_name",
            "items": [],
            "item": "Maxim",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_email": {
            "id": "cover_candidate_email",
            "name": "Candiate Email",
            "type": "cover_agency_name",
            "items": [],
            "item": "maxim@outlook.com",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_phone": {
            "id": "cover_candidate_phone",
            "name": "Candiate Phone",
            "type": "cover_agency_name",
            "items": [],
            "item": "+8512323456",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_website": {
            "id": "cover_candidate_website",
            "name": "Candiate Website",
            "type": "cover_agency_name",
            "items": [],
            "item": "https://sample.com",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_current_organization": {
            "id": "cover_current_organization",
            "name": "Current Organization",
            "type": "cover_agency_name",
            "items": [],
            "item": "The Madison Commons",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_current_position": {
            "id": "cover_current_position",
            "name": "Current Postion",
            "type": "cover_agency_name",
            "items": [],
            "item": "Position",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_current_salary": {
            "id": "cover_current_salary",
            "name": "Current Salary",
            "type": "cover_agency_name",
            "items": [],
            "item": "100",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_date_of_availability": {
            "id": "cover_date_of_availability",
            "name": "Date of Availability",
            "type": "cover_agency_name",
            "items": [],
            "item": "2023-11-15",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_target_income": {
            "id": "cover_target_income",
            "name": "Target Infome",
            "type": "cover_agency_name",
            "items": [],
            "item": "type...",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_work_visa_status": {
            "id": "cover_work_visa_status",
            "name": "Work Visa Status",
            "type": "cover_agency_name",
            "items": [],
            "item": "visa",
            "columns": 1,
            "isUppercase": true,
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
            format: 'M.D.YYYY',
        },
        page: {
            format: 'A4',
        },
        hasCover: 1,
        layout: [
            [
                ['candidate_information', 'candidate_summary', "strengths", 'work_experience', 'education', 'references', 'activities'],
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
    covermetadata: {
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
            format: 'M.D.YYYY',
        },
        page: {
            format: 'A4',
        },
        hasCover: 1,
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
                    'cover_candidate_name',
                    'cover_candidate_email',
                    'cover_candidate_phone',
                    'cover_candidate_website',
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

export const defaultCoverState: Resume = {
    id: "",
    type: TemplateType.COVER_TEMPLATE,
    shortId: '2323',
    name: 'first cover',
    checked: false,
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
            "isUppercase": true,
            "visible": true
        },
        "cover_agency_name": {
            "id": "cover_agency_name",
            "name": "Agency Name",
            "type": "cover_agency_name",
            "items": [],
            "item": "Apple Recruiter Firm",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_name": {
            "id": "cover_recruiter_name",
            "name": "Recruiter Name",
            "type": "cover_recruiter_name",
            "items": [],
            "item": "Daisy Chen",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_title": {
            "id": "cover_recruiter_title",
            "name": "Job Title",
            "type": "cover_recruiter_title",
            "items": [],
            "item": "Senior Recruiting Consultant, focused on media and marketing",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_email": {
            "id": "cover_recruiter_email",
            "name": "Email",
            "type": "cover_recruiter_email",
            "items": [],
            "item": "recruiter@sample.com",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_recruiter_phone": {
            "id": "cover_recruiter_phone",
            "name": "Phone number",
            "type": "cover_recruiter_phone",
            "items": [],
            "item": "+111 1111 1111",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "title_candidate_information": {
            "id": "title_candidate_information",
            "name": "Candidate Information",
            "type": "cover_recruiter_phone",
            "items": [],
            "item": "candidate",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_candidate_summary": {
            "id": "cover_candidate_summary",
            "name": "Candiate Sumary",
            "type": "cover_agency_name",
            "items": [],
            "item": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_candidate_name": {
            "id": "cover_candidate_name",
            "name": "Candiate Name",
            "type": "cover_agency_name",
            "items": [],
            "item": "Maxim",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_email": {
            "id": "cover_candidate_email",
            "name": "Candiate Email",
            "type": "cover_agency_name",
            "items": [],
            "item": "maxim@outlook.com",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_phone": {
            "id": "cover_candidate_phone",
            "name": "Candiate Phone",
            "type": "cover_agency_name",
            "items": [],
            "item": "+8512323456",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_candidate_website": {
            "id": "cover_candidate_website",
            "name": "Candiate Website",
            "type": "cover_agency_name",
            "items": [],
            "item": "https://sample.com",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_current_organization": {
            "id": "cover_current_organization",
            "name": "Current Organization",
            "type": "cover_agency_name",
            "items": [],
            "item": "The Madison Commons",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },
        "cover_current_position": {
            "id": "cover_current_position",
            "name": "Current Postion",
            "type": "cover_agency_name",
            "items": [],
            "item": "Position",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_current_salary": {
            "id": "cover_current_salary",
            "name": "Current Salary",
            "type": "cover_agency_name",
            "items": [],
            "item": "100",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_date_of_availability": {
            "id": "cover_date_of_availability",
            "name": "Date of Availability",
            "type": "cover_agency_name",
            "items": [],
            "item": "2023-11-15",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_target_income": {
            "id": "cover_target_income",
            "name": "Target Infome",
            "type": "cover_agency_name",
            "items": [],
            "item": "type...",
            "columns": 1,
            "isUppercase": true,
            "visible": true
        },

        "cover_work_visa_status": {
            "id": "cover_work_visa_status",
            "name": "Work Visa Status",
            "type": "cover_agency_name",
            "items": [],
            "item": "visa",
            "columns": 1,
            "isUppercase": true,
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
            format: 'M.D.YYYY',
        },
        page: {
            format: 'A4',
        },
        hasCover: 1,
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
                    'cover_candidate_name',
                    'cover_candidate_email',
                    'cover_candidate_phone',
                    'cover_candidate_website',
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
    covermetadata: {
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
            format: 'M.D.YYYY',
        },
        page: {
            format: 'A4',
        },
        hasCover: 1,
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
                    'cover_candidate_name',
                    'cover_candidate_email',
                    'cover_candidate_phone',
                    'cover_candidate_website',
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

export const parsingResume = { 
    basic_info: { 
        first_name: "Jahngeer", 
        last_name: "Ejaz", 
        full_name: "Jahngeer Ejaz", 
        email: "jejaz917@gmail.com", 
        phone_number: "(562) 405-7513", 
        location: { 
            address: "11129 Candor Street", 
            city: "Cerritos", 
            zip_code: "90703", 
            region: "CA", 
            country: "USA" 
        }, 
        
        websites: [], 
        summary_description: "To secure a permanent job position effectively utilizing my relevant business management, strong communication, and technical skills", 
        current_title: "", 
        current_org: "", 
        work_years: "3" 
    }, 
    education: "Education", 
    
    skills: [
        "Business management skills to promote business", 
        "Effectively listen and carry out orders in a timely manner", 
        "Relate to, as well as connect with, clients on a professional and personal level", 
        "MS Office 2003 - 2009, MS Excel 2003-2009, MS PowerPoint 2003-2009 experience", 
        "Typing Rate: 100 words per minute", "Multi-line phone line & multi-tasking", 
        "Accurate data-entry", 
        "Familiarity using Airline Booking Software (Sabre Airline Solutions)"
    ], 
    
    strength_areas: [], 
    work_history: [
        { 
            organization: "International Travel Center", 
            location: "Cerritos, CA, USA", 
            positions: [
                { 
                    title: "Salesperson/Travel Agent", 
                    start_date: "June 2009", 
                    end_date: "July 2012", 
                    responsibilities: [
                        "Spoke to customer\\u2019s face to face, via email, and over the phone to promote and assist in booking flights, hotels, and transportation arrangements in a fast-paced environment", "Utilized Business Management skills to maximize customer satisfaction", "Used specialized software called Sabre Airline Solutions", "Provided accurate information regarding passenger inquiries"
                    ] 
                }
            ] 
        }, 
        
        { organization: "King City Auto Trader", 
        location: "Cerritos, CA, USA", 
        positions: [
            { 
                title: "Automobile Sales", 
                start_date: "August 2012", 
                end_date: "December 2012", 
                responsibilities: [
                    "Effectively promoted business by marketing and promoting used cars", 
                    "Communicated with buyer to meet needs", "Handled paperwork of car sales"
                ] 
            }
        ] 
    }
], 

awards_honors: [], 
certifications: [], 
activities: [
    "Habitat for Humanity \\u2013 Volunteer", 
    "Business Admin Club\\u2013 Active Member"
 ], 
 references: [], 
 region: "California", 
 country: "United States" 
}