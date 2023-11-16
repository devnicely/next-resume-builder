export type Location = {
    address: string;
    city: string;
    zip_code: string;
    region: string;
    country: string;
}

export type BasicInfo = {
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone_number: string;
    location: Location;
    websites: string[];
    summary_description: string;
    current_title: string;
    current_org: string;
    work_years: string;
}

export type Education = {
    institution: string;
    location: string;
    degree: string;
    start_date: string;
    end_date: string;
    majors: string;
    GPA: string;
}

type Position = {
    title: string;
    start_date: string;
    end_date: string;
    responsibilities: string[]
}

type WorkHistory = {
    organization: string,
    location: string,
    positions: Position[],
}


export type ParsedResume = {
    basic_info?: BasicInfo;
    education?: Education[];
    work_history?: WorkHistory[];
    skills? : string[];
    activities? : string[];
}