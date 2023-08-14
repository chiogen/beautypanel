import * as React from 'react';

type CardProps = {
    title: string;
    contentStyle?: 'stacked' | 'inline-stretch' | 'none'
    children: JSX.Element | JSX.Element[]
};

const contentStyleClassMap = {
    'stacked': 'flex-stacked',
    'inline-stretch': 'flex stretch',
    'none': ''
} as const;

export const Card = ({ title, contentStyle, children }: CardProps) => {

    const contentClass = contentStyleClassMap[contentStyle ?? 'none'];

    return (
        <div className='card'>
            <h3 className="title">{title}</h3>
            <div className={contentClass}>
                {children}
            </div>
        </div>
    );
};