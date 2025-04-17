import { Prisma, PrismaClient } from "@prisma/client";
import { equal } from "assert";
import { paginationHelper } from "../../helpars/PaginationHelper";
import { adminSearchableFields } from "./admin.constant";


const prisma=new PrismaClient();


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
    return {
        meta:{
            page,
            limit
        },
        data:result
    };
}
export const adminService={
    getAllFromDB
}