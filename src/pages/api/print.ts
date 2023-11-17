import { mkdir, writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

import { PDFDocument } from 'pdf-lib';
import { BrowserContext, chromium } from 'playwright-chromium';
import { PageConfig } from "~/schema";
import puppeteer from 'puppeteer'
import dayjs from "dayjs";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {id} = req.query;
  
  // Get the current date
  const currentDate = new Date();

  const formattedDate = dayjs.utc(currentDate).format('yyyy-MM-dd_HH-mm-ss');
  const directory = './public/assets/exports';
  const filename = `PDFExport_${formattedDate}.pdf`;
  const publicUrl = `${process.env.NEXT_PUBLIC_DEV_URL}assets/exports/${filename}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/resuming/${id}/printer`, { waitUntil: 'networkidle2' });

  await page.pdf({ path: `${directory}/${filename}`, format: 'A4' });
  await browser.close();

  res.status(200).json(publicUrl);
}

