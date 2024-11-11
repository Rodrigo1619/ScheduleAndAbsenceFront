const BASE_URL = import.meta.env.VITE_API_URL

export const userxSubjectService = {

    getUserxSubjects: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/user_x_subject/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if(response.status === 204){
                return [];
            } else if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },

    getPagedUserXSubjects: async (token, size, page) => {
        try {
            const response = await fetch(`${BASE_URL}/user_x_subject/all-paginated?page=${page}&size=${size}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if(response.status === 204){
                return [];
            } else if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },

    createUserxSubject: async (userxsubject, token) => {
        try {
            const response = await fetch(`${BASE_URL}/user/assig-subject`, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_user: userxsubject.id_user,
                    id_subject: userxsubject.id_subject
                }),
            })

            if (!response.ok) {
                throw new Error('Hubo un error al crear el usuario y materia: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
    },

    deleteUserxSubject: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/user_x_subject/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Hubo un error al eliminar la asignación de materia a profesor: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
    }
}