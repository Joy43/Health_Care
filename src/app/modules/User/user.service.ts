import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { UserRole } from "../../../generated/prisma";

const prisma = new PrismaClient();

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
        // profilePhoto: data.admin.profilePhoto || null,
        contactNumber: data.admin.contactNumber
        // include any other required fields
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
