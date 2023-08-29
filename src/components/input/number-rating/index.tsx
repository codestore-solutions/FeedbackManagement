import React from 'react';
import { Rate } from 'antd';

interface NumberRatingProps {
    count: number;
    onChange: (value: number) => void;
}

export default function NumberRating({ count, onChange }: NumberRatingProps) {
    return (
        <Rate
            count={count}
            onChange={onChange}
            className="number-rating"
            character={({ index, value }: { index: number; value: number }) => (
                <p className={value === index + 1 ? 'active' : 'not-active'}>
                    {index + 1}
                </p>
            )}
        />
    );
}
