/**
 * Compresses a base64 image or a File object to a target size (default 200KB)
 * and returns it as a base64 string.
 */
export const compressImage = (source, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = typeof source === 'string' ? source : URL.createObjectURL(source);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to base64 with quality control
      const compressed = canvas.toDataURL('image/jpeg', quality);
      resolve(compressed);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
};
