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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/health', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({ msg: "Server is up." });
}));
const templateController_1 = require("../controllers/templateController");
const authentication_1 = require("../middlewares/authentication");
const template_1 = require("../validations/template");
const responseController_1 = require("../controllers/responseController");
const businessAdminController_1 = require("../controllers/businessAdminController");
const fileHandler_1 = require("../middlewares/fileHandler");
const serviceCategoryController_1 = require("../controllers/serviceCategoryController");
//fetching default templates
router.get("/feedbackTemplate/getDefaultBusinessCategoryTemplates/:businessCategoryId", 
// verifyToken,
templateController_1.getDefaultBusinessCategoryTemplates);
//fetching business admin templates
router.get("/feedbackTemplate/getBusinessAdminTemplates", authentication_1.verifyToken, templateController_1.getBusinessAdminTemplates);
//fetch template
router.get("/feedbackTemplate/getTemplateById/:templateId", 
// verifyToken,
templateController_1.getTemplateById);
//fetch template by business admin
router.get("/feedbackTemplate/getTemplateByIdAndBusinessAdmin/:templateId", authentication_1.verifyToken, templateController_1.getTemplateByIdAndBusinessAdmin);
//fetch template
router.get("/feedbackTemplate/getTemplateByFeebackCategoryId/:feedbackTypeId", authentication_1.verifyToken, templateController_1.getTemplateByFeedbackCategoryId);
// new template
router.post("/feedbackTemplate/create", authentication_1.verifyToken, templateController_1.createTemplate);
// // update template
// router.put(
//     "/feedbackTemplate/update/:templateId",
//     verifyToken,
//     updateTemplate
// );
//swap sections
router.put("/feedbackTemplate/swapSections/:templateId", authentication_1.verifyToken, template_1.validateSectionsMiddleware, templateController_1.swapSections);
//swap question
router.put("/feedbackTemplate/swapQuestion/:templateId", authentication_1.verifyToken, template_1.validateSwapQuestionsMiddleware, templateController_1.swapQuestions);
//activate feedback
router.put("/feedbackTemplate/activateTemplate/:feedbackTypeId/:templateId", authentication_1.verifyToken, templateController_1.activateTemplate);
// //delete template
// router.delete("/feedbackTemplate/deleteTemplate/:id", verifyToken, deleteTemplate);
//response
//create response
router.post("/templateResponse/create/:templateId", 
// verifyToken,
responseController_1.createResponse);
router.get("/templateResponse/getResponseById/:responseId", authentication_1.verifyToken, responseController_1.getResponseWithQuestions);
router.get("/templateResponse/getResponseBasedOnEntityId/:serviceId", authentication_1.verifyToken, responseController_1.getResponseBasedOnEntityId);
router.get("/templateResponse/getResponsesOfEntity/:entityId", authentication_1.verifyToken, responseController_1.getResponsesOfEntity);
router.post("/templateResponse/uploadImages", fileHandler_1.upload.single('file'), responseController_1.uploadImages);
router.post("/businessAdmin/allotDefaultTemplatesToBusinessAdmin", authentication_1.verifyToken, businessAdminController_1.addBusinessAdminAndAllotTemplates);
router.post("/businessAdmin/createLink/:serviceId/:businessAdminId", authentication_1.verifyToken, businessAdminController_1.getActiveLinkForTemplate);
router.get("/serviceCategories/getServices/:businessCategoryId", authentication_1.verifyToken, serviceCategoryController_1.getServiceCategories);
router.get("/feedbackLinks/getFeedbackLinks/:businessAdminId");
exports.default = router;
