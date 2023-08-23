export interface sectionInterface {
    id: number;
    title: string;
    order: number;
    questions: {
        id: number
        question: string;
        answerFormat: {
            type: string;
            options?: string[];
            upperBound?: number;
        }[];
        required: boolean;
        order: number;
    }[]
}

export interface FeedbackFormBodySchema {
    businessCategory?: number;
    feedbackType: string;
    feedbackFormName: string;
    sections: sectionInterface[];
}

export interface SectionResponse {
    id: number;
    questions: { id: number; answer: any }[];
}


interface AnswerDTO {
    id: number;
    answer: string;
}

interface QuestionDTO {
    id: number;
    answers: AnswerDTO[];
}

interface SectionDTO {
    id: number;
    questions: QuestionDTO[];
}

export interface TemplateResponseDTO {
    authorId: string;
    entityId: string;
    entityName: string;
    authorName?: string;
    sectionResponse: SectionDTO[];
}


export interface BusinessAdminInterface {
    businessAdminId: number;
    businessCategory: number
}

export interface LinkBodyDto {
    entityId: string;
    entityName: string;
}