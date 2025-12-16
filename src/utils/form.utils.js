export const buildProductFormData = (formData) => {
  const payload = new FormData();

  Object.keys(formData).forEach((key) => {
    if (key === "image_url") {
      // Xử lý riêng cho trường images
      if (formData[key] && formData[key].length > 0) {
        Array.from(formData[key]).forEach((file) => {
          if (file instanceof File) {
            payload.append("image_url", file);
          }
        });
      }
    } else {
      // Các trường text/number bình thường
      payload.append(key, formData[key]);
    }
  });

  return payload;
};