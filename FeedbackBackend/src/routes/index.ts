import express from 'express';
const router = express.Router();

router.get('/health', async (req, res, next) => {
    res.json({ msg: "Server is up." });
});
import { createTemplate, getDefaultBusinessCategoryTemplates, 
    getBusinessAdminTemplates, swapQuestions, swapSections, getTemplateById, 
    // activateTemplate, updateTemplate, deleteTemplate,
    getTemplateByFeedbackCategoryId, 
    activateTemplate,
    getTemplateByIdAndBusinessAdmin} from '../controllers/templateController';

import { verifyToken } from "../middlewares/authentication";
import { validateSectionsMiddleware, validateSwapQuestionsMiddleware } from '../validations/template';
import { createResponse, getResponseBasedOnEntityId, getResponseWithQuestions, getResponsesOfEntity, uploadImages } from '../controllers/responseController';
import { addBusinessAdminAndAllotTemplates, getActiveLinkForTemplate, getAllFeedbackLinks } from '../controllers/businessAdminController';
import  { upload } from '../middlewares/fileHandler';
import { getServiceCategories } from '../controllers/serviceCategoryController';


//fetching default templates
router.get(
    "/feedbackTemplate/getDefaultBusinessCategoryTemplates/:businessCategoryId",
    // verifyToken,
    getDefaultBusinessCategoryTemplates
);

//fetching business admin templates
router.get(
    "/feedbackTemplate/getBusinessAdminTemplates",
    verifyToken,
    getBusinessAdminTemplates
);

//fetch template
router.get(
    "/feedbackTemplate/getTemplateById/:templateId",
    // verifyToken,
    getTemplateById
);


//fetch template by business admin
router.get(
    "/feedbackTemplate/getTemplateByIdAndBusinessAdmin/:templateId",
    verifyToken,
    getTemplateByIdAndBusinessAdmin
);

//fetch template
router.get(
    "/feedbackTemplate/getTemplateByFeebackCategoryId/:feedbackTypeId",
    verifyToken,
    getTemplateByFeedbackCategoryId
);


// new template
router.post(
    "/feedbackTemplate/create",
    verifyToken,
    createTemplate
);

// // update template
// router.put(
//     "/feedbackTemplate/update/:templateId",
//     verifyToken,
//     updateTemplate
// );

//swap sections
router.put(
    "/feedbackTemplate/swapSections/:templateId",
    verifyToken,
    validateSectionsMiddleware,
    swapSections
);

//swap question
router.put(
    "/feedbackTemplate/swapQuestion/:templateId",
    verifyToken,
    validateSwapQuestionsMiddleware,
    swapQuestions
);

//activate feedback
router.put(
    "/feedbackTemplate/activateTemplate/:feedbackTypeId/:templateId",
    verifyToken,
    activateTemplate
);

// //delete template
// router.delete("/feedbackTemplate/deleteTemplate/:id", verifyToken, deleteTemplate);


//response

//create response
router.post(
    "/templateResponse/create/:templateId",
    // verifyToken,
    createResponse
);

router.get(
    "/templateResponse/getResponseById/:responseId",
    verifyToken,
    getResponseWithQuestions
);

router.get(
    "/templateResponse/getResponseBasedOnEntityId/:serviceId",
    verifyToken,
    getResponseBasedOnEntityId
);

router.get(
    "/templateResponse/getResponsesOfEntity/:entityId",
    verifyToken,
    getResponsesOfEntity
);


router.post(
    "/templateResponse/uploadImages",
    upload.single('file'),
    uploadImages
);

router.post(
    "/businessAdmin/allotDefaultTemplatesToBusinessAdmin",
    verifyToken,
    addBusinessAdminAndAllotTemplates
);

router.post(
    "/businessAdmin/createLink/:serviceId/:businessAdminId",
    verifyToken,
    getActiveLinkForTemplate
);

router.get(
    "/serviceCategories/getServices/:businessCategoryId",
    verifyToken,
    getServiceCategories
);

router.get(
    "/feedbackLinks/getFeedbackLinks/:businessAdminId",
    verifyToken,
    getAllFeedbackLinks
);

export default router;