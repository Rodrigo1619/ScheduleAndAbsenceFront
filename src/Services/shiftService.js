const BASE_URL = import.meta.env.VITE_API_URL

export const shiftService = {
    getAllShifts: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/shift/all`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Dentro de la peticion: ", data);
            return data;

        } catch (error) {
            console.error("Error fetching all shifts:", error);
            return { error: error.message };
        }
    },

    getShiftbyId: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/shift/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error(`Error fetching shift with ID ${id}:`, error);
            return { error: error.message };
        }
    }
};