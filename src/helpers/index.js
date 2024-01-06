import multer from 'multer';
import cuid from 'cuid';
import { SIZES } from 'configs';

export const uploadMediaHandler = (feildNames) => (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
      callback(null, './uploads/'); // specify the path to save files
    },
    filename: (_req, file, callback) => {
      const uniqueId = cuid(); // generate a unique ID for each file
      const fileExtension = file.originalname.split('.').pop();
      callback(null, `${uniqueId}.${fileExtension}`); // rename the file
    }
  });

  const uploadHandler = multer({
    storage: storage,
    limits: { fileSize: SIZES.MEDIA_IN_MB * SIZES.BYTES_IN_KILOBYTE * SIZES.KILOBYTES_IN_MEGABYTE },
    fileFilter: (_req, file, next) => {
      const notAllowedMimetypes = ['application/x-msdownload', 'application/x-dosexec', 'application/x-executable', 'application/x-macbinary', 'application/x-sh', 'application/x-bat', 'application/x-msdos-program', 'application/java-archive', 'application/x-php', 'application/x-perl'];
      (!notAllowedMimetypes.includes(file.mimetype)) ? next(null, true) : next(`Invalid file type: ${file.mimetype}. Only audio/video/image/pdf/doc/xlsx files are allowed.`);
    }
  }).fields(feildNames);

  return uploadHandler(req, res, next);
};