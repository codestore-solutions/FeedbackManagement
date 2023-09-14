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
exports.activateTemplate = exports.createTemplate = exports.swapQuestions = exports.swapSections = exports.getTemplateByFeedbackCategoryId = exports.getTemplateByIdAndBusinessAdmin = exports.getTemplateById = exports.getBusinessAdminTemplates = exports.getDefaultBusinessCategoryTemplates = void 0;
const template_1 = __importDefault(require("../db/models/template"));
const template_2 = require("../validations/template");
const constants_1 = require("../constants/constants");
const yup = __importStar(require("yup"));
const mongoose_1 = __importStar(require("mongoose"));
const responseUtils_1 = require("../utils/responseUtils");
const feedbackCategory_1 = __importDefault(require("../db/models/feedbackCategory"));
const businessAdmin_1 = require("../db/models/businessAdmin");
//fetches default templates bases on business category
const getDefaultBusinessCategoryTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { businessCategoryId } = req.params;
        if (!Number.isInteger(parseInt(businessCategoryId, 10))) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Invalid businessCategoryId', 400);
        }
        const templatesByCategory = [];
        const aggregateResult = yield template_1.default.aggregate([
            {
                $lookup: {
                    from: 'feedbackcategory',
                    localField: 'feedbackType',
                    foreignField: '_id',
                    as: 'feedbackType',
                },
            },
            {
                $unwind: '$feedbackType',
            },
            {
                $match: {
                    businessCategory: parseInt(businessCategoryId, 10),
                },
            },
            {
                $group: {
                    _id: '$feedbackType.name',
                    templates: {
                        $push: {
                            id: '$_id',
                            templateName: '$templateName',
                            businessCategory: '$businessCategory',
                            sections: '$sections',
                            isActive: '$isActive',
                        },
                    },
                    feedbackType: {
                        $first: {
                            id: '$feedbackType._id',
                            name: '$feedbackType.name'
                        },
                    },
                },
            },
        ]);
        aggregateResult.forEach((result) => {
            templatesByCategory.push({
                templates: result.templates,
                feedbackType: result.feedbackType
            });
        });
        return (0, responseUtils_1.buildObjectResponse)(res, templatesByCategory);
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal Server Error', 500);
    }
});
exports.getDefaultBusinessCategoryTemplates = getDefaultBusinessCategoryTemplates;
//fetches default templates bases on business category
const getBusinessAdminTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const businessAdminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const businessAdminsWithTemplates = yield businessAdmin_1.BusinessAdmin.aggregate([
            {
                $match: {
                    businessAdminId
                }
            },
            {
                $unwind: "$templates"
            },
            {
                $lookup: {
                    from: 'feedbackcategories',
                    localField: 'templateServiceCategoryId',
                    foreignField: '_id',
                    as: 'templateServiceCategory',
                },
            },
            {
                $unwind: '$templateServiceCategory',
            },
            {
                $lookup: {
                    from: 'feedbacktemplates',
                    localField: 'templates.id',
                    foreignField: '_id',
                    as: 'templates.templateData',
                },
            },
            {
                $unwind: "$templates.templateData"
            },
            {
                $project: {
                    id: "$_id",
                    templateServiceCategory: {
                        id: "$templateServiceCategory._id",
                        name: 1,
                    },
                    templates: {
                        id: "$templates.templateData._id",
                        templateName: "$templates.templateData.templateName",
                        templateType: "$templates.templateData.templateType",
                        active: "$templates.active",
                        used: "$templates.used",
                    },
                    createdAt: 1
                }
            },
            {
                $sort: {
                    'templates.templateType': -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    templates: { $push: "$templates" },
                    templateServiceCategory: { $first: "$templateServiceCategory" },
                    createdAt: { $first: "$createdAt" },
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
            {
                $project: {
                    _id: 0,
                    createdAt: 0
                }
            },
        ]);
        if (businessAdminsWithTemplates.length === 0) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Business admin not found.', 404);
        }
        return (0, responseUtils_1.buildObjectResponse)(res, businessAdminsWithTemplates);
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal Server Error', 500);
    }
});
exports.getBusinessAdminTemplates = getBusinessAdminTemplates;
// Fetches a single template based on templateId with sorted questions and sections
const getTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(templateId)) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'templateId format is not valid', 404);
        }
        const template = yield template_1.default.findById(templateId);
        if (!template) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template not found', 404);
        }
        template.sections.sort((a, b) => a.order - b.order);
        template.sections.forEach((section) => {
            section.questions.sort((a, b) => a.order - b.order);
        });
        const _b = template.toObject(), { _id } = _b, templateData = __rest(_b, ["_id"]);
        return (0, responseUtils_1.buildObjectResponse)(res, Object.assign({ id: _id }, templateData));
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal Server Error', 500);
    }
});
exports.getTemplateById = getTemplateById;
const getTemplateByIdAndBusinessAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { templateId } = req.params;
        const businessAdminId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const template = yield template_1.default.findById(templateId);
        if (!template) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template not found', 404);
        }
        template.sections.sort((a, b) => a.order - b.order);
        template.sections.forEach((section) => {
            section.questions.sort((a, b) => a.order - b.order);
        });
        const businessAdminTemplates = yield businessAdmin_1.BusinessAdmin.findOne({
            businessAdminId,
            templateServiceCategoryId: new mongoose_1.Types.ObjectId(template.feedbackType)
        });
        const activeItem = businessAdminTemplates === null || businessAdminTemplates === void 0 ? void 0 : businessAdminTemplates.templates.find((item) => {
            return (item.id.equals(template._id) && item.active === true);
        });
        const isActive = activeItem ? activeItem.active === true : false;
        const _d = template.toObject(), { _id } = _d, templateData = __rest(_d, ["_id"]);
        return (0, responseUtils_1.buildObjectResponse)(res, Object.assign({ id: _id, active: isActive }, templateData));
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal Server Error', 500);
    }
});
exports.getTemplateByIdAndBusinessAdmin = getTemplateByIdAndBusinessAdmin;
const getTemplateByFeedbackCategoryId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const businessAdminId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.id;
        const { feedbackTypeId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(feedbackTypeId)) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'feedbackTypeId format is not valid', 404);
        }
        const category = yield feedbackCategory_1.default.findById(new mongoose_1.Types.ObjectId(feedbackTypeId));
        if (!category) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Category not found.', 404);
        }
        const businessAdmin = yield businessAdmin_1.BusinessAdmin.findOne({ templateServiceCategoryId: new mongoose_1.Types.ObjectId(feedbackTypeId), businessAdminId })
            .populate([
            {
                path: 'templates.id',
                select: '_id templateName templateType',
            },
            {
                path: 'templateServiceCategoryId',
                select: '-_id name',
            }
        ]);
        if (!businessAdmin) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Business admin not found.', 404);
        }
        const templates = businessAdmin.templates;
        const templateServiceCategoryId = businessAdmin.templateServiceCategoryId;
        const mappedTemplates = templates.map((template) => {
            var _a, _b, _c;
            if (template.id != null) {
                return {
                    id: (_a = template.id) === null || _a === void 0 ? void 0 : _a._id,
                    templateName: (_b = template.id) === null || _b === void 0 ? void 0 : _b.templateName,
                    templateType: (_c = template.id) === null || _c === void 0 ? void 0 : _c.templateType,
                    active: template.id == null ? null : template.active,
                    used: template.id == null ? null : template.used,
                };
            }
        });
        const response = {
            templates: mappedTemplates.filter((item) => item != null),
            feedbackType: {
                id: feedbackTypeId,
                name: templateServiceCategoryId.name
            }
        };
        return (0, responseUtils_1.buildObjectResponse)(res, response);
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal Server Error', 500);
    }
});
exports.getTemplateByFeedbackCategoryId = getTemplateByFeedbackCategoryId;
const swapSections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId } = req.params;
        const sections = req.body;
        const template = yield template_1.default.findById(templateId);
        if (!template) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template not found', 404);
        }
        const missingSectionIds = [];
        sections.forEach((section) => {
            if (!template.sections.some((sectionData) => sectionData.id === section.sectionId)) {
                missingSectionIds.push(section.sectionId);
            }
        });
        if (missingSectionIds.length > 0) {
            return (0, responseUtils_1.buildErrorResponse)(res, `Sections not found: ${missingSectionIds.join(', ')}`, 404);
        }
        sections.forEach((section) => {
            const targetSection = template.sections.find((sectionData) => sectionData.id === section.sectionId);
            if (targetSection) {
                targetSection.order = section.newOrder;
            }
        });
        yield template.save();
        return (0, responseUtils_1.buildResponse)(res, 'Section order updated successfully', 200);
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal Server Error', 500);
    }
});
exports.swapSections = swapSections;
const swapQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { templateId } = req.params;
        const { questions, sectionId } = req.body;
        // const parsedTemplateId = parseInt(templateId);
        const parsedSectionId = parseInt(sectionId);
        const template = yield template_1.default.findById(templateId);
        if (!template) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template not found', 404);
        }
        const section = template.sections.find((sec) => sec.id === parsedSectionId);
        if (!section) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Section not found', 404);
        }
        for (const question of questions) {
            const { questionId, newOrder } = question;
            const targetQuestion = section.questions.find((ques) => ques.id === questionId);
            if (targetQuestion) {
                targetQuestion.order = newOrder;
            }
        }
        yield template.save();
        return (0, responseUtils_1.buildResponse)(res, 'Question order swapped successfully', 200);
    }
    catch (error) {
        console.log(error);
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal Server Error Occured', 500);
    }
});
exports.swapQuestions = swapQuestions;
const validateAndTransformForm = (roleId, businessAdminId, formData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, template_2.validateFormSchema)(formData);
        const convertToAnswerFormat = (answerFormat) => {
            const convertedFormat = {
                type: answerFormat.type,
                required: answerFormat.required,
            };
            if (answerFormat.options) {
                convertedFormat.options = answerFormat.options;
            }
            if (answerFormat.upperBound) {
                convertedFormat.upperBound = answerFormat.upperBound;
            }
            return convertedFormat;
        };
        const convertToQuestionAnswerFormField = (sections) => {
            return sections.map((section, index) => {
                const convertedField = {
                    id: index + 1,
                    question: section.question,
                    order: section.order,
                    answerFormat: convertToAnswerFormat(section.answerFormat),
                };
                return convertedField;
            });
        };
        const convertToFeedbackFormat = (sections) => {
            return sections.map((section, index) => {
                const convertedFormat = {
                    id: index + 1,
                    title: section.title,
                    order: section.order,
                    questions: convertToQuestionAnswerFormField(section.questions),
                };
                return convertedFormat;
            });
        };
        const convertToFeedbackTemplate = (feedbackForm) => {
            let feedbackTemplate = {
                businessCategory: feedbackForm.businessCategory,
                templateName: feedbackForm.feedbackFormName,
                feedbackType: new mongoose_1.Types.ObjectId(feedbackForm.feedbackType),
                sections: convertToFeedbackFormat(feedbackForm.sections),
                isActive: false,
            };
            if (roleId === 2 && businessAdminId) {
                feedbackTemplate = Object.assign(Object.assign({}, feedbackTemplate), { used: false, templateType: constants_1.TemplateType.CUSTOM, businessAdminId: businessAdminId });
            }
            else if (roleId === 1) {
                feedbackTemplate = Object.assign(Object.assign({}, feedbackTemplate), { templateType: constants_1.TemplateType.DEFAULT });
            }
            return feedbackTemplate;
        };
        const feedbackForm = convertToFeedbackTemplate(formData);
        return feedbackForm;
    }
    catch (error) {
        throw error;
    }
});
// create new feedback template 
const createTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h;
    try {
        const businessAdminId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
        const roleId = (_g = req.user) === null || _g === void 0 ? void 0 : _g.role;
        const formData = req.body;
        const serviceCategory = yield feedbackCategory_1.default.findById(formData.feedbackType);
        if (!serviceCategory) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template service category not found.', 404);
        }
        const data = yield validateAndTransformForm(roleId, businessAdminId, formData);
        console.log(JSON.stringify(data, null, 2));
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        const feedbackTemplate = new template_1.default(data);
        yield feedbackTemplate.save({ session });
        const businessAdmin = yield businessAdmin_1.BusinessAdmin.findOneAndUpdate({ businessAdminId, templateServiceCategoryId: serviceCategory._id }, { $push: { templates: { id: feedbackTemplate._id } } }, { new: true, session });
        if (!businessAdmin) {
            session.endSession();
            return (0, responseUtils_1.buildErrorResponse)(res, 'Business admin not found.', 404);
        }
        yield session.commitTransaction();
        session.endSession();
        return (0, responseUtils_1.buildResponse)(res, "Feedback form created successfully", 200);
    }
    catch (error) {
        console.log(error);
        if (error instanceof yup.ValidationError && (error === null || error === void 0 ? void 0 : error.errors)) {
            // If there's a validation error, send the error response
            const errorMessage = ((_h = error.errors) === null || _h === void 0 ? void 0 : _h.join(', ')) || 'Validation Error';
            return (0, responseUtils_1.buildErrorResponse)(res, errorMessage, 400);
        }
        else {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Internal server error', 500);
        }
    }
});
exports.createTemplate = createTemplate;
// // update template
// export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
//     try {
//         const { templateId } = req.params;
//         const templateData: FeedbackFormBodySchema = req.body;
//         const businessAdminId: number = req.user?.id;
//         const roleId: number = req.user?.role;
//         // Validate and transform the templateId parameter
//         const parsedTemplateId = parseInt(templateId);
//         // Check if the transformation was successful
//         if (isNaN(parsedTemplateId)) {
//             res.status(400).json({ error: 'Invalid templateId format' });
//         }
//         const existingTemplate = await FeedbackTemplate.findById(parsedTemplateId);
//         // Check if the template exists
//         if (!existingTemplate) {
//             res.status(404).json({ error: 'Template not found' });
//         }
//         // Check if the template is active
//         if (existingTemplate && existingTemplate.used) {
//             res.status(400).json({ error: 'Cannot update an in use or used template' });
//         }
//         const data = await validateAndTransformForm(roleId, businessAdminId, templateData);
//         console.log(JSON.stringify(data, null, 2))
//         await FeedbackTemplate.findByIdAndUpdate(parsedTemplateId, templateData, { new: true });
//         res.status(200).json({ message: 'Feedback form updated successfully' });
//     } catch (error) {
//         console.log(error)
//         if (error instanceof yup.ValidationError && error?.errors) {
//             // If there's a validation error, send the error response
//             const errorMessage: string = error.errors?.join(', ') || 'Validation Error';
//             res.status(400).json({ error: errorMessage });
//         } else {
//             res.status(500).json({ error: status_codes[500] });
//         }
//     }
// })
// activating template
const activateTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const businessAdminId = (_j = req.user) === null || _j === void 0 ? void 0 : _j.id;
        const { templateId, feedbackTypeId } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(feedbackTypeId)) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'feedbackTypeId format is not valid', 404);
        }
        if (!mongoose_1.Types.ObjectId.isValid(templateId)) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'templateId format is not valid', 404);
        }
        const category = yield feedbackCategory_1.default.findById(new mongoose_1.Types.ObjectId(feedbackTypeId));
        if (!category) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Category not found.', 404);
        }
        const template = yield template_1.default.findById(templateId);
        if (!template) {
            return (0, responseUtils_1.buildErrorResponse)(res, 'Template not found', 404);
        }
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const a = yield businessAdmin_1.BusinessAdmin.findOneAndUpdate({
                businessAdminId, templateServiceCategoryId: new mongoose_1.Types.ObjectId(feedbackTypeId),
                'templates.active': true
            }, { $set: { 'templates.$.active': false } }, { new: true, session });
            yield businessAdmin_1.BusinessAdmin.findOneAndUpdate({ businessAdminId, templateServiceCategoryId: new mongoose_1.Types.ObjectId(feedbackTypeId), 'templates.id': new mongoose_1.Types.ObjectId(templateId) }, { $set: { 'templates.$.active': true, 'templates.$.used': true } }, { new: true, session });
            yield session.commitTransaction();
            session.endSession();
            return (0, responseUtils_1.buildResponse)(res, 'Template activated successfully', 200);
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
    catch (error) {
        return (0, responseUtils_1.buildErrorResponse)(res, 'Internal server error', 500);
    }
});
exports.activateTemplate = activateTemplate;
// delete a template
// export const deleteTemplate = async (req: Request, res: Response) => {
//     try {
//         const businessAdminId: number = req.user?.id;
//         const { templateId } = req.params;
//         const parsedTemplateId = templateId;
//         const existingTemplate = await BusinessAdmin.findOne(
//             {
//                 businessAdminId,
//                 'templates.id': new Types.ObjectId(templateId),
//                 'used': true
//             }
//         )
//         if (existingTemplate) {
//             return buildResponse(res, 'Cannot delete a template in use', 200);
//         }
//         // Delete the template
//         await FeedbackTemplate.findByIdAndDelete(parsedTemplateId);
//         return buildResponse(res, 'Template deleted successfully', 200);
//     } catch (error) {
//         console.error('Error deleting template:', error);
//         return buildErrorResponse(res, 'Internal server error', 500);
//     }
// }
