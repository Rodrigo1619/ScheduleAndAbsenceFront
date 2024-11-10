const BASE_URL = import.meta.env.VITE_API_URL

export const classroomService = {

    getAllClassrooms: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            
            if(response.status === 204){
                return [];
            }else if (!response.ok) {
                throw new Error(response.status);
            }
    
            const data = await response.json()
    
            return data
        } catch (error) {
            throw error;
        }
    },

    getClassroomsByShiftAndYear: async (token, shift, year) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/all?shift=${shift}&year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            
            if (!response.ok) {
                throw new Error('Error getting classrooms: ' + response.status);
            }
    
            const data = await response.json()
    
            return data
        } catch (error) {
            console.log(`Hubo un error al obtener los salones: ${error}`);
            throw error;
        }
    },

    getPagedClassrooms: async (token, size, page) => {
        const response = await fetch(`${BASE_URL}/classroom/all-paginated?page=${page}&size=${size}`, {
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

    getByParameters: async (token, year, gradeId, shiftId) => {
        const response = await fetch(`${BASE_URL}/classroom/by?gradeId=${gradeId}&year=${year}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }

        const data = await response.json()

        return data
    },

    getByUserAndYear: async (token, year) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/by-teacher?year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
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

    getClassStudentsByClassroomID: async (token, classroomID) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/${classroomID}/students`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            
            if(response.status === 204){
                return [];
            }else if (!response.ok) {
                throw new Error(response.status);
            }
    
            const data = await response.json()
    
            return data
        } catch (error) {
            throw error;
        }
    },

    getClassStudentsByNieAndYear: async (token, nie, year) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/students?nie=${nie}&year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            
            if (!response.ok) {
                throw new Error(response.status);
            }
    
            const data = await response.json()
    
            return data
        } catch (error) {
            throw error;
        }
    },

    deleteClassroom: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            return response.text();

        } catch (error) {
            console.log(`Hubo un error al eliminar el estudiante: ${error}`);
        }
        
    },

    createClassroom: async (classroom, token) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/`, {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    year: classroom.year,
                    idGrade: classroom.idGrade,
                    idTeacher: classroom.idTeacher,
                }),
            })

            if (!response.ok) {
                throw new Error(response.status);
            }
            
            return response.text();

        } catch (error) {
            console.log(`Hubo un error al crear el salon: ${error}`);
            throw error;
        }
        
    },
    
    updateClassroom: async (id, classroom, token) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    year: classroom.year,
                    idGrade: classroom.idGrade,
                    idTeacher: classroom.idTeacher,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
        
            if (!response.ok) {
                throw new Error(response.status);
            }
        
            return response.text();
            
        } catch (error) {
            console.log(`Hubo un error al actualizar el estudiante: ${error}`);
            throw error; // Esto permite que los componentes que llaman a esta función capturen y manejen el error
        }
    },

    getClassroomsByUserAndYear: async (token, year) => {
        try {

            const response = await fetch(`${BASE_URL}/classroom/by-teacher?year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error getting classrooms: ' + response.status);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(`Error getting classrooms: ${error}`);
            throw error;
        }
    },
    
    getClassroomsByUserYearAndShift: async (token, year, shift) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/by-teacher?year=${year}&shift=${shift}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.log(`Error getting classrooms: ${error}`);
            throw error;
        }
    },

    getEnrollmentsByClassroom: async (token, classroomID) => {
        const response = await fetch(`${BASE_URL}/classroom/${classroomID}/enrollments`, {
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

    addStudentsToClassroom: async (token, students, classroom) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    idStudents: students,
                    idClassroom: classroom
                }),
            });
            
            if (!response.ok) {
                throw new Error('Error adding students to classroom: ' + response.status);
            }
    
            const data = await response.json()
    
            return data
        } catch (error) {
            console.log(`Hubo un error al agregar estudiantes: ${error}`);
            throw error;
        }
    },


    getById: async (id, token) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
    
            if (!response.ok) {
                throw new Error(response.status);
            }
    
            const data = await response.json()
    
            return data
            
        } catch (error) {
            throw (error);
        }
    },

    editClassroomStudentsList: async (token, idEnrollments, idClassroom) => {
        try {
            const response = await fetch(`${BASE_URL}/classroom/students`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    idEnrollments: idEnrollments,
                    idClassroom: idClassroom
                }),
            });
            
            if (!response.ok) {
                throw new Error('Error editing enrollments: ' + response.status);
            }
    
            const data = await response.json()
    
            return data
        } catch (error) {
            console.log(`Hubo un error al editar la matrícula: ${error}`);
            throw error;
        }
    },

}