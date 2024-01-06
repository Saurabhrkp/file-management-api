import _ from 'lodash';
import fs from 'fs';
import db from 'services/prisma';
import { NotFoundError } from 'helpers/errors';

class FileService {
  async getFiles(pagination, searching, sorting, filter, userId) {
    const { startIndex = 0, limit = 10 } = pagination;
    const { search, category } = searching;
    const { sort = 'createdOn', sortDirection = 'asc' } = sorting;
    const { ids, categories, mimeTypes } = filter;

    let orderBy = { [sort]: sortDirection };
    let searchQuery = {};
    let searchCategory = {};
    let searchID = {};
    let searchCategories = {};
    let searchMimeType = {};

    if (search) searchQuery = { name: { contains: search } };
    if (category) searchCategory = { category: { contains: category } };
    if (ids.length > 0) searchID = { id: { in: ids } };
    if (categories.length > 0) searchCategories = { category: { in: categories } };
    if (mimeTypes.length > 0) searchMimeType = { mimeType: { in: mimeTypes } };

    const [files, totalCount] = await db.$transaction([
      db.file.findMany({ where: { ...searchQuery, ...searchCategory, ...searchID, ...searchCategories, ...searchMimeType, userId }, skip: startIndex, take: limit, orderBy }),
      db.file.count({ where: { ...searchQuery, ...searchCategory, ...searchID, ...searchCategories, ...searchMimeType, userId } })
    ]);

    const pageCount = Math.ceil(totalCount / limit);
    const paginationOptions = { totalCount, pageCount, startIndex, limit };

    return [files, paginationOptions];
  }

  async uploadFile(body, createdBy) {
    const { name, file, category } = body;

    // Get the file data from the file object
    const { filename, originalname, mimetype, size, path } = file;
    // Set the initial file category as 'Uncategorized'
    const fileData = { category: 'Uncategorized', user: { connect: { id: createdBy } } };
    if (category) fileData.category = category;

    const createdFile = await db.$transaction(async tx => {
      const file = await tx.file.create({ data: { name, originalname, mimetype, path, size, ...fileData } });
      await tx.fileVersion.create({ data: { path, file: { connect: { id: file.id } } } });
      return file;
    });

    return createdFile;
  }

  async updateFile(body, updatedBy) {
    const { fileId, file } = body;
    const { filename, originalname, mimetype, size, path } = file;

    const checkUserFile = await db.file.findUnique({ where: { userId: updatedBy, id: fileId } });
    if (!checkUserFile) {
      // Wait for the file to be deleted
      await fs.promises.unlink(path);
      return new NotFoundError('Unable to found file to update or no access');
    }
    const oldFileVersion = await db.fileVersion.aggregate({ where: { fileId }, _max: { version: true } });
    const newVersion = oldFileVersion._max.version + 1;

    const updatedFile = await db.$transaction(async tx => {
      const file = await tx.file.update({ data: { originalname, mimetype, size, path }, where: { id: fileId } });
      await tx.fileVersion.create({ data: { path, version: newVersion, file: { connect: { id: file.id } } } });
      return file;
    });

    return updatedFile;
  }

  async renameFile(body, updatedBy) {
    const { fileId, name, category } = body;

    const checkUserFile = await db.file.findUnique({ where: { userId: updatedBy, id: fileId } });
    if (!checkUserFile) return new NotFoundError('Unable to found file to update or no access');

    const fileData = { category: undefined, name: undefined };
    if (category) fileData.category = category;
    if (name) fileData.name = name;

    const updatedFile = await db.file.update({ data: { ...fileData }, where: { id: fileId } });

    return updatedFile;
  }

  async deleteFile(fileId, deletedBy) {
    const checkUserFile = await db.file.findUnique({ where: { userId: deletedBy, id: fileId } });
    if (!checkUserFile) return new NotFoundError('Unable to find file to update or no access');

    const deletedFile = await db.file.update({ data: { active: false, deletedOn: new Date() }, where: { id: fileId } });
    return deletedFile;
  }

  async getFileById(fileId, createdBy) {
    const file = await db.file.findUnique({ where: { userId: createdBy, id: fileId, active: true } });
    if (!file) return new NotFoundError('Unable to find file, deleted or no access');

    return file;
  }

  async getFileVersions(fileId, createdBy) {
    const file = await db.file.findUnique({ where: { userId: createdBy, id: fileId } });
    if (!file) return new NotFoundError('Unable to find file, deleted or no access');

    const fileVersions = await db.fileVersion.findMany({ where: { fileId } });
    return fileVersions;
  }

  async getFileByVersion(body, createdBy) {
    const { fileId, version } = body;

    const file = await db.file.findUnique({ where: { userId: createdBy, id: fileId } });
    if (!file) return new NotFoundError('Unable to find file, deleted or no access');

    const fileVersioned = await db.fileVersion.findMany({ where: { fileId, version } });
    return fileVersioned;
  }
}

export default new FileService();