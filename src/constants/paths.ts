import os from "os";
import path from "path";

export const appPath = path.join(os.homedir(), "vyoo-print-photo");

export const htmlFolderPath = path.resolve(appPath, "templates", "printPhoto");
export const htmlPath = path.resolve(htmlFolderPath, "index.html");

export const pdfFolderPath = path.join(appPath, "pdf");
export const pdfPath = path.join(pdfFolderPath, "index.pdf");

export const imgPath = path.join(appPath, "images");
