import multer from "multer";

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `Image-${Date.now()}.${ext}`);
    }
})
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new Error('Not an image! Please upload only images.'), false);
};

export const upload = multer({
    fileFilter: multerFilter,
    storage: multerStorage
})