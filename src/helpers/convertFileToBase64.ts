const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = String(reader.result).split(",")[1];
      resolve(result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

export default convertFileToBase64;
