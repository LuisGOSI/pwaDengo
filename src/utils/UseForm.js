import { useState } from "react";

export const useForm = (initialForm = {}) =>{
    const [formData, setFormData] = useState(initialForm);

    const handleInputChange = (e) =>{
        const {name,value,type,checked} = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked: value
        });
    }

    const resetForm = ()=> setFormData(initialForm);

    return {formData,handleInputChange,resetForm,setFormData};

}