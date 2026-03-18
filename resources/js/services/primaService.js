import axios from "axios";

const API_EXterna =
    "https://68fe50c97c700772bb13737d.mockapi.io/api/test/quotes";

export const cotizarPrima = async (data) => {
    try {
        const response = await axios.post(API_EXterna, data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener la prima", error);
        throw error;
    }
};
