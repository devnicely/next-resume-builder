import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';
import {Request} from 'express'
import nextConnect from "next-connect";
import formidable, { File } from "formidable";


import fs from "fs";
import path from "path";
// Set up the multer storage configuration
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
      // Generate a unique name for the uploaded file
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = file.fieldname + '-' + uniqueSuffix;
      cb(null, filename);
    }
  });

  
// Create the multer instance
const upload = multer({ storage });


// Important for NextJS!
export const config = {
  api: {
    bodyParser: false,
  },
};

function saveFile(file: File, publicFolder: string): string {
    const fileExt = path.extname(file.originalFilename || "");
    const sourcePath = file.filepath;
    let filename = `${file.newFilename}${fileExt}`;

    const sourceStream = fs.createReadStream(sourcePath);
    const destinationStream = fs.createWriteStream(`${publicFolder}/${filename}`);
    
    sourceStream.pipe(destinationStream);
    sourceStream.on('end', () => {
        fs.unlink(sourcePath, (error) => {
          if (error) {
            console.error('Error deleting source file', error);
            filename = "";
          } else {
            console.log('File moved successfully');
          }
        });
      });

      return filename;

  }

  export type FormidableParseReturn = {
    fields: formidable.Fields;
    files: formidable.Files;
  };
  
  export async function parseFormAsync(
    req: NextApiRequest,
    formidableOptions?: formidable.Options
  ): Promise<FormidableParseReturn> {
    const form = formidable(formidableOptions);
  
    return await new Promise<FormidableParseReturn>((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          reject(err);
        }
  
        resolve({ fields, files });
      });
    });
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { fields, files } = await parseFormAsync(req);
        // Files are always arrays (formidable v3+)
        const myfile = (files["file"] as any as File[])[0];
        let filename = "";
        if (myfile){
           filename = saveFile(myfile, "./public/uploads");
        }
        res.status(200).json({filename});
    } catch (error) {
      // Handle any errors that occurred during the file upload
      console.error(error);
      res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }
  }

