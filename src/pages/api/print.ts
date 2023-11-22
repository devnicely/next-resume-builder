import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from 'puppeteer'
import dayjs from "dayjs";
import path from "path";
import fs from 'fs';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Get the current date
  const currentDate = new Date();

  try {
    const folderPath = path.join(process.cwd(), 'public', 'assets/exports');
    if (!fs.existsSync(folderPath)) {
      // If not, create the folder
      fs.mkdirSync(folderPath);
    }

    const formattedDate = dayjs.utc(currentDate).format('yyyy-MM-dd_HH-mm-ss');
    const directory = path.join(process.cwd(), 'public', 'assets/exports');
    const filename = `PDFExport_${formattedDate}.pdf`;
    const publicUrl = `${process.env.NEXT_PUBLIC_DEV_URL}assets/exports/${filename}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${process.env.NEXT_PUBLIC_DEV_URL}resuming/${id}/printer`, { waitUntil: 'networkidle2' });

    await page.pdf({ path: `${directory}/${filename}`, format: 'A4' });
    await browser.close();

    res.status(200).json(publicUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to download pdf.' });
  }
}

