import React, { useState } from "react";

interface Props {
  onChange?: (value: File) => void;
  name?: string;
  label?: string;
  placeholder?: string;
}

export const ImageInput = ({ onChange, name, label, placeholder }: Props) => {
  const [path, setPath] = useState<string>("");
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];

    if (file) {
      setPath(file.path);
      onChange?.(file);
    }
  };

  const handleClickFind = () => {
    inputFileRef.current.click();
  };

  return (
    <div className="w-full">
      <label htmlFor={name}>{label}</label>

      <div className="flex gap-4 mt-1">
        <input
          name={name}
          className="w-full border-2 border-orange-500 rounded-lg px-4 py-2 bg-transparent"
          disabled
          value={path}
          placeholder={placeholder}
        />

        <button
          className="rounded-lg bg-orange-500 text-white flex px-5 py-2"
          onClick={handleClickFind}
        >
          Buscar
        </button>
      </div>

      <input
        className="w-full"
        type="file"
        hidden
        accept="image/*"
        onChange={handleChange}
        ref={inputFileRef}
      />
    </div>
  );
};
