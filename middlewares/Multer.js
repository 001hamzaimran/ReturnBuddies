import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Make sure directory exists or create it
const dir = 'public/images';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if the directory   exists
    if (!fs.existsSync(dir)) {
      // Create the directory recursively if it doesn't exist
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as Buffer
});

