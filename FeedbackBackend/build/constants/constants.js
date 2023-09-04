"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldTypes = exports.TemplateType = exports.feedbackFormUrl = exports.auth_constant = void 0;
// jwt auth constants 
exports.auth_constant = {
    secret: "safmdknfsdDKFKN122sdnmkfnsJDKNF23234Sssds"
};
exports.feedbackFormUrl = 'https://feedback-form-dev.azurewebsites.net/feedback-form';
var TemplateType;
(function (TemplateType) {
    TemplateType[TemplateType["CUSTOM"] = 1] = "CUSTOM";
    TemplateType[TemplateType["DEFAULT"] = 2] = "DEFAULT";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
const FieldTypesMap = {
    text: {
        label: "Short Text",
        value: "text",
        isTextType: true,
    },
    file: {
        label: "File",
        value: "file",
        needTotalFilesLimit: true,
        needPerFileSizeLimit: true,
    },
    number: {
        label: "Number",
        value: "number",
        isTextType: true,
    },
    starrating: {
        label: "Star Rating",
        value: "number",
        needsUpperBound: true,
    },
    numberrating: {
        label: "Number Rating",
        value: "number",
        needsUpperBound: true,
    },
    emojirating: {
        label: "Emoji Rating",
        value: "number",
        needsUpperBound: true,
    },
    textarea: {
        label: "Long Text",
        value: "textarea",
        isTextType: true,
    },
    select: {
        label: "Select",
        value: "select",
        needsOptions: true,
        isTextType: true,
    },
    multiselect: {
        label: "MultiSelect",
        value: "multiselect",
        needsOptions: true,
        isTextType: false,
    },
    radio: {
        label: "Radio",
        value: "radio",
        needsOptions: true,
        isTextType: false,
    },
    checkbox: {
        label: "Checkbox",
        value: "checkbox",
        needsOptions: true,
        isTextType: false,
    },
};
exports.FieldTypes = Object.keys(FieldTypesMap);
