import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import { patientFilterableFields } from './patient.constant';
import pick from '../../shared/pick';
import { PatientService } from './patient.service';
import sendResponse from '../../shared/sendResponse';
import status from 'http-status';


const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, patientFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

  const result = await PatientService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: 'Patient retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;
  const result = await PatientService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: 'Patient retrieval successfully',
    data: result,
  });
});

// ---------------- updateIntoDB----------------
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: 'Patient updated successfully',
    data: result,
  });
});

// --------------deleteFromDB--------
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.deleteFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: 'Patient deleted successfully',
    data: result,
  });
});

// --------------softDelete--------

const softDelete = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PatientService.softDelete(id);
  sendResponse(res, {
    statusCode: status.OK,
    sucess: true,
    message: 'Patient soft deleted successfully',
    data: result,
  });
});

export const PatientController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  softDelete,
  deleteFromDB

};