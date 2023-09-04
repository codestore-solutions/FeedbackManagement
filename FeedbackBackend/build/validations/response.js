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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLinkBodySchema = exports.validateResponseSchema = exports.TemplateResponseDTOSchema = void 0;
const yup = __importStar(require("yup"));
exports.TemplateResponseDTOSchema = yup.object().shape({
    authorId: yup.string().required('Author ID is required'),
    entityId: yup.string().required('Entity ID is required'),
    entityName: yup.string().required('Entity name is required'),
    authorName: yup.string().optional(),
    sectionResponse: yup.array(yup.object().shape({
        id: yup.number().required(),
        questions: yup.array(yup.object().shape({
            id: yup.number().required(),
            answer: yup.mixed().required('Value is required')
        })).required(),
    })).required(),
});
const validateResponseSchema = (data) => exports.TemplateResponseDTOSchema.validate(data);
exports.validateResponseSchema = validateResponseSchema;
const linkBodySchema = yup.object().shape({
    entityId: yup.string().required('Entity ID is required'),
    entityName: yup.string().required('Entity name is required'),
});
const validateLinkBodySchema = (data) => linkBodySchema.validate(data);
exports.validateLinkBodySchema = validateLinkBodySchema;
