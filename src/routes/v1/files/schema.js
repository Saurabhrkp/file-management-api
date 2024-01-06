import Joi from 'joi';

export default {
  getFiles: Joi.object().keys({
    startIndex: Joi.string().optional(),
    limit: Joi.string().optional(),
    search: Joi.string().optional(),
    category: Joi.string().optional(),
    ids: Joi.string().optional(),
    categories: Joi.string().optional(),
    mimeTypes: Joi.string().optional(),
    sort: Joi.string().optional(),
    sortDirection: Joi.string().optional(),
  }),
  uploadFile: Joi.object().keys({
    name: Joi.string().required().min(2),
    category: Joi.string().optional().min(2)
  }),
  updateFile: Joi.object().keys({
    fileId: Joi.number().required()
  }),
  renameFile: Joi.object().keys({
    fileId: Joi.number().required(),
    name: Joi.string().optional().min(2),
    category: Joi.string().optional().min(2)
  }),
  deleteFile: Joi.object().keys({
    fileId: Joi.number().required()
  }),
  getFileById: Joi.object().keys({
    fileId: Joi.number().required()
  }),
  getFileVersions: Joi.object().keys({
    fileId: Joi.number().required()
  }),
  getFileByVersion: Joi.object().keys({
    fileId: Joi.number().required(),
    version: Joi.number().required()
  })
};