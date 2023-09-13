import { Request, Response } from 'express';
import FeedbackTemplate, { AnswerFormat, FeedbackFormat, FeedbackTemplateInterface, QuestionAnswerFormField } from '../db/models/template';
import { validateFormSchema } from '../validations/template';
import { TemplateType } from '../constants/constants';
import * as yup from 'yup';
import { FeedbackFormBodySchema } from '../types/feedback';
import mongoose, { Types } from 'mongoose';
import { buildErrorResponse, buildObjectResponse, buildResponse } from '../utils/responseUtils';
import { TemplateSectionRequest, QuestionRequest } from '../validations/template';
import FeedbackCategory from '../db/models/feedbackCategory';
import { BusinessAdmin } from '../db/models/businessAdmin';


//fetches default templates bases on business category
export const getDefaultBusinessCategoryTemplates = async (req: Request, res: Response) => {
    try {
        const { businessCategoryId } = req.params;

        if (!Number.isInteger(parseInt(businessCategoryId, 10))) {
            return buildErrorResponse(res, 'Invalid businessCategoryId', 400);
        }

        const templatesByCategory: any = [];

        const aggregateResult: any[] = await FeedbackTemplate.aggregate([
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

        aggregateResult.forEach((result: any) => {
            templatesByCategory.push({
                templates: result.templates,
                feedbackType: result.feedbackType
            })
        });

        return buildObjectResponse(res, templatesByCategory)

    } catch (error) {
        console.log(error);
        return buildErrorResponse(res, 'Internal Server Error', 500);
    }
}


//fetches default templates bases on business category
export const getBusinessAdminTemplates = async (req: Request, res: Response) => {
    try {
        const businessAdminId: number = req.user?.id;

        const businessAdminsWithTemplates = await BusinessAdmin.aggregate([
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
            return buildErrorResponse(res, 'Business admin not found.', 404);
        }

        return buildObjectResponse(res, businessAdminsWithTemplates)

    } catch (error) {
        console.log(error);
        return buildErrorResponse(res, 'Internal Server Error', 500);
    }
}


// Fetches a single template based on templateId with sorted questions and sections
export const getTemplateById = async (req: Request, res: Response) => {
    try {
        const { templateId } = req.params;

        
        if(!Types.ObjectId.isValid(templateId)){
            return buildErrorResponse(res, 'templateId format is not valid', 404);
        }

        const template: FeedbackTemplateInterface | null = await FeedbackTemplate.findById(templateId);

        if (!template) {
            return buildErrorResponse(res, 'Template not found', 404);
        }

        template.sections.sort((a, b) => a.order - b.order);
        template.sections.forEach((section) => {
            section.questions.sort((a, b) => a.order - b.order);
        });

        const { _id, ...templateData } = template.toObject();

        return buildObjectResponse(res, { id: _id, ...templateData })
    } catch (error) {
        console.log(error);
        return buildErrorResponse(res, 'Internal Server Error', 500);
    }
}


export const getTemplateByIdAndBusinessAdmin = async (req: Request, res: Response) => {
    try {
        const { templateId } = req.params;
        const businessAdminId: number = req.user?.id;

        const template: FeedbackTemplateInterface | null = await FeedbackTemplate.findById(templateId);

        if (!template) {
            return buildErrorResponse(res, 'Template not found', 404);
        }

        template.sections.sort((a, b) => a.order - b.order);
        template.sections.forEach((section) => {
            section.questions.sort((a, b) => a.order - b.order);
        });

        const businessAdminTemplates = await BusinessAdmin.findOne({
            businessAdminId,
            templateServiceCategoryId: new Types.ObjectId(template.feedbackType)
        })

        const activeItem = businessAdminTemplates?.templates.find(
            (item) => {
                return (item.id.equals(template._id) && item.active === true)
            });

        const isActive = activeItem ? activeItem.active === true : false;

        const { _id, ...templateData } = template.toObject();

        return buildObjectResponse(res, { id: _id, active: isActive, ...templateData })
    } catch (error) {
        console.log(error);
        return buildErrorResponse(res, 'Internal Server Error', 500);
    }
}

export const getTemplateByFeedbackCategoryId = async (req: Request, res: Response) => {
    try {
        const businessAdminId: number = req.user?.id;

        const { feedbackTypeId } = req.params;

        if(!Types.ObjectId.isValid(feedbackTypeId)){
            return buildErrorResponse(res, 'feedbackTypeId format is not valid', 404);
        }

        const category = await FeedbackCategory.findById(new Types.ObjectId(feedbackTypeId))

        if (!category) {
            return buildErrorResponse(res, 'Category not found.', 404);
        }

        const businessAdmin = await BusinessAdmin.findOne(
            { templateServiceCategoryId: new Types.ObjectId(feedbackTypeId), businessAdminId })
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
            return buildErrorResponse(res, 'Business admin not found.', 404);
        }

        const templates: any = businessAdmin.templates
        const templateServiceCategoryId: any = businessAdmin.templateServiceCategoryId

        const mappedTemplates = templates.map((template:any) => 
        {if(template.id != null)
            {
                return{
                    id: template.id?._id,
                    templateName: template.id?.templateName,
                    templateType: template.id?.templateType,
                    active: template.id == null ? null: template.active,
                    used: template.id == null ? null : template.used,
                }
            }
        });

        const response = {
            templates: mappedTemplates.filter((item:any) => item != null),
            feedbackType: {
                id: feedbackTypeId,
                name: templateServiceCategoryId.name
            }
        }
        return buildObjectResponse(res, response)

    } catch (error) {
        console.log(error);
        return buildErrorResponse(res, 'Internal Server Error', 500);
    }
}


export const swapSections = async (req: Request, res: Response) => {
    try {
        const { templateId } = req.params;

        const sections = req.body as TemplateSectionRequest[];

        const template = await FeedbackTemplate.findById(templateId);

        if (!template) {
            return buildErrorResponse(res, 'Template not found', 404);
        }

        const missingSectionIds: number[] = [];
        sections.forEach((section) => {
            if (!template.sections.some((sectionData) => sectionData.id === section.sectionId)) {
                missingSectionIds.push(section.sectionId);
            }
        });

        if (missingSectionIds.length > 0) {
            return buildErrorResponse(res, `Sections not found: ${missingSectionIds.join(', ')}`, 404);
        }

        sections.forEach((section) => {
            const targetSection = template.sections.find((sectionData) => sectionData.id === section.sectionId);
            if (targetSection) {
                targetSection.order = section.newOrder;
            }
        });

        await template.save();

        return buildResponse(res, 'Section order updated successfully', 200)
    } catch (error) {
        console.log(error);
        return buildErrorResponse(res, 'Internal Server Error', 500);
    }
}


export const swapQuestions = async (req: Request, res: Response) => {
    try {
        const { templateId } = req.params;
        const { questions, sectionId } = req.body as { questions: QuestionRequest[], sectionId: string };

        // const parsedTemplateId = parseInt(templateId);
        const parsedSectionId = parseInt(sectionId);

        const template = await FeedbackTemplate.findById(templateId);

        if (!template) {
            return buildErrorResponse(res, 'Template not found', 404);
        }

        const section = template.sections.find((sec) => sec.id === parsedSectionId);

        if (!section) {
            return buildErrorResponse(res, 'Section not found', 404);
        }

        for (const question of questions) {
            const { questionId, newOrder } = question;
            const targetQuestion = section.questions.find((ques) => ques.id === questionId);
            if (targetQuestion) {
                targetQuestion.order = newOrder;
            }
        }

        await template.save();

        return buildResponse(res, 'Question order swapped successfully', 200);

    } catch (error) {
        console.log(error);
        return buildErrorResponse(res, 'Internal Server Error Occured', 500);
    }
}


const validateAndTransformForm = async (
    roleId: number,
    businessAdminId: number,
    formData: FeedbackFormBodySchema,) => {
    try {
        await validateFormSchema(formData)

        const convertToAnswerFormat = (answerFormat: any): AnswerFormat => {
            const convertedFormat: AnswerFormat = {
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

        const convertToQuestionAnswerFormField = (sections: any[]): QuestionAnswerFormField[] => {
            return sections.map((section, index) => {
                const convertedField: QuestionAnswerFormField = {
                    id: index + 1,
                    question: section.question,
                    order: section.order,
                    answerFormat: convertToAnswerFormat(section.answerFormat),
                };
                return convertedField;
            });
        };

        const convertToFeedbackFormat = (sections: any[]): FeedbackFormat[] => {
            return sections.map((section, index) => {
                const convertedFormat: FeedbackFormat = {
                    id: index + 1,
                    title: section.title,
                    order: section.order,
                    questions: convertToQuestionAnswerFormField(section.questions),
                };
                return convertedFormat;
            });
        };
        const convertToFeedbackTemplate = (feedbackForm: FeedbackFormBodySchema) => {
            let feedbackTemplate: any = {
                businessCategory: feedbackForm.businessCategory,
                templateName: feedbackForm.feedbackFormName,
                feedbackType: new Types.ObjectId(feedbackForm.feedbackType),
                sections: convertToFeedbackFormat(feedbackForm.sections),
                isActive: false,
            };

            if (roleId === 2 && businessAdminId) {
                feedbackTemplate = {
                    ...feedbackTemplate,
                    used: false,
                    templateType: TemplateType.CUSTOM,
                    businessAdminId: businessAdminId
                }
            } else if (roleId === 1) {
                feedbackTemplate = {
                    ...feedbackTemplate,
                    templateType: TemplateType.DEFAULT,
                }
            }
            return feedbackTemplate;
        };

        const feedbackForm = convertToFeedbackTemplate(formData)
        return feedbackForm;
    } catch (error) {
        throw error;
    }
}


// create new feedback template 
export const createTemplate = async (req: Request, res: Response) => {
    try {

        const businessAdminId: number = req.user?.id;
        const roleId: number = req.user?.role;

        const formData: FeedbackFormBodySchema = req.body;

        const serviceCategory = await FeedbackCategory.findById(formData.feedbackType)

        if (!serviceCategory) {
            return buildErrorResponse(res, 'Template service category not found.', 404);
        }

        const data = await validateAndTransformForm(roleId, businessAdminId, formData);

        console.log(JSON.stringify(data, null, 2))

        const session = await mongoose.startSession();
        session.startTransaction();


        const feedbackTemplate = new FeedbackTemplate(data);
        await feedbackTemplate.save({ session });

        const businessAdmin = await BusinessAdmin.findOneAndUpdate(
            { businessAdminId, templateServiceCategoryId: serviceCategory._id },
            { $push: { templates: { id: feedbackTemplate._id } } },
            { new: true, session }
        );

        if (!businessAdmin) {
            session.endSession();
            return buildErrorResponse(res, 'Business admin not found.', 404);
        }

        await session.commitTransaction();
        session.endSession();

        return buildResponse(res, "Feedback form created successfully", 200)

    } catch (error) {
        console.log(error)
        if (error instanceof yup.ValidationError && error?.errors) {
            // If there's a validation error, send the error response
            const errorMessage: string = error.errors?.join(', ') || 'Validation Error';
            return buildErrorResponse(res, errorMessage, 400);
        } else {
            return buildErrorResponse(res, 'Internal server error', 500);
        }
    }
};


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
export const activateTemplate = async (req: Request, res: Response) => {
    try {
        const businessAdminId: number = req.user?.id;

        const { templateId, feedbackTypeId } = req.params;

        if(!Types.ObjectId.isValid(feedbackTypeId)){
            return buildErrorResponse(res, 'feedbackTypeId format is not valid', 404);
        }

        if(!Types.ObjectId.isValid(templateId)){
            return buildErrorResponse(res, 'templateId format is not valid', 404);
        }

        const category = await FeedbackCategory.findById(new Types.ObjectId(feedbackTypeId))

        if (!category) {
            return buildErrorResponse(res, 'Category not found.', 404);
        }

        const template = await FeedbackTemplate.findById(templateId);

        if (!template) {
            return buildErrorResponse(res, 'Template not found', 404);
        }


        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const a = await BusinessAdmin.findOneAndUpdate(
                {
                    businessAdminId, templateServiceCategoryId: new Types.ObjectId(feedbackTypeId),
                    'templates.active': true
                },
                { $set: { 'templates.$.active': false } },
                { new: true, session }
            )

            await BusinessAdmin.findOneAndUpdate(
                { businessAdminId, templateServiceCategoryId: new Types.ObjectId(feedbackTypeId), 'templates.id': new Types.ObjectId(templateId) },
                { $set: { 'templates.$.active': true, 'templates.$.used': true } },
                { new: true, session }
            )

            await session.commitTransaction();
            session.endSession();

            return buildResponse(res, 'Template activated successfully', 200);
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        return buildErrorResponse(res, 'Internal server error', 500);
    }
}


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
