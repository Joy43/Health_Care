import { Patient, Prisma, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helpars/PaginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import { patientSearchableFields } from "./patient.constant";
import prisma from "../../shared/prisma";
import { IPatientFilterRequest, IPatientUpdate } from "./patient.interface";

const getAllFromDB = async (
    filters: IPatientFilterRequest,
    options: IPaginationOptions,
  ) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
  
    const andConditions = [];
  
    if (searchTerm) {
      andConditions.push({
        OR: patientSearchableFields.map(field => ({
          [field]: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        })),
      });
    }
  
    if (Object.keys(filterData).length > 0) {
      andConditions.push({
        AND: Object.keys(filterData).map(key => {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }),
      });
    }
    andConditions.push({
      isDeleted: false,
    });
  
    const whereConditions: Prisma.PatientWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};
  
    const result = await prisma.patient.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : {
            createdAt: 'desc',
          },
      include: {
        medicalReport: true,
        patientHealthData: true,
      }
    });
    const total = await prisma.patient.count({
      where: whereConditions,
    });
  
    return {
      meta: {
        total,
        page,
        limit,
      },
      data: result,
    };
  };
//   -------get patient by id---------
  const getByIdFromDB = async (id: string): Promise<Patient | null> => {
    const result = await prisma.patient.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      include: {
        medicalReport: true,
        patientHealthData: true,
      },
    });
    return result;
  };
// ------------update patient---------

/* 

১. আগে রোগী খুঁজে বের করা হয়।
২. ট্রান্সাকশনের মধ্যে রোগীর তথ্য আপডেট করা হয়।
৩. যদি নতুন হেলথ ডেটা থাকে, সেটা আপডেট/ক্রিয়েট করা হয়।
৪. যদি মেডিক্যাল রিপোর্ট থাকে, সেটা নতুন করে যোগ করা হয়।
৫. সবশেষে আপডেট হওয়া ডেটা আবার রিটার্ন করা হয়।
*/
const updateIntoDB = async (id: string, payload: Partial<IPatientUpdate>): Promise<Patient | null> => {

    const { patientHealthData, medicalReport, ...patientData } = payload;
  
    const patientInfo = await prisma.patient.findUniqueOrThrow({
      where: {
        id,
        isDeleted: false
      }
    });
  
    await prisma.$transaction(async (transactionClient) => {
      //update patient data
      await transactionClient.patient.update({
        where: {
          id
        },
        data: patientData,
        include: {
          patientHealthData: true,
          medicalReport: true
        }
      });
  
      // create or update patient health data
      if (patientHealthData) {
        await transactionClient.patientHealthData.upsert({
          where: {
            patientId: patientInfo.id
          },
          update: patientHealthData,
          create: { ...patientHealthData, patientId: patientInfo.id }
        });
      };
  // -------------medical report only  create,update(upset)  
  // is not aviable because id not unique (patient one to many realation --------------
      if (medicalReport) {
        await transactionClient.medicalReport.create({
          data: { ...medicalReport, patientId: patientInfo.id }
        })
      }
    })
  
  
    const responseData = await prisma.patient.findUnique({
      where: {
        id: patientInfo.id
      },
      include: {
        patientHealthData: true,
        medicalReport: true
      }
    })
    return responseData;
  
  };
  // ---------------patient service delete-----------
  const deleteFromDB=async(id:string):Promise<Patient | null>=>{
    const result=await prisma.$transaction(async(tx)=>{
      await tx.medicalReport.deleteMany({
        where:{
          patientId:id
        }
      });

      const deletedPatient = await tx.patient.delete({
        where: {
          id
        }
      });
      await tx.user.delete({
        where: {
          email: deletedPatient.email
        }
      });
      return deletedPatient;
    })
    return result;
  }
  // -----------patient soft delete--------------
  const softDelete = async (id: string): Promise<Patient | null> => {
    return await prisma.$transaction(async transactionClient => {
      const deletedPatient = await transactionClient.patient.update({
        where: { id },
        data: {
          isDeleted: true,
        },
      });
  
      await transactionClient.user.update({
        where: {
          email: deletedPatient.email,
        },
        data: {
          status: UserStatus.DELETED,
        },
      });
  
      return deletedPatient;
    });
  };
  export const PatientService={
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDelete
  }