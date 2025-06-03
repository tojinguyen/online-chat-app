// Helper function to create a download URL for a chat-illustration.svg file
export const createImageUrl = (imageName: string): string => {
  if (process.env.NODE_ENV === "development") {
    return `/${imageName}`;
  }
  return `/${imageName}`;
};
