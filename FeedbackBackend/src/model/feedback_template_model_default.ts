import mongoose, { Document, Schema, Types } from 'mongoose';
import { FieldTypes, TemplateType } from '../middlewares/enums/answerFormat_enum';

export interface AnswerFormat {
  type: string;
  required: boolean;
  options?: string[];
  upperBound?: number;
}

export interface QuestionAnswerFormField {
  id: number;
  question: string;
  order: number;
  answerFormat: AnswerFormat;
  activeStatus?: boolean;
}

export interface FeedbackFormat {
  id: number;
  title: string;
  order: number;
  questions: QuestionAnswerFormField[];
  activeStatus?: boolean;
}

export interface IFeedbackTemplate extends Document {
  templateName: string;
  templateType: TemplateType;
  feedbackType: number;
  businessCategory: number;
  sections: FeedbackFormat[];
  isActive: boolean;
}


const AnswerFormatSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: FieldTypes
  },
  required: {
    type: Boolean,
    required: true,
  },
  options: {
    type: [String],
    required: false,
    default: undefined
  },
  upperBound: {
    type: Number,
    required: false,
  }
}, { _id: false, minimize: true })


const QuestionAnswerFormFieldSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  answerFormat: {
    type: AnswerFormatSchema,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { _id: false })


const FeedbackFormatSchema: Schema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  questions: {
    type: [QuestionAnswerFormFieldSchema],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  }
}, { _id: false });


const FeedbackTemplateSchema: Schema = new Schema(
  {
    feedbackType: {
      type: Types.ObjectId,
      ref: 'FeedbackCategory',
      required: true,
    },
    templateName: {
      type: String,
      required: true,
    },
    businessCategory: { // ecommerce, food
      type: Number,
      required: false,
    },
    sections: {
      type: [FeedbackFormatSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true, versionKey: false, }
);

const FeedbackDefaultTemplate = mongoose.model<IFeedbackTemplate>('FeedbackDefaultTemplates', FeedbackTemplateSchema);

export default FeedbackDefaultTemplate;