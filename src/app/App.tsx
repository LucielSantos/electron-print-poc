import { PrinterInfo } from "electron";
import React, { useEffect } from "react";
import { dimensions } from "../constants/dimensions";
import { ImageInput, Select } from "./components";

export const App = () => {
  const [image, setImage] = React.useState<File | null>(null);
  const [resize, setResize] = React.useState<"cover" | "contain">("contain");
  const [printers, setPrinters] = React.useState<PrinterInfo[]>([]);
  const [printer, setPrinter] = React.useState<string>();
  const [dimension, setDimension] = React.useState<string>(dimensions[0].value);

  const handlePrint = async () => {
    console.log("handlePrint");

    const printerObj = printers.find((print) => print.name === printer);

    console.log(printerObj);
    console.log(image);

    if (!image || !printer) return;

    await window.electron.ipcRenderer.invoke("print-photo", {
      photoPath: image.path,
      dimensions: dimension,
      resize,
      printer,
    });
  };

  const handleChangeImage = (value: File | null) => setImage(value);

  // const handleChangeDimensions =
  //   (dimension: keyof typeof dimensions2) => (value: string) => {
  //     setDimensions2((prev) => ({
  //       ...prev,
  //       [dimension]: value,
  //     }));
  //   };

  const handleChangeResize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResize(e.target.value as "cover" | "contain");
  };

  const handleChangePrinter = (value: string) => {
    setPrinter(value);
  };

  const handleChangeDimension = (value: string) => {
    setDimension(value);
  };

  useEffect(() => {
    (async () => {
      const printers = (await window.electron.ipcRenderer.invoke(
        "get-printers"
      )) as unknown as PrinterInfo[];

      console.log(printers);

      setPrinters(printers);
    })();
  }, []);

  return (
    <main className="flex flex-col m-5 gap-4 items-start">
      <ImageInput
        onChange={handleChangeImage}
        name="imagePath"
        label="Imagem"
        placeholder="Selecione uma imagem"
      />

      <Select
        name="printer"
        label="Impressora"
        value={printer}
        onChange={handleChangePrinter}
      >
        {printers.map((printer) => (
          <option key={printer.name} value={printer.name}>
            {printer.displayName}
          </option>
        ))}
      </Select>

      <div className="flex gap-4">
        <Select
          name="dimension"
          label="Dimensão (centímetros)"
          value={dimension}
          onChange={handleChangeDimension}
        >
          {dimensions.map((value) => (
            <option key={value.value} value={value.value}>
              {value.label}
            </option>
          ))}
        </Select>

        {/* <Input
          label="Altura"
          type="number"
          value={dimensions2.height}
          onChange={handleChangeDimensions("height")}
        />

        <Input
          label="Largura"
          type="number"
          value={dimensions2.width}
          onChange={handleChangeDimensions("width")}
        /> */}
      </div>

      <div className="flex flex-col gap-2">
        <span>Redimensionamento</span>

        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="contain"
              value="contain"
              onChange={handleChangeResize}
              checked={resize === "contain"}
            />

            <label htmlFor="contain">
              Manter proporção sem cortar a imagem (com margem) (Centímetros)
            </label>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              name="cover"
              value="cover"
              onChange={handleChangeResize}
              checked={resize === "cover"}
            />

            <label htmlFor="cover">
              Manter proporção e cortar a imagem (sem margem) (Centímetros)
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="rounded-lg bg-orange-500 text-white flex px-5 py-2"
      >
        Imprimir
      </button>
    </main>
  );
};
