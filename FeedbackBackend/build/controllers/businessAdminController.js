"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveLinkForTemplate = exports.addBusinessAdminAndAllotTemplates = void 0;
const template_1 = __importDefault(require("../db/models/template"));
const constants_1 = require("../constants/constants");
const mongoose_1 = require("mongoose");
const responseUtils_1 = require("../utils/responseUtils");
const businessAdmin_1 = require("../db/models/businessAdmin");
const feedbackCategory_1 = __importDefault(require("../db/models/feedbackCategory"));
const utils_1 = require("../utils");
const response_1 = require("../validations/response");
const FeedbackLinks_1 = require("../db/models/FeedbackLinks");
const yup = __importStar(require("yup"));
//create response
const addBusinessAdminAndAllotTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const businessAdminId = parseInt(req.body.businessAdminId);
        const businessCategoryId = parseInt(req.body.businessCategoryId);
        if (!businessAdminId) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'businessAdminId must be in body request.', 400);
        }
        if (!businessCategoryId) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'businessCategoryId must be in body request.', 400);
        }
        if (isNaN(businessAdminId) || !Number.isInteger(businessAdminId)) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'businessAdminId must be a valid integer.', 400);
        }
        if (isNaN(businessCategoryId) || !Number.isInteger(businessCategoryId)) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'businessCategoryId must be a valid integer.', 400);
        }
        const defaultServiceCategories = yield feedbackCategory_1.default.find({
            creationType: 2, businessCategoryId
        }).exec();
        let businessAdminData = [];
        if (defaultServiceCategories.length === 0) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template service category not found.', 404);
        }
        for (const serviceCategory of defaultServiceCategories) {
            const defaultTemplates = yield template_1.default.find({ feedbackType: serviceCategory._id, templateType: constants_1.TemplateType.DEFAULT }, { _id: 1 }).exec();
            const templatesData = {
                businessAdminId,
                templateServiceCategoryId: new mongoose_1.Types.ObjectId(serviceCategory._id),
                templates: defaultTemplates.map((ele) => ({ id: ele._id }))
            };
            businessAdminData.push(Object.assign({}, templatesData));
        }
        yield businessAdmin_1.BusinessAdmin.insertMany([...businessAdminData]);
        return (0, responseUtils_1.buildResponse)(res, "Business admin is added successfully", 200);
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal server error', 500);
    }
});
exports.addBusinessAdminAndAllotTemplates = addBusinessAdminAndAllotTemplates;
const getActiveLinkForTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const serviceId = req.params.serviceId;
        const businessAdminId = req.params.businessAdminId;
        if (!mongoose_1.Types.ObjectId.isValid(serviceId)) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'serviceId format is not valid', 404);
        }
        const bodyData = req.body;
        yield (0, response_1.validateLinkBodySchema)(bodyData);
        const existingTemplate = yield businessAdmin_1.BusinessAdmin.findOne({
            'templates.active': true,
            businessAdminId,
            templateServiceCategoryId: new mongoose_1.Types.ObjectId(serviceId),
        }, { _id: 0, 'templates.$': 1 });
        if (!existingTemplate) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template is not active', 404);
        }
        const templateObj = (_a = existingTemplate.templates[0]) === null || _a === void 0 ? void 0 : _a.id;
        const link = (0, utils_1.generateUrlWithToken)(templateObj, bodyData);
        yield saveGeneratedLink(link, bodyData.entityId, bodyData.entityName);
        return (0, responseUtils_1.buildObjectResponse)(res, link);
    }
    catch (error) {
        console.log(error);
        if (error instanceof yup.ValidationError && (error === null || error === void 0 ? void 0 : error.errors)) {
            const errorMessage = ((_b = error.errors) === null || _b === void 0 ? void 0 : _b.join(', ')) || 'Validation Error';
            return (0, responseUtils_1.buildErrorResponse)(res, errorMessage, 400);
        }
        else {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Internal server error', 500);
        }
    }
});
exports.getActiveLinkForTemplate = getActiveLinkForTemplate;
function saveGeneratedLink(url, productId, productName) {
    return __awaiter(this, void 0, void 0, function* () {
        FeedbackLinks_1.FeedbackLinks.create({
            entityId: productId,
            entityName: productName,
            feedbackUrl: url,
            isActive: true
        });
    });
}
