import multer from "multer";

const storage = multer.memoryStorage();  // 🔥 Render Safe – No temp files

export const upload = multer({ storage });
