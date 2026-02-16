import multer from "multer";
import { Request } from "express";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "uploads");
    },
    filename: (_req, file, cb) => {
      console.log("file_multer:", file);
      console.log("req.body_multer:", _req.body);
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const { language } = req.query;

    const isValid =
      !!MIME_TYPE_MAP[
        file.mimetype
      ]; /* !! converts undefined to false, one of MIME_TYPE_MAP to true */
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error(
        language === "en" ? "Invalid mime type!" : "Niewłaściwy typ mime"
      ));
    }
    /* we have to call this callback with an error, if validation failed, as a first argument or with null as a first argument if it succeeded */
  },
}).fields([
  { name: "images", maxCount: 2 },
  { name: "banners", maxCount: 1 },
]);

export default fileUpload;
