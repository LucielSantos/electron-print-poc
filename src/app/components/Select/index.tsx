import React from "react";

interface Props
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "value" | "onChange"
  > {
  onChange?: (value: string) => void;
  name?: string;
  value?: string | number;
  label?: string;
  placeholder?: string;
}

export const Select = ({
  label,
  name,
  onChange,
  placeholder,
  value,
  ...rest
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="w-full">
      <label htmlFor={name}>{label}</label>

      <select
        {...rest}
        name={name}
        className="w-full border-2 border-orange-500 rounded-lg px-4 py-2 bg-transparent"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </div>
  );
};
