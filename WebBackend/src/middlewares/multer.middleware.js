import multer from "multer";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../constants.js";
import ApiError from "../utils/ApiError.js";

// Use memory storage so we can pipe the buffer directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(400, "Invalid file type. Only PDF and DOCX files are allowed."),
      false
    );
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
