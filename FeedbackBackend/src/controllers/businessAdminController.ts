import { Request, Response } from 'express';
import FeedbackTemplate, { AnswerFormat, FeedbackFormat, FeedbackTemplateInterface, QuestionAnswerFormField } from '../db/models/template';
import { validateFormSchema } from '../validations/template';
import { TemplateType } from '../constants/constants';
import mongoose, { Types } from 'mongoose';
import { buildErrorResponse, buildObjectResponse, buildResponse } from '../utils/responseUtils';
import { BusinessAdmin } from '../db/models/businessAdmin';
import FeedbackCategory from '../db/models/feedbackCategory';
import { generateUrlWithToken } from '../utils';
import { LinkBodyDto } from '../types/feedback';
import { validateLinkBodySchema } from '../validations/response';
import { FeedbackLinks } from '../db/models/feedbackLinks';
import * as yup from 'yup';


//create response
export const addBusinessAdminAndAllotTemplates = async (req: Request, res: Response) => {
    try {

        const businessAdminId = parseInt(req.body.businessAdminId);
        const businessCategoryId = parseInt(req.body.businessCategoryId);

        if (!businessAdminId) {
            return buildErrorResponse(res, 'businessAdminId must be in body request.', 400);
        }

        if (!businessCategoryId) {
            return buildErrorResponse(res, 'businessCategoryId must be in body request.', 400);
        }

        if (isNaN(businessAdminId) || !Number.isInteger(businessAdminId)) {
            return buildErrorResponse(res, 'businessAdminId must be a valid integer.', 400);
        }

        if (isNaN(businessCategoryId) || !Number.isInteger(businessCategoryId)) {
            return buildErrorResponse(res, 'businessCategoryId must be a valid integer.', 400);
        }

        const defaultServiceCategories = await FeedbackCategory.find({
            creationType: 2, businessCategoryId
        }).exec();
        let businessAdminData = [];

        if (defaultServiceCategories.length === 0) {
            return buildErrorResponse(res, 'Template service category not found.', 404);
        }

        for (const serviceCategory of defaultServiceCategories) {
            const defaultTemplates: FeedbackTemplateInterface[] = await FeedbackTemplate.find(
                { feedbackType: serviceCategory._id, templateType: TemplateType.DEFAULT },
                { _id: 1 }
            ).exec();

            const templatesData = {
                businessAdminId,
                templateServiceCategoryId: new Types.ObjectId(serviceCategory._id),
                templates: defaultTemplates.map((ele) => ({ id: ele._id }))
            };

            businessAdminData.push({ ...templatesData });
        }

        await BusinessAdmin.insertMany([...businessAdminData])

        return buildResponse(res, "Business admin is added successfully", 200)
    } catch (error) {
        console.log(error)
        return buildErrorResponse(res, 'Internal server error', 500);
    }
}


export const getActiveLinkForTemplate = async (req: Request, res: Response) => {
    try {
        const serviceId = req.params.serviceId;
        const businessAdminId = req.params.businessAdminId;

        if(!Types.ObjectId.isValid(serviceId)){
            return buildErrorResponse(res, 'serviceId format is not valid', 404);
        }

        const bodyData = req.body as LinkBodyDto;

        await validateLinkBodySchema(bodyData);

        const existingTemplate: any = await BusinessAdmin.findOne(
            {
                'templates.active': true,
                businessAdminId,
                templateServiceCategoryId: new Types.ObjectId(serviceId),
            },
            { _id: 0, 'templates.$': 1 }
        )

        if (!existingTemplate) {
            return buildErrorResponse(res, 'Template is not active', 404);
        }

        const templateObj = existingTemplate.templates[0]?.id;

        const response = await FeedbackLinks.findOne(
            {entityId: bodyData.entityId},
            {templateId: templateObj}
        )

        if(response) {
            return buildObjectResponse(res, response.feedbackUrl)
        }

        const link = generateUrlWithToken(templateObj, bodyData);
        //add template link
        await saveGeneratedLink(link,bodyData.entityId,bodyData.entityName,businessAdminId, templateObj);

        return buildObjectResponse(res, link)

    } catch (error) {
        console.log(error)
        if (error instanceof yup.ValidationError && error?.errors) {
            const errorMessage: string = error.errors?.join(', ') || 'Validation Error';
            return buildErrorResponse(res, errorMessage, 400);
        } else {
            return buildErrorResponse(res, 'Internal server error', 500);
        }
    }

}

export const getAllFeedbackLinks = async (req: Request, res: Response) => {
    //need to add template id request params so query can be changed------------------------------
    try{
        const businessAdminId = req.params.businessAdminId;
        const templateId = req.params.templateId;
        const { pageNumber, pageSize } = req.query;

        if (!pageNumber || !pageSize || isNaN(Number(pageNumber)) || isNaN(Number(pageSize))) {
            return buildErrorResponse(res, 'Invalid pagination parameters', 404);
        }

        const pageNumberVal = Number(pageNumber);
        const pageSizeNumberVal = Number(pageSize);
        if (pageNumberVal < 0 || pageSizeNumberVal < 0) {
            return buildErrorResponse(res, 'Invalid page or pageSize', 404);
        }

        const totalResponses = await FeedbackLinks.find(
        {
            createdBy: businessAdminId
        }).count()

         // Fetch the responses
        const response = await FeedbackLinks.find(
            {createdBy: businessAdminId},
            {templateId: templateId}
        )
        .sort({ createdAt: -1 })
        .skip((pageNumberVal - 1) * pageSizeNumberVal)
        .limit(pageSizeNumberVal);

        if (!response) {
            return buildErrorResponse(res, 'Response not found', 404);
        }
        return buildObjectResponse(res, { data: response, totalResponses })
    }
    catch{

    }
}


async function saveGeneratedLink(url: string, productId: string, productName: string,bussinessAdminId: string, templateId:string){
    
    FeedbackLinks.create({
        entityId: productId,
        entityName: productName,
        templateId: templateId,
        feedbackUrl: url,
        isActive: true,
        createdBy: bussinessAdminId
    });
}