import React, { useState } from "react";
import { Input, Typography } from "antd";
const {Text} = Typography;

type FieldType = {
  name?: string;
};

export default function UserForm({ addUserData }: { addUserData: any,  }) {
  const [name, setName] = useState<string>("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName) {
      const userData: FieldType = { name: newName };
      addUserData(userData);
    }
  };

  return (
    <div className="flex">
        <div className="pt-2">
          <label htmlFor="name" className="pb-2 text-sm">
           <Text type='danger'>*</Text>  Enter Your Name</label>
          <Input
            id="name"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="my-1"
          />
        </div>
    </div>
  );
}
