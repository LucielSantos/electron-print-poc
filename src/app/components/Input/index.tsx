import React from "react";

interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  onChange?: (value: string) => void;
  name?: string;
  value?: string | number;
  label?: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
}

export const Input = ({
  label,
  name,
  onChange,
  placeholder,
  value,
  type,
  ...rest
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="w-full">
      <label htmlFor={name}>{label}</label>

      <input
        {...rest}
        name={name}
        className="w-full border-2 border-orange-500 rounded-lg px-4 py-2 bg-transparent"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        type={type}
      />
    </div>
  );
};
