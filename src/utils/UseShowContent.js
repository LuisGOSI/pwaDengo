import { useState } from "react";
export const useShowContent = () => {
  const [objEdit, setObjEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    setObjEdit(null); //Si se agrega un nuevo objeto, no hay objeto siendo editado
    setShowForm(true); //Se muestra el form para agregar
  };

  const handleEdit = (obj) => {
    setObjEdit(obj); //Si hay objeto, se esta editando
    setShowForm(true); //Se muestra el form para editar
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

    return {
    objEdit,
    showForm,
    handleAdd,
    handleEdit,
    handleCloseForm
  };
};
