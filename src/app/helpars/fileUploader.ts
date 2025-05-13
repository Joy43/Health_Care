import multer from "multer"
import path from "path"
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary';
import { ICloudinaryResponse, IFile } from "../interface/file";



cloudinary.config({
    cloud_name: 'dcdserdv3',
    api_key: '348855398637349',
    api_secret: 'X7oBgvS4MKmeNdxX0UHG56S2nl0'
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: IFile): Promise<ICloudinaryResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.path,
            (error: Error, result: ICloudinaryResponse) => {
                fs.unlinkSync(file.path)
                if (error) {
                    reject(error)
                }
                else {
                    resolve(result)
                }
            })
    })
};

export const fileUploader = {
    upload,
    uploadToCloudinary
}