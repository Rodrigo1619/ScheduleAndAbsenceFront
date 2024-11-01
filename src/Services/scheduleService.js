const BASE_URL = import.meta.env.VITE_API_URL

export const scheduleService = {

    getSchedules: async (token) => {
        const response = await fetch(`${BASE_URL}/schedule/all`, {
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
    getPagedSchedules: async (token, size, page) => {
        const response = await fetch(`${BASE_URL}/schedule/all-paginated?page=${page}&size=${size}`, {
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

    deleteSchedule: async (ids, token) => {
        try {
            const response = await fetch(`${BASE_URL}/schedule/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(ids)
            });
        
            if (!response.ok) {
                throw new Error('Error deleting schedule: ' + response.status);
            }
        
            return response.text();
            
        } catch (error) {
            console.log(`Hubo un error al eliminar el horario: ${error}`);
            throw error;
        }
    },

    createSchedule: async (token, schedules) => {
        console.log(schedules)
        try {
            const response = await fetch(`${BASE_URL}/schedule/`, {
                method: 'POST',
                
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(
                    schedules
                )
             
            });
            

            if (!response.ok) {
                throw new Error('Hubo un error al crear el horario: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
        
    },

    updateSchedule: async (id, schedule, token) => {
        try {
            const response = await fetch(`${BASE_URL}/schedule/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    id_userxsubject: schedule.id_userxsubject,
                    id_classroom: schedule.id_classroom,
                    startHour: schedule.startHour,
                    endHour: schedule.endHour
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
        
            if (!response.ok) {
                throw new Error('Error updating schedule: ' + response.status);
            }
        
            return response.text();
            
        } catch (error) {
            console.log(`Hubo un error al actualizar el horario: ${error}`);
            throw error; // Esto permite que los componentes que llaman a esta función capturen y manejen el error
        }
    },

    getScheduleByUserId: async (token, userID, year) => {
        try {
            
            const response = await fetch(`${BASE_URL}/schedule/user/${userID}/${year}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok){
                throw new Error('Error getting schedule: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },

    getScheduleByClassroomId: async (token, classroomID, year) => {
        try {
            
            const response = await fetch(`${BASE_URL}/schedule/classroom/${classroomID}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok){
                throw new Error('Error getting schedule: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },getAllSchedule: async (token) => {
        try {
            const response = await fetch(`${BASE_URL}/schedule/all`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error getting schedule: ' + response.status);
            }

            const data = await response.json();

            // Filtrar los datos para devolver solo los atributos principales
            const filteredData = data.map(item => ({
                id: item.id,
                hourStart: item.hourStart,
                hourEnd: item.hourEnd,
                userName: item.user_x_subject.user.name,
                subjectName: item.user_x_subject.subject.name,
                classroomName: item.classroom.grade.name,
                classroomYear: item.classroom.year,
                classroomShift: item.classroom.shift.name,
                weekday: item.weekday.day
            }));

            return filteredData;
        } catch (error) {
            throw error;
        }
    },

    getScheduleByToken: async (token, shift, year) => {
        try {
            const response = await fetch(`${BASE_URL}/schedule/user?shift=${shift}&year=${year}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error getting schedule: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },
    
    getScheduleByTokenShiftYear: async (token, shift, year) => {
        try {
            const response = await fetch(`${BASE_URL}/schedule/user?shift=${shift}&year=${year}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error getting schedule: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }
}
