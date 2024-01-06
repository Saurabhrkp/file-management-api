import multer from 'multer';
import cuid from 'cuid';
import { SIZES } from 'configs';
import _ from 'lodash';

export const uploadFileHandler = (feildNames) => (req, res, next) => {
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
    limits: { fileSize: SIZES.FILE_IN_MB * SIZES.BYTES_IN_KILOBYTE * SIZES.KILOBYTES_IN_MEGABYTE },
    fileFilter: (_req, file, next) => {
      const notAllowedMimetypes = ['application/x-msdownload', 'application/x-dosexec', 'application/x-executable', 'application/x-macbinary', 'application/x-sh', 'application/x-bat', 'application/x-msdos-program', 'application/java-archive', 'application/x-php', 'application/x-perl'];
      (!notAllowedMimetypes.includes(file.mimetype)) ? next(null, true) : next(`Invalid file type: ${file.mimetype}. Only audio/video/image/pdf/doc/xlsx files are allowed.`);
    }
  }).fields(feildNames);

  return uploadHandler(req, res, next);
};

export const queryHelper = (query) => {
  const pagination = { startIndex: 0, limit: 50 }; // startIndex, limit
  const searching = { search: '', active: '1', category: '' }; // search
  const sorting = { sort: 'createdOn', sortDirection: 'asc' }; // sort, sortDirection
  const filter = { ids: [], categories: [], mimeTypes: [] };

  for (const key in pagination) {
    if (Object.hasOwnProperty.call(pagination, key)) {
      if (Object.hasOwnProperty.call(query, key))
        pagination[key] = +query[key];
    }
  }
  for (const key in searching) {
    if (Object.hasOwnProperty.call(searching, key)) {
      searching[key] = query[key];
    }
  }
  for (const key in filter) {
    if (Object.hasOwnProperty.call(filter, key)) {
      let values = query[key] || '';
      const ids = values.split(',');
      const validIds = [];
      for (const id of ids) {
        const valid = !_.isEmpty(id);
        if (valid) validIds.push(id);
      }
      filter[key] = validIds;
    }
  }
  for (const key in sorting) {
    if (Object.hasOwnProperty.call(sorting, key)) {
      sorting[key] = query[key];
    }
  }

  return { pagination, searching, sorting, filter };
};