import * as yup from 'yup';

export const TemplateResponseDTOSchema = yup.object().shape({
    authorId: yup.string().required('Author ID is required'),
    entityId: yup.string().required('Entity ID is required'),
    entityName: yup.string().required('Entity name is required'),
    authorName: yup.string().optional(),
    sectionResponse: yup.array(
        yup.object().shape({
            id: yup.number().required(),
            questions: yup.array(
                yup.object().shape({
                    id: yup.number().required(),
                    answer: yup.mixed().required('Value is required')
                })
            ).required(),
        })
    ).required(),
});

export const validateResponseSchema = (data: any) => TemplateResponseDTOSchema.validate(data);

const linkBodySchema = yup.object().shape({
    entityId: yup.string().required('Entity ID is required'),
    entityName: yup.string().required('Entity name is required'),
});

export const validateLinkBodySchema = (data: any) => linkBodySchema.validate(data);
