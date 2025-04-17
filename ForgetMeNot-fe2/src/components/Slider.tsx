import React from 'react';

type SliderProps = {
    min: number;
    max: number;
    step: number;
    value: number;
    onChange?: (value: number) => void;
    label: string;
    disabled?: boolean;
};

export const Slider: React.FC<SliderProps> = ({ min, max, step, value, onChange, label, disabled }) => {
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            const newValue = parseInt(e.target.value);
            if (onChange) {
                onChange(newValue);
            }
        }
    };

    return (
        <div className="flex flex-col justify-between md:flex-row">
            <div>{label}:</div>
            <input
                type="range"
                className="min-w-[15vw]"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleSliderChange}
                disabled={!onChange}
            />
        </div>
    );
};
