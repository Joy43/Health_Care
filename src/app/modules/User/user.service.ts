import bcrypt from "bcrypt";
import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import prisma from '../../shared/prisma';
import { fileUploader } from "../../helpars/fileUploader";
import { IFile } from "../../interface/file";
import { Request, Response } from "express";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helpars/PaginationHelper";
import { userSearchAbleFileds } from "./user.constant";

import { IAuthUser } from "../../interface/authuser";



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

//---------------  get all users --------------------

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

    // -------------const filterData ------------------
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
        },
        // ----------response data show & passowrd hide ---------
          select:{
         id:true,
         email:true,
         role:true,
         needPasswordChange:true,
         status:true,
         createdAt:true,
         updatedAt:true,
         admin:true,
         patient:true,
         doctor:true
          },
        //   include:{
        //     admin:true,
        //     patient:true,
        //     doctor:true
        //   }
        
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
// ---------------change status----------
const changeProfileStatus = async (id: string, status: UserRole) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
};

// ----------GET mYPROFILE---------------

const getMyProfile=async(user:IAuthUser)=>{
const userInfo=await prisma.user.findUniqueOrThrow({
    where:{
        email: user?.email ?? '',

    },
    select:{
        id:true,
        email:true,
        needPasswordChange:true,
        role:true,
        status:true,
        createdAt:true,
         updatedAt:true,
    }
});
let profileInfo;
if(userInfo.role===UserRole.SUPER_ADMIN){
profileInfo=await prisma.admin.findUnique({
    where:{
        email:userInfo.email
    }
})
}
else if(userInfo.role===UserRole.DOCTOR){
    profileInfo=await prisma.admin.findUnique({
        where:{
            email:userInfo.email
        }
    })
}else if(userInfo.role===UserRole.PATIENT){
    profileInfo=await prisma.patient.findUnique({
      where:{
        email:userInfo.email

      }  
    })
}
return {...userInfo,...userInfo};
};

// -------------update my profile--------

const updateMyProfie = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    const file = req.file as IFile;
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    return { ...profileInfo };
}

export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfie
};
