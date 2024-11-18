const BASE_URL = import.meta.env.VITE_API_URL

export const roleService = {
    getAllRoles: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/role/all`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            return data;

        } catch (error) {
            throw error;
        }
    },
    getAllPaginated: async (token, size, page) => {
        try {
            const response = await fetch(`${BASE_URL}/role/all-paginated?page=${page}&size=${size}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json()
            
            return data

        } catch (error) {
            throw error;
        }
    },

};