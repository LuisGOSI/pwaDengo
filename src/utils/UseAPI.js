import { useState } from "react";

//Hook para consumir APIs
export const useAPI = (baseURL) => {
  const [loading, setLoading] = useState(false); //Estado de carga
  const [error, setError] = useState(null); //Estado de errores

  const request = async (method, endpoint, data) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`API Request → ${method} ${baseURL}${endpoint}`, data || "");

      const res = await fetch(`${baseURL}${endpoint}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if(!res.ok){
        console.error('API Error Response:',res.status,res.statusText)
        throw new Error(`Error en la petición: ${res.status}`);
      }

      const json = await res.json();
      console.log("API Response: ",json)
      return json

    } catch (error) {
        setError(error.message);
        console.error("ERROR INTERNO:",error)
        return null;
    }
    finally{
        setLoading(false);
    }
  };

  return {
    loading, //Manejar estado de carga
    error, //Manejar errores
    get: (endpoint)=> request("GET",endpoint), //Metodo GET
    post: (endpoint,data)=> request("POST",endpoint,data), //Metodo POST
    put: (endpoint,data)=> request("PUT",endpoint,data), //Metodo PUT
    del: (endpoint)=> request("DELETE",endpoint), //Metodo DELETE
  }
};
