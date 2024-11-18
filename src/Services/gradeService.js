const BASE_URL = import.meta.env.VITE_API_URL

export const gradeService = {

    getAllGrades: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/grade/all`, {
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
            const response = await fetch(`${BASE_URL}/grade/all-paginated?page=${page}&size=${size}`,
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
    getGradebyId: async (id, token) => {
        const response = await fetch(`${BASE_URL}/grade/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }

        const data = await response.json()

        return data
    },
    createGrade: async (grade, token) => {
        try {
            const response = await fetch(`${BASE_URL}/grade/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: grade.name,
                    idGoverment: grade.idGoverment,
                    section: grade.section,
                    idShift: grade.idShift
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear el grado: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
    },
    deleteGrade: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/grade/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            return response.text();

        } catch (error) {
            throw error;
        }
    },
    updateGrade: async (id, token, grade) => {
        try {
            const response = await fetch(`${BASE_URL}/grade/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: grade.name,
                    idGoverment: grade.idGoverment,
                    section: grade.section,
                    idShift: grade.idShift
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
    },
    getGradesByShift: async (token, shiftId) => {
        try {
            const response = await fetch(`${BASE_URL}/grade/by?shiftId=${shiftId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            
            if (!response.ok) {
                throw new Error('Error getting grades: ' + response.status);
            }
    
            const data = await response.json()
    
            return data
        } catch (error) {
            throw error;
        }
    },

}