export const validateAnswer = (section: any) => {

    const textareaSchema = (answer: string) => {
        const maxChars = 1000;
        return !answer || answer.length <= maxChars;
    };

    const errorMessages = {
        required: 'Answer is required.',
        fileSize: 'File size should not exceed 5MB.',
        maxChars: "Answer can't have more than 1000 characters.",
    };

    const transformedErrors = [];

    const sectionTitle = section.title;
    const questions = section.questions;

    for (const question_ of questions) {
        const { id, answerFormat, required, answer, question } = question_;

        if (required && (answer === null || answer.length === 0)) {
            transformedErrors.push({ sectionTitle, question, error: errorMessages.required });
            return transformedErrors;
        }

        if (answer !== null) {

            if (answerFormat === 'textarea' && !textareaSchema(answer)) {
                transformedErrors.push({ sectionTitle, question, error: errorMessages.maxChars });
                return transformedErrors;
            }
        }
    }

    return null;
};