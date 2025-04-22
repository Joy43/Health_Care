import { UserStatus } from "@prisma/client";
import prisma from '../../shared/prisma';
import bcrypt from 'bcrypt';
import { jwtHelpers } from "../../helpars/jwthelpar";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import status from "http-status";
// -------------login user-----------------
const LoginUser=async(payload:{
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }
    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );



    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };

    
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};


const changePassword=async(user:any,payload:any)=>{
    const userData=await prisma.user.findUniqueOrThrow({
        where:user.email
    });

    const isCorrectPassword:boolean=await bcrypt.compare(payload.password,userData.password)
    if(!isCorrectPassword){
        throw new ApiError(status.FORBIDDEN,"password incorrect");
       

    };
    const hashedPassword:string=await bcrypt.hash(payload.newPassword,12)
    await prisma.user.update({
        where:{
            email:userData.email,
            status:UserStatus.ACTIVE
        },
        data:{
            password:hashedPassword,
            needPasswordChange:false
        }
    })

};
// --------- forgot password---------
const forgotPassword=async(payload:{email:string})=>{
    const userData=await prisma.user.findFirstOrThrow({
        where:{
        email:payload.email,
        status:UserStatus.ACTIVE
        }
    });
    // ------token generate----------
    const resetPassToken=jwtHelpers.generateToken(
        {email:userData.email,role:userData.role},
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    )
    console.log(resetPassToken);

    const resetPassLink=config.reset_pass_link + `?email=${userData.id}&token=${resetPassToken}`;
    console.log(resetPassToken);

};

export const Authservice={
    LoginUser,
    refreshToken,
    changePassword,
    forgotPassword


}