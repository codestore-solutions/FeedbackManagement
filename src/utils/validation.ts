export const validateAnswer = (section: any) => {

    const textareaSchema = (answer: string) => {
        const maxChars = 1000;
        return !answer || answer.length <= maxChars;
    };

    const errorMessages = {
        required: 'Answer is required.',
        fileSize: 'File size should not exceed 5MB.',
        maxChars: "Answer can't have more than 1000 characters.",
        emptySpaces:" Answer can't have empty spaces",
        fileRequired:"Image is required"
    };

    const transformedErrors: Record<string, string> = {};

    const sectionId = section?.id;
    const questions = section?.questions;
    if(questions){
        for (const question_ of questions) {
            const { id, answerFormat, required, answer } = question_;
           
            if (required && (answer === null || answer.length === 0)) {
                if(answerFormat === 'file'){
                    transformedErrors[`${sectionId}_${id}`] = errorMessages.fileRequired;
                     return transformedErrors; 
                }
                transformedErrors[`${sectionId}_${id}`] = errorMessages.required;
                return transformedErrors;
            }
    
            if (answer !== null) {
                if (answerFormat === 'textarea') {
                    if (!textareaSchema(answer)) {
                        transformedErrors[`${sectionId}_${id}`] = errorMessages.maxChars;
                        return transformedErrors;
                    } else if (answer.length > 0 && answer.trim().length === 0 ) {
                        transformedErrors[`${sectionId}_${id}`] = errorMessages.emptySpaces;
                        return transformedErrors;
                    }
                }
            }
        }

    }

    return null;
};