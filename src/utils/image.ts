import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

export const bufferToBase64 = async (buffer: Buffer) => {
  const str = buffer.toString("base64");
  const type = await fileTypeFromBuffer(buffer);

  const base64 = `data:${type.mime};base64,${str}`;

  return base64;
};

export const pathToBase64 = async (path: string) => {
  const buffer = fs.readFileSync(path);

  return bufferToBase64(buffer);
};
