import { useState } from "react";

export const useForm = (initialForm = {}) => {
  const [formData, setFormData] = useState(initialForm);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let newValue = value;

    // Manejo de checkbox
    if (type === "checkbox") {
      newValue = checked;
    }

    // Manejo de number
    if (type === "number") {
      newValue = value === "" ? "" : Number(value);
    }

    // Manejo de archivos
    if (type === "file") {
      newValue = files.length === 1 ? files[0] : files;
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const resetForm = () => setFormData(initialForm);

  return { formData, handleInputChange, resetForm, setFormData };
};
