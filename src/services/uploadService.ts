// src/services/uploadService.ts
import { API_URL, AUTH_STORAGE_KEYS } from "@/constants/authConstants";
import axios from "axios";

// Define the upload signature response structure
export interface UploadSignatureResponse {
  signature: string;
  timestamp: string;
  api_key: string;
  cloud_name: string;
  folder: string;
  public_id?: string;
}

// Define the Cloudinary upload response structure
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  signature: string;
  version: string;
  width: number;
  height: number;
  bytes: number;
  asset_id: string;
  url: string;
  original_filename: string;
}

// Get file upload signature from the server
export async function getUploadSignature(): Promise<UploadSignatureResponse> {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    const response = await axios.get(`${API_URL}/uploads/file-signature`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error getting upload signature:", error);
    throw new Error("Failed to get upload signature");
  }
}

// Upload file to Cloudinary using the signature
export async function uploadFileToCloudinary(
  file: File,
  signatureData: UploadSignatureResponse
): Promise<CloudinaryUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.api_key);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    if (signatureData.public_id) {
      formData.append("public_id", signatureData.public_id);
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/auto/upload`;

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw new Error("Failed to upload file");
  }
}

// Helper function to check if a file is an image
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

// Helper function to check if a file is a video
export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

// Helper function to check if a file is an audio
export function isAudioFile(file: File): boolean {
  return file.type.startsWith("audio/");
}

// Helper function to get a friendly file type name
export function getFileTypeName(file: File): string {
  if (isImageFile(file)) return "image";
  if (isVideoFile(file)) return "video";
  if (isAudioFile(file)) return "audio";

  // Document types
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  switch (fileExtension) {
    case "pdf":
      return "PDF document";
    case "doc":
    case "docx":
      return "Word document";
    case "xls":
    case "xlsx":
      return "Excel spreadsheet";
    case "ppt":
    case "pptx":
      return "PowerPoint presentation";
    case "txt":
      return "Text document";
    default:
      return "File";
  }
}
