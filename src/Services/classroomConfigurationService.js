const BASE_URL = import.meta.env.VITE_API_URL

export const classroomConfigurationService = {

    getClassroomConfigurations: async (token) => {
        const response = await fetch(`${BASE_URL}/classroom-configuration/all`, {
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

    getClassroomConfigurationById: async (token, id) => {
        const response = await fetch(`${BASE_URL}/classroom-configuration/classroom/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        
        if(response.status === 204){
            return null;
        } else if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }

        const data = await response.json()

        return data
    },

    saveClassroomConfiguration: async (token, classroomConfiguration) => {
        const response = await fetch(`${BASE_URL}/classroom-configuration/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(classroomConfiguration)
        });
    
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }
    
        const data = await response.json();
    
        return data;
    },

    updateClassroomConfiguration: async (token, classroomConfiguration) => {
        const response = await fetch(`${BASE_URL}/classroom-configuration/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(classroomConfiguration)
        });
    
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }
    
        const data = await response.json();
    
        return data;
    },

    getAllByClassroomId: async (token, classroomId) => {
        const response = await fetch(`${BASE_URL}/classroom-configuration/classroom/${classroomId}`, {
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

    deleteClassroomConfiguration: async (token, id) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom-configuration/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
        
            const data = await response.json();

            return data;

        } catch (error) {
            throw new Error(response.status);
        }
    },

    deleteClassroomConfigurations: async (token, ids) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom-configuration/list`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(ids)
            });
        
            const data = await response.json();

            return data;

        } catch (error) {
        }
    }
    
}