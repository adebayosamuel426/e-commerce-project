import multer from 'multer';

// uploading the files in memory instead of disk
const storage = multer.memoryStorage();


//  Move `fileFilter` **above** `multer` configuration
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    if (allowedTypes.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
    }
};
// Multer upload instance
export const upload = multer({ storage, fileFilter });