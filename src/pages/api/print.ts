import { NextApiRequest, NextApiResponse } from "next";

import { PDFDocument } from 'pdf-lib';
import { BrowserContext, chromium } from 'playwright-chromium';

const minimal_chromium_args = [
    '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
  ];


  async function scrapeData() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
  
    try {
      const page = await context.newPage();
      await page.goto('https://example.com');
  
      // Your Playwright logic here
  
      const title = await page.title();
      console.log('Page title:', title);
  
      return { title };
    } finally {
      await browser.close();
    }
  }
  
  

  export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const browser: BrowserContext = new BrowserContext();

    res.status(200).json({});
  }

