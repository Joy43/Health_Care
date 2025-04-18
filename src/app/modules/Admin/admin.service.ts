import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { equal } from "assert";
import { paginationHelper } from "../../helpars/PaginationHelper";
import { adminSearchableFields } from "./admin.constant";
import prisma from "../../shared/prisma";





const getAllFromDB=async(params:any,options:any)=>{
    const {limit,page,skip}=paginationHelper.calculatePagination(options);
    const{searchTerm,...filterData}=params;
    const andCondions:Prisma.AdminWhereInput[]=[];
  
    if(params.searchTerm){

        andCondions.push({
            OR:adminSearchableFields.map(field => ({
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
                    equals: filterData[key]
                }
            }))
        })

    }

    // ---------deleted true conditoion---

    andCondions.push({
        isDeleted:false
    });
    const whereConditions:Prisma.AdminWhereInput={AND:andCondions}
    const result=await prisma.admin.findMany({
        where:whereConditions,
        skip,
        take:limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
        
    });

    const total=await prisma.admin.count({
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
// -------------get by id -----

const getByIdFromDB=async(id:string):Promise<Admin| null >=>{
    const result=await prisma.admin.findUnique({
        where:{
            id,
            isDeleted:false
        }
    });

return result;
};

// -------------update -------------
const UpdateAdminFromBD=async(id:string,data:Partial<Admin>):Promise<Admin| null >=>{

    const isExist=await prisma.admin.findUniqueOrThrow({
        where:{
            id,
            isDeleted:false
        }
 
    });

    const result=await prisma.admin.update({
        where:{
            id
        },
        data
    });
    return result;
    
};
// --------DELETE ADMIN----------------

const DeleteFromDB=async(id:string)=>{
    
    // error handle not found id
await prisma.admin.findUniqueOrThrow({
    where:{
        id
    }
});
    const result=await prisma.$transaction(async(transtionClient)=>{
        // -------admin
        const adminDeletedData=await transtionClient.admin.update({
            where:{
                id
            },
            data:{
                isDeleted:true
            }
        });
        // -------user ---------
       await transtionClient.user.update({
            where:{
                email:adminDeletedData.email
            },
            data:{
                status:UserStatus.DELETED
            }
        });
         return adminDeletedData;
    })
    return result;
}
// ----------soft delete--------
const SoftDeleteFromDB=async(id:string):Promise<Admin | null> =>{
    
    // error handle not found id
await prisma.admin.findUniqueOrThrow({
    where:{
        id,
        isDeleted:false
    }
});
    const result=await prisma.$transaction(async(transtionClient)=>{
        // -------admin
        const adminDeletedData=await transtionClient.admin.update({
            where:{
                id
            },
            data:{
                isDeleted:true
            }
        });
        // -------user ---------
        await transtionClient.user.update({
            where:{
                email:adminDeletedData.email
            },
            data:{
                status:UserStatus.DELETED
            }
        });
         return adminDeletedData;
    })
    return result;
}

export const adminService={
    getAllFromDB,
    getByIdFromDB,
    UpdateAdminFromBD,
    DeleteFromDB,
    SoftDeleteFromDB
}