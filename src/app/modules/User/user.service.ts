import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";



const createAdmin = async (data: any) => {
    const hashedPassword: string = await bcrypt.hash(data.password, 12);

    const userData = {
        email: data.admin.email,
        password: hashedPassword, 
        role: UserRole.ADMIN
    };

    const adminData = {
        name: data.admin.name,
        email: data.admin.email,
        contactNumber: data.admin.contactNumber
       
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createAdminData = await transactionClient.admin.create({
            data: adminData
        });

        return createAdminData;
    });

    return result;
};

export const userService = {
    createAdmin,
};
