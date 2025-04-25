import { Request } from "express"
import { IFile } from "../../interface/file"
import { fileUploader } from "../../helpars/fileUploader";
import prisma from "../../shared/prisma";
import catchAsync from "../../shared/catchAsync";
// -----------------Get---------------
const insertIntoDB=async(req:Request)=>{
 const file=req.file as IFile;
 if(file){
    const uploadToCloudanry=await fileUploader.uploadToCloudinary(file);
    req.body.icon=uploadToCloudanry?.secure_url;
 };
const result=await prisma.specialties.create({
    data:req.body
});
return result;
};

// ---------get specilist data-------------

const GetSpecialties=async()=>{
   console.log(GetSpecialties) 
   const result=await prisma.specialties.findMany();
   return result;
};

// -----------delete specific id-----

const DeleteSpecialties=async(id:string)=>{
  
    const result=await prisma.specialties.delete({
        where:{id}
    }
        
    )
    return result;
}
export const SpecialtiesService={
    insertIntoDB,
    GetSpecialties,
    DeleteSpecialties
}