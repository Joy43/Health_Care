import bcrypt from "bcrypt";
import { Admin, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../helpars/fileUploader";
import { IFile } from "../../interface/file";
import { Request } from "express";



const createAdmin = async (req: Request): Promise<Admin> => {

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

export const userService = {
    createAdmin,
};
