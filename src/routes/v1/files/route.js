import { Router } from 'express';
import { validator, ValidationSource } from 'middlewares/validator';
import FileController from './controller';
import schema from './schema';
import { uploadFileHandler } from 'helpers';

const router = Router();

router.get('/', validator(schema.getFiles, ValidationSource.QUERY), FileController.getFiles);

router.post('/upload', uploadFileHandler([{ name: 'file' }]), validator(schema.uploadFile), FileController.uploadFile);

router.put('/update', uploadFileHandler([{ name: 'file' }]), validator(schema.updateFile), FileController.updateFile);

router.put('/rename', validator(schema.renameFile), FileController.renameFile);

router.delete('/delete', validator(schema.deleteFile), FileController.deleteFile);

router.get('/:fileId', validator(schema.getFileById, ValidationSource.PARAM), FileController.getFileById);

router.get('/:fileId/versions', validator(schema.getFileVersions, ValidationSource.PARAM), FileController.getFileVersions);

router.get('/:fileId/versions/:version', validator(schema.getFileByVersion, ValidationSource.PARAM), FileController.getFileByVersion);

export default router;