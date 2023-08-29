import React, { Dispatch } from 'react';
import CheckboxInput from '../input/checkbox-input'
import StarRating from '../input/star-rating';
import EmojiRating from '../input/emoji-rating';
import MultilineInput from '../input/multiline-input';
import RadioInput from '../input/radio-input';
import FileInput from '../input/file-input';
import { AnswerTypeInterface, ErrorProp, OnChangeHandlerFn } from '@/pages/feedback-form/[feedback]';
import UserForm from '../UserForm/UserForm';
import NumberRating from '../input/number-rating';

interface AnswerFormat {
    type: string;
    options?: string[];
    required: boolean;
    upperBound?: number;
}

function Question({ question, required, error }: { question: string, required?: Boolean, error: string | null }) {
    return (
        <p className={` ${error ? 'text-red-600' : 'text-[#000]'} pb-2`}>
            <span className='mr-1'>•</span>
            {question}
            <span className='text-red-600 ml-1'>{required ? '*' : ''}</span>
        </p>
    )
}

export default function CreateAnswerFormat({ sectionId, questionId, question,
    answerFormat, onChange, errors, setErrors }: {
        sectionId: number;
        questionId: number;
        question: string;
        answerFormat: AnswerFormat;
        onChange: OnChangeHandlerFn;
        errors: ErrorProp;
        setErrors: Dispatch<React.SetStateAction<ErrorProp>>
    }) {
    const addUserData = () =>{};
    const { type, options, required, upperBound } = answerFormat;
    const error = errors[`${sectionId}_${questionId}`]

    const onChangeHandler = (value: AnswerTypeInterface) => {
        onChange(sectionId, questionId, type, value)
        setErrors((e) => {
            e[`${sectionId}_${questionId}`] = ""
            return e;
        })
    }

    switch (type) {
       
        case "checkbox":
            return <CheckboxInput
                error={error}
                text={question}
                onChange={onChangeHandler} />;

        case "starrating":
            return (
                <>
                    <Question
                        error={error}
                        question={question}
                        required={required} />
                    <StarRating
                        count={upperBound ?? 5}
                        onChange={onChangeHandler} />
                    {error && <p className='text-red-600 ml-1 mt-2'>{error}</p>}

                </>
            );

        case "emojirating":
            return (
                <>
                    <Question
                        error={error}
                        question={question} required={required} />
                    <EmojiRating
                        count={upperBound ?? 5}
                        onChange={onChangeHandler} />
                    {error && <p className='text-red-600 ml-1 mt-2'>{error}</p>}

                </>
            );
        case "textarea":
            return (
                <>
                    <Question
                        error={error}
                        question={question} required={required} />
                    <MultilineInput
                        minRows={1}
                        onChange={onChangeHandler} />
                    {error && <p className='text-red-600 ml-1 mt-2'>{error}</p>}

                </>
            );
        case "radio":
            return (
                <>
                    <Question
                        error={error}
                        question={question} required={required} />
                    <RadioInput
                        options={options ?? []}
                        onChange={onChangeHandler} />
                    {error && <p className='text-red-600 ml-1 mt-2'>{error}</p>}

                </>
            );
        case "file":
            return (
                <>
                    <Question
                        error={error}
                        question={question} required={required} />
                    <FileInput onChange={onChangeHandler} />
                    {error && <p className='text-red-600 ml-1 mt-2'>{error}</p>}
                </>
            );
        case "numberrating":
             return (
                  <>
                  <Question
                        error={error}
                        question={question} required={required} />
                        <NumberRating
                        count={upperBound ?? 5}
                        onChange={onChangeHandler} />
                    {error && <p className='text-red-600 ml-1 mt-2'>{error}</p>}
                  </>
             )
        default:
           
            return null;
    }
}