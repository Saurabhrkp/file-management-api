import { createdResponse, successResponse, paginatedResponse } from 'helpers/responses';
import FileService from './service';
import { queryHelper } from 'helpers';
import { BadRequestError } from 'helpers/errors';

class FileController {
  async getFiles(req, res) {
    const { pagination, searching, sorting, filter } = queryHelper(req.query);
    const userId = +res.locals.userId;
    const [files, paginationOptions] = await FileService.getFiles(pagination, searching, sorting, filter, userId);
    return paginatedResponse(res, files, paginationOptions, 'Matched files');
  }

  async uploadFile(req, res) {
    const { name } = req.body;
    if (req.files.file === undefined) throw new BadRequestError('Please upload file');
    const file = req.files.file[0];
    const createdBy = +res.locals.userId;
    const createdFile = await FileService.uploadFile({ name, file }, createdBy);
    return createdResponse(res, { createdFile }, 'Uploaded Successfully');
  }

  async updateFile(req, res) {
    const { fileId } = req.body;
    if (req.files.file === undefined) throw new BadRequestError('Please upload file');
    const file = req.files.file[0];
    const updatedBy = +res.locals.userId;
    const updatedFile = await FileService.updateFile({ fileId: parseInt(fileId), file }, updatedBy);
    return successResponse(res, { updatedFile }, 'Updated file');
  }

  async renameFile(req, res) {
    const { fileId, name, category } = req.body;
    const updatedBy = +res.locals.userId;
    const updatedFile = await FileService.renameFile({ fileId: parseInt(fileId), name, category }, updatedBy);
    return successResponse(res, { updatedFile }, 'Renamed file');
  }

  async deleteFile(req, res) {
    const { fileId } = req.body;
    const deletedBy = +res.locals.userId;
    const deletedFile = await FileService.deleteFile(parseInt(fileId), deletedBy);
    return successResponse(res, { deletedFile }, 'Deleted file');
  }

  async getFileById(req, res) {
    const { fileId } = req.params;
    const createdBy = +res.locals.userId;
    const file = await FileService.getFileById(parseInt(fileId), createdBy);
    return successResponse(res, { file }, 'Found file');
  }

  async getFileVersions(req, res) {
    const { fileId } = req.params;
    const createdBy = +res.locals.userId;
    const fileVersions = await FileService.getFileVersions(parseInt(fileId), createdBy);
    return successResponse(res, { fileVersions }, 'Found file versions');
  }

  async getFileByVersion(req, res) {
    const { fileId, version } = req.params;
    const createdBy = +res.locals.userId;
    const fileVersioned = await FileService.getFileByVersion({ fileId: parseInt(fileId), version: parseInt(version) }, createdBy);
    return successResponse(res, { fileVersioned }, 'File found with version');
  }
};

export default new FileController();