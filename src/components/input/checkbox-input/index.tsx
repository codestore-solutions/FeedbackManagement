import { Checkbox } from "antd";
import { useState } from 'react';

interface CheckboxInputProps {
    onChange: (selectedOptions: string[]) => void; // Change the type to accept an array of strings
    text: string;
    error?: string;
    options: string[]; // Assuming options is an array of strings
}

export default function CheckboxInput(
    { text, onChange, error, options }: CheckboxInputProps) {
  
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [answer, setAnswer] = useState<string[]>([]);

    // Handler to update selected options and call the onChange function
    const onChangeHandler = (index: number, item: string) => {
        const newSelectedOptions = [...selectedOptions];
        const newAnswer = [...answer];

        // Toggle the selection
        if (newSelectedOptions.includes(item)) {
            newSelectedOptions.splice(newSelectedOptions.indexOf(item), 1);
            newAnswer.splice(newAnswer.indexOf(item), 1);
        } else {
            newSelectedOptions.push(item);
            newAnswer.push(item);
        }

        setSelectedOptions(newSelectedOptions);
        setAnswer(newAnswer);
        onChange(newAnswer); // Call the onChange function with the updated answer
    }

    console.log("create", answer);

    return (
        <>
            {options.map((item, index) => (
                <Checkbox
                    key={item}
                    checked={selectedOptions.includes(item)}
                    onChange={() => onChangeHandler(index, item)}
                >
                    {item}
                </Checkbox>
            ))}
            
            {error && <p className='text-red-600 ml-1 mt-2'>{error}</p>}
        </>
    )
}
