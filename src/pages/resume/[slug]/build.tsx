import { NextPage, GetServerSideProps } from "next";
import UserLayout from "~/components/layout/UserLayout";
import LeftSidebar from "~/components/resume/build/LeftSidebar/LeftSidebar";
import RightSidebar from '~/components/resume/build/RightSidebar/RightSidebar';
import Center from "~/components/resume/build/Center/Center";
import { useAppDispatch } from "~/store/hooks";
import { setResume } from "~/store/resume/resumeSlice";
import isEmpty from 'lodash/isEmpty';
import { api } from "~/utils/api";
import { Resume } from "~/schema";

type QueryParams = {
    slug: string
}

type Props = {
    slug: string,
};

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
            "id": 'candiate_summary',
            "name": "Candidate Summaryddd",
            "type": "candidate_summary",
            "columns": 1,
            "visible": true,
            "items": [],
            "item": "This is the summary part."
        },
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
            "type": "work",
            "items": [],
            "item": "Breaking coverage, Feature writing, Investigative, reporting, Interviewing, Research, Fact-checking, Copy editing, AP Style, Leadership, Mentoring, Training, Headlines, Cutlines, Digital Photo",
            "columns": 1,
            "visible": true
        },
        "awards": {
            "id": "awards",
            "name": "Awards",
            "type": "work",
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


export const getServerSideProps: GetServerSideProps<Props> = async ({query}) => {
    const {slug} = query as QueryParams;    
    return {
        props: {slug}
    }
};

const Build: NextPage<Props> = ({slug}) => {
    const dispatch = useAppDispatch();

    const {
        data: resume,
        isLoading,
        refetch
    } = api.resume.getResumeBySlug.useQuery({slug: slug});

    if (!resume || isEmpty(resume)) return null;
    
    dispatch(setResume(defaultResumeState));

    return(
        <UserLayout>
            <div style={{position: 'relative'}}>
                <LeftSidebar/>
                <Center/>
                <RightSidebar />
            </div>
        </UserLayout>
    )
};

export default Build;