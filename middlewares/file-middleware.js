import multer from "multer";

const memoryStorage = multer.memoryStorage();
export const uploadExcel = multer({ storage: memoryStorage });
export default uploadExcel;
