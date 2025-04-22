"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const client_1 = require("@prisma/client");
const PaginationHelper_1 = require("../../helpars/PaginationHelper");
const admin_constant_1 = require("./admin.constant");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const getAllFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = PaginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: admin_constant_1.adminSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        });
    }
    ;
    // const filterData: Record<string, any> = {}; 
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    // ---------deleted true conditoion---
    andCondions.push({
        isDeleted: false
    });
    const whereConditions = { AND: andCondions };
    const result = yield prisma_1.default.admin.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = yield prisma_1.default.admin.count({
        where: whereConditions
    });
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
});
// -------------get by id -----
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
});
// -------------update -------------
const UpdateAdminFromBD = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.default.admin.update({
        where: {
            id
        },
        data
    });
    return result;
});
// --------DELETE ADMIN----------------
const DeleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // error handle not found id
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = yield prisma_1.default.$transaction((transtionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // -------admin
        const adminDeletedData = yield transtionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        // -------user ---------
        yield transtionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
        return adminDeletedData;
    }));
    return result;
});
// ----------soft delete--------
const SoftDeleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // ------------ error handle not found id -------------------
    yield prisma_1.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = yield prisma_1.default.$transaction((transtionClient) => __awaiter(void 0, void 0, void 0, function* () {
        // -------admin--------------
        const adminDeletedData = yield transtionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        // -------user ---------
        yield transtionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: client_1.UserStatus.DELETED
            }
        });
        return adminDeletedData;
    }));
    return result;
});
exports.adminService = {
    getAllFromDB,
    getByIdFromDB,
    UpdateAdminFromBD,
    DeleteFromDB,
    SoftDeleteFromDB
};
