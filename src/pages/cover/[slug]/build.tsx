import { NextPage, GetServerSideProps } from "next";
import UserLayout from "~/components/layout/UserLayout";
import LeftSidebar from "~/components/resume/build/LeftSidebar/LeftSidebar";
import RightSidebar from '~/components/resume/build/RightSidebar/RightSidebar';
import Center from "~/components/resume/build/Center/Center";
import { useAppDispatch } from "~/store/hooks";
import { setResume } from "~/store/resume/resumeSlice";
import isEmpty from 'lodash/isEmpty';
<<<<<<< HEAD
import { Resume } from "~/schema";
import { TemplateType } from "~/constants";


const defaultCSS = `/* Enter custom CSS here */

* {
    outline: 1px solid #000;
}`;

export const defaultResumeState: Resume = {
    id: 1,
    type: TemplateType.COVER,
    shortId: '2323',
    name: 'first cover',
    slug: 'first-cover',
    image: '/images/templates/covers/1.jpg',
    userid: 'clod19f1p0000vj0o5yxuk7fd',

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
                section: 1,
                subtitle: 1,
                text: 1
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


const cover: Resume = defaultResumeState;


=======
import { api } from "~/utils/api";
>>>>>>> main

type QueryParams = {
    slug: string
}

type Props = {
    slug: string,
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const { slug } = query as QueryParams;
    return {
        props: { slug }
    }
};

const Build: NextPage<Props> = ({ slug }) => {
    const dispatch = useAppDispatch();
    const {
        data: cover,
        isLoading,
        refetch
    } = api.resume.getResumeBySlug.useQuery({ slug: slug });

    if (!cover || isEmpty(cover)) return null;
    dispatch(setResume(cover));

    return (
        <UserLayout>
            <div style={{ position: 'relative' }}>
                <LeftSidebar />
                <Center />
                <RightSidebar />
            </div>
        </UserLayout>
    )
};

export default Build;