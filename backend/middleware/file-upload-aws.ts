import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const fileUpload = upload.single("images");

const fileUpload = upload.fields([
  { name: "images", maxCount: 2 },
  { name: "banners", maxCount: 1 },
]);

export default fileUpload;
