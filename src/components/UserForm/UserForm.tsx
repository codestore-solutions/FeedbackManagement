import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";

interface UserFormProps {
  addUserData: (user: string) => void;
  submitHandler: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ addUserData, submitHandler }) => {
  const [form] = Form.useForm();
  const [isInputEmpty, setInputEmpty] = useState(true);
  const [isEditable, setIsEditable] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputEmpty(value.trim() === "");
    addUserData(value);
  };

  const onFinish = () => {
    submitHandler();
  };

  // useEffect(() => {
  //   const userString = localStorage.getItem("user");
  //   if (userString) {
  //     try {
  //       const userObject = JSON.parse(userString);
  //       if (userObject && userObject.name) {
  //         form.setFieldsValue({ name: userObject.name });
  //         addUserData(userObject.name);
  //         setInputEmpty(false);
  //         setIsEditable(false);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing user data from local storage:", error);
  //     }
  //   }
  // }, []);

  return (
   
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          className="mt-5"
          label={<span className="no-asterisk-label">Submit Feedback As</span>}
          colon={false}
          required
          rules={[
            {
              required: true,
              message: "Customer name is required.",
            },
          ]}
        >
          <Input placeholder="Customer Name" disabled={ !isEditable && form.getFieldValue("name") ? true: false} onChange={handleInputChange} />
        </Form.Item>
      <Form.Item>
        <div className="flex justify-end pt-3">
          <Button
            type="primary"
            className="bg-[#4096ff]"
            htmlType="submit"
            disabled={isInputEmpty}
          >
            Submit
          </Button>
        </div>
      </Form.Item>
      </Form>
   
  );
};

export default UserForm;
