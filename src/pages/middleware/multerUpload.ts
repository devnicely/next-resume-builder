import multer from 'multer';
import type { NextApiRequest, NextApiResponse } from 'next';

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

// Define the API route handler
const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Access the uploaded file using req.file
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the file details
    return res.status(200).json({
      message: 'File uploaded successfully',
      filename: uploadedFile.filename,
      size: uploadedFile.size
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error uploading file' });
  }
};

export default upload.single('file')(apiHandler);
