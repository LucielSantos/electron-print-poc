export interface PrintPhotoParams {
  photoPath: string;
  dimensions: string;
  printer: string;
  resize: "contain" | "cover";
}
