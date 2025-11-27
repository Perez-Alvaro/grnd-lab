/**
 * Converts an image URL to base64 data URI
 * Required for @react-pdf/renderer which doesn't handle all URL types
 */
export const imageToBase64 = async (url) => {
  if (!url || url.trim() === "") {
    return null;
  }

  // If already base64, return as-is
  if (url.startsWith("data:")) {
    return url;
  }

  try {
    // Fetch the image
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return null;
    }

    // Convert to blob
    const blob = await response.blob();

    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};
