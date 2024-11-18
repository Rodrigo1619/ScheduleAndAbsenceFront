const BASE_URL = import.meta.env.VITE_API_URL

export const userService = {

    login: async (mail, pass) => {
        try{
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: mail, 
                    password: pass
                }),
            });
    
            if (!response.ok) {
                throw new Error(response.status);
            }
    
            const data = await response.json()
    
            return data;

        } catch (error) {
            throw error;
        }
    },
    verifyToken: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/user/whoami`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw response.status;
                }

            const data = await response.json()

            return data

        } catch (error) {
            throw error;
        }
    },
    getAllTeachersAdmin: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/user/all`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

            const data = await response.json()

            return data

        } catch (error) {
            throw error;
        }
    },
    getAllPaginated: async (token, size, page) => {
        try {
            const response = await fetch(`${BASE_URL}/user/admin/all-paginated?page=${page}&size=${size}`,
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
    createTeacher: async (token, teacher ) => {
        try {
            const response = await fetch(`${BASE_URL}/auth/signup`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: teacher.name,
                        email: teacher.email,
                        password: teacher.password,
                        id_role: teacher.id_role,
                        verified_email: teacher.verified_email
                    }),
                })

            if (!response.ok) {
                throw new Error(response.status);
            }
            
            const data = await response.json()

            return data

        } catch (error) {
            throw error;
        }
    },
    updateTeacher: async (token, id, teacher) => {
        try {
            const response = await fetch(`${BASE_URL}/user/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: teacher.name,
                        email: teacher.email,
                        id_role: teacher.id_role,
                        verifiedEmail: teacher.verifiedEmail,
                    })
                })

            if (!response.ok) {
                throw new Error('Error updating student: ' + response.status);
            }
    
            return response.text();

        } catch (error) {
            throw error;
        }
    },
    deleteTeacher: async (token, id) => {
        try {
            const response = await fetch(`${BASE_URL}/user/delete/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

            if (!response.ok) {
                throw new Error('Error deleting student: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
    },

    getUserbyId: async (id, token) => {
        const response = await fetch(`${BASE_URL}/user/${id}`, {
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

    toggleStatus: async (token, id) => {
        try {
            const response = await fetch(`${BASE_URL}/user/${id}/toggle-active`, 
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

    getUsersBySubjectId: async (token, subjectId) => {
        try {
            const response = await fetch(`${BASE_URL}/user/subject/${subjectId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            const data = await response.json()

            return data

        } catch (error) {
            throw error;
        }
    },
    
    forgotPassword: async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/user/forgot-password?email=${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
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

    verifyCode: async (email, code) => {
        try {
            const response = await fetch(`${BASE_URL}/user/verify-code?email=${email}&code=${code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            const data = response.text();

            return data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async (email, code, newPassword) => {
        try {
            const response = await fetch(`${BASE_URL}/user/set-password?email=${email}&code=${code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'newPassword': newPassword
                }
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = response.text();

            return data;
        } catch (error) {
            throw error;
        }
    },
};