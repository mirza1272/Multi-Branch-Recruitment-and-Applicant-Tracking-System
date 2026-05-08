import multer from "multer";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../constants.js";
import ApiError from "../utils/ApiError.js";

// Use memory storage so we can pipe the buffer directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log(`📎 File received: ${file.fieldname}`);
  console.log(`   - Name: ${file.originalname}`);
  console.log(`   - MIME: ${file.mimetype}`);
  console.log(`   - Size: ${file.size} bytes`);
  
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    console.log(`   ✅ MIME type accepted`);
    cb(null, true);
  } else {
    console.log(`   ❌ MIME type rejected. Allowed: ${ALLOWED_FILE_TYPES.join(", ")}`);
    cb(
      new ApiError(400, `Invalid file type: ${file.mimetype}. Only PDF and DOCX files are allowed.`),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
