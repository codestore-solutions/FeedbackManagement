// jwt auth constants 
export const auth_constant = {
    secret: "safmdknfsdDKFKN122sdnmkfnsJDKNF23234Sssds"
}

export const feedbackFormUrl = 'https://feedback-form-dev.azurewebsites.net/feedback-form'

export enum TemplateType {
    CUSTOM = 1,
    DEFAULT = 2
} 

const FieldTypesMap: Record<
    string,
    {
        value: string;
        label: string;
        needsOptions?: boolean;
        isTextType?: boolean;
        needsUpperBound?: boolean;
        needTotalFilesLimit?: boolean;
        needPerFileSizeLimit?: boolean;
    }
> = {
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

export const FieldTypes = Object.keys(FieldTypesMap);