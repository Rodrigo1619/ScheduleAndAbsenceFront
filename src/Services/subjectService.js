const BASE_URL = import.meta.env.VITE_API_URL

export const subjectService = {
    getAllSubjects: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/subject/all`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            console.log("Dentro de la peticion: " + data);

            return data;

        } catch (error) {
            console.log(error);
        }
    },
    deleteSubject: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/subject/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
    
            return response.text();
    
        } catch (error) {
            console.log(`Hubo un error al eliminar el código: ${error}`);
        }
        
    },
    createSubject: async (subject, token) => {
        try {
            const response = await fetch(`${BASE_URL}/subject/`, {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: subject.name
                }),
            })

            if (!response.ok) {
                throw new Error(response.status);
            }
    
            return response.text();
    
        } catch (error) {
            console.log(`Hubo un error al crear el código: ${error}`);
            throw error; 
        }
        
    },
    updateSubject: async (id, subject, token) => {
        try {
            const response = await fetch(`${BASE_URL}/subject/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: subject.name
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
        
            if (!response.ok) {
                throw new Error('Error updating subject: ' + response.status);
            }
        
            return response.text();
            
        } catch (error) {
            console.log(`Hubo un error al actualizar el código: ${error}`);
            throw error; // Esto permite que los componentes que llaman a esta función capturen y manejen el error
        }
    },

    getSubjectByUserId: async (userId, token) => {
        try {
            const response = await fetch(`${BASE_URL}/subject/get-subject-by-userId/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            console.log("Dentro de la peticion: " + data);

            return data;

        } catch (error) {
            console.log(error);
        }
    },

    getPaginatedSubjects: async (token, size, page) => {
        try {
            const response = await fetch(`${BASE_URL}/subject/all-paginated?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }
    
            const data = await response.json();
    
            return data;
        } catch (error) {
            console.log("Hubo un error obteniendo las materias", error);
            throw error;
        }
    }
    
};