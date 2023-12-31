import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from 'fs';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const jsonDirectory  = path.join(process.cwd(), 'public', 'assets');
    const fileContents = await fs.readFile(jsonDirectory + '/fonts.json', 'utf8');
    res.status(200).json(JSON.parse(fileContents));
}

