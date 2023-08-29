import { Rate, Tooltip } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { ReactNode } from 'react';


const emojiTooltips: Record<number, string> = {
    1: 'Terrible',
    2: 'Bad',
    3: 'Average',
    4: 'Happy',
    5: 'Amazing',
};

const customEmojiIcons: Record<number, ReactNode> = {
    1: <FrownOutlined />,
    2: <FrownOutlined  />,
    3: <MehOutlined />,
    4: <SmileOutlined  />,
    5: <SmileOutlined  />,
};

interface EmojiRatingProps {
    count: number;
    onChange: (value: number) => void;
}

export default function EmojiRating({ count, onChange }: EmojiRatingProps) {
    return (
        <Rate
            count={5}

            character={({ index, value }: { index: number; value: number }) => (
                <Tooltip title={emojiTooltips[index + 1]}>
                    <span className={`emoji ${value === index + 1 ? 'active' : 'not-active'}`}>
                        {customEmojiIcons[index + 1]}
                    </span>
                </Tooltip>
            )}
            onChange={onChange}
        />
    );
}
