const BASE_URL = import.meta.env.VITE_API_URL

export const studentService = {

    getStudents: async (token) => {
        const response = await fetch(`${BASE_URL}/student/all`, {
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
    getPagedStudents: async (token, size, page) => {
        const response = await fetch(`${BASE_URL}/student/all-paginated?page=${page}&size=${size}`, {
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

    deleteStudent: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            return response.text();

        } catch (error) {
            throw error;
        }
        
    },

    createStudent: async (student, token) => {
        try {
            const response = await fetch(`${BASE_URL}/student/`, {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nie: student.nie,
                    name: student.name
                }),
            })

            if (!response.ok) {
                throw new Error('Hubo un error al crear el estudiante: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
        
    },

    updateStudent: async (id, student, token) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    nie: student.nie,
                    name: student.name
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
        
            if (!response.ok) {
                throw new Error('Error updating student: ' + response.status);
            }
        
            return response.text();
            
        } catch (error) {
            throw error; // Esto permite que los componentes que llaman a esta función capturen y manejen el error
        }
    },

    toggleStatus: async (token, id) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${id}/toggle-active`, 
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error
        }
    },

    getStudentNew: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/student/new`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            const data = await response.json();

            return data;

        } catch (error) {
            throw error;
        }
    },

    enrollStudents: async (token, students, classroom) => {
        try {
            const response = await fetch(`${BASE_URL}/student/enroll`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    idEnrollments: students,
                    idClassroom: classroom
                })
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
    }
}