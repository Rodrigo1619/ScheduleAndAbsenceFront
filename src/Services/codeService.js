const BASE_URL = import.meta.env.VITE_API_URL

export const codeService = {
    getAllCodes: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/code/all`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },
    deleteCode: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/code/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
    
            return response.text();
    
        } catch (error) {
        }
        
    },
    createCode: async (code, token) => {
        try {
            const response = await fetch(`${BASE_URL}/code/`, {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    number: code.number,
                    description: code.description
                }),
            })
    
            return response.text();
    
        } catch (error) {
        }
        
    },
    updateCode: async (id, code, token) => {
        try {
            const response = await fetch(`${BASE_URL}/code/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    number: code.number,
                    description: code.description
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
        
            if (!response.ok) {
                throw new Error('Error updating code: ' + response.status);
            }
        
            return response.text();
            
        } catch (error) {
            throw error; // Esto permite que los componentes que llaman a esta función capturen y manejen el error
        }
    }
    
};