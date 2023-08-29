import React, { Dispatch } from "react";
import { Tabs } from "antd";
import QuestionFormat from "../QuestionFormat";
import {
  ErrorProp,
  FeedbackFormBodySchema,
  OnChangeHandlerFn,
} from "@/pages/feedback-form/[feedback]";
import UserForm from "../UserForm/UserForm";

type TabPosition = "left" | "right" | "top" | "bottom";

interface TabinationProps {
  mode: TabPosition;
  isMobile: boolean;
  template: FeedbackFormBodySchema;
  onChange: OnChangeHandlerFn;
  activeTabKey: number;
  errors: ErrorProp;
  setErrors: Dispatch<React.SetStateAction<ErrorProp>>;
}

export default function Tabination({
  mode,
  isMobile,
  template,
  onChange,
  activeTabKey,
  errors,
  setErrors,
}: TabinationProps) {
  return (
    <Tabs
      activeKey={`${activeTabKey}`}
      tabPosition={isMobile ? "top" : "left"}
      className="w-full"
      onTabClick={() => {}}
      items={template.sections.map((item: any) => {
        return {
          label: item.title,
          key: `${item.id}`,
          children: (
            <QuestionFormat
              setErrors={setErrors}
              errors={errors}
              sectionId={item.id}
              questions={item.questions}
              onChange={onChange}
            />
          ),
        };
      })}
    />
  );
}
