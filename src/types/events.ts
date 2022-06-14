export interface PrintPhotoParams {
  photoPath: string;
  height: number;
  width: number;
  printer: string;
  resize: "contain" | "cover";
}
