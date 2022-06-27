import { ipcMain, Notification } from "electron";
import { mainWindow } from "../";
import { PrintPhotoParams } from "../types/events";
import { pathToBase64 } from "../utils/image";
import { nativePrint } from "../utils/nativePrint";
import { printPhoto } from "../utils/printPhoto";

ipcMain.handle(
  "print-photo",
  async (
    _,
    { photoPath, dimensions, resize, savePDF, printer }: PrintPhotoParams
  ) => {
    console.log("Print on main process");

    const photoBase64 = await pathToBase64(photoPath);

    try {
      await printPhoto(
        { imgSrc: photoBase64, imgPath: photoPath, resize },
        { dimensions, printer, savePDF }
      );

      return true;
    } catch (error) {
      console.log(error);

      new Notification({
        title: "Ocorreu algum erro ao fazer a impressão",
        body: error.message,
      }).show();

      return false;
    }
  }
);

ipcMain.handle("get-printers", async () => {
  return mainWindow.webContents.getPrintersAsync();
});

ipcMain.handle(
  "test",
  async (_, { photoPath, printer, dimensions }: PrintPhotoParams) => {
    nativePrint({ imgSrc: photoPath, printer, dimensions });

    return true;
  }
);
