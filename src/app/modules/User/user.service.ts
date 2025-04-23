import bcrypt from "bcrypt";
import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import prisma from '../../shared/prisma';
import { fileUploader } from "../../helpars/fileUploader";
import { IFile } from "../../interface/file";
import { Request } from "express";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helpars/PaginationHelper";
import { userSearchAbleFileds } from "./user.constant";


// ------------create admin-------------

const createAdmin = async (req: Request): Promise<Admin> => {

    // --------file upload functionality---------------
    const file = req.file as IFile;
    console.log("Uploaded File:", req.file);

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
      
console.log("Cloudinary Response:", uploadToCloudinary);

    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {

        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
       
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};
// ---------------- create Doctor data------------
const createDoctor = async (req: Request): Promise<Doctor> => {

    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};
// ----------create patient---------
const createPatient = async (req: Request): Promise<Patient> => {
    const file = req.file as IFile;

    if (file) {
        const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });

        return createdPatientData;
    });

    return result;
};

// get all users

const getAllFromDB=async(params:any, options:IPaginationOptions)=>{
    const {limit,page,skip}=paginationHelper.calculatePagination(options);
    const{searchTerm,...filterData}=params;
    const andCondions:Prisma.UserWhereInput[]=[];
  
    if(params.searchTerm){

        andCondions.push({
            OR:userSearchAbleFileds.map(field => ({
                [field]: {
                contains: params.searchTerm,
                mode: 'insensitive'
                }
            }))
        });
 
    };

    // const filterData: Record<string, any> = {}; 
    if(Object.keys(filterData).length>0){
        andCondions.push({
            AND:Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })

    }

    // ---------deleted true conditoion---

    // andCondions.push({
    //     isDeleted:false
    // });
    const whereConditions:Prisma.UserWhereInput=andCondions.length>0?{AND:andCondions}:{}
    const result=await prisma.user.findMany({
        where:whereConditions,
        skip,
        take:limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
        
    });

    const total=await prisma.user.count({
        where:whereConditions
    })
    return {
        meta:{
            page,
            limit,
            total
        },
        data:result
    };
};
export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB
};
