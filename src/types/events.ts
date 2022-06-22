export interface PrintPhotoParams {
  photoPath: string;
  dimensions: string;
  printer: string;
  savePDF: boolean;
  resize: "contain" | "cover";
}
