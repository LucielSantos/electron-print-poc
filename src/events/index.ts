import { ipcMain, Notification } from "electron";
import { mainWindow } from "..";
import { PrintPhotoParams } from "../types/events";
import { pathToBase64 } from "../utils/image";
import { printPhoto } from "../utils/printPhoto";

ipcMain.handle(
  "print-photo",
  async (
    _,
    { photoPath, height, width, resize, printer }: PrintPhotoParams
  ) => {
    console.log("Print on main process");

    const photoBase64 = await pathToBase64(photoPath);

    try {
      await printPhoto(
        { imgSrc: photoBase64, resize },
        { height, width, printer }
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
  return mainWindow.webContents.getPrinters();
});
