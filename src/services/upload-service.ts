import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/types";

interface UploadSignatureResponse {
  signature: string;
  api_key: string;
  cloud_name: string;
  timestamp: number;
  public_id: string;
  folder: string;
  resource_type: string;
}

export const uploadService = {
  // Get a signature for Cloudinary upload
  getUploadSignature: async (
    resourceType: string
  ): Promise<ApiResponse<UploadSignatureResponse>> => {
    return await apiClient.post<
      UploadSignatureResponse,
      Record<string, unknown>
    >("/api/v1/uploads/file-signature", { resourceType });
  },

  // Upload a file to Cloudinary
  uploadToCloudinary: async (
    file: File,
    signature: string,
    apiKey: string,
    cloudName: string,
    timestamp: number,
    publicId: string,
    folder: string,
    resourceType: string
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("public_id", publicId);
    formData.append("folder", folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();
    return result.secure_url;
  },
};
