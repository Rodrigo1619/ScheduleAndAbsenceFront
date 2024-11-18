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
            throw error;
        }
    },

    createSchedule: async (token, schedules) => {
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
                throw new Error('Error: ' + response.status);
            }

            return response.text();

        } catch (error) {
            throw error;
        }
        
    },

    updateSchedule: async (token, schedules) => {
        try {
            const response = await fetch(`${BASE_URL}/schedule/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(schedules)
            });

            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            return response.text();
            
        } catch (error) {
            throw error;
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

            if(response.status === 204){
                return [];
            } else if(!response.ok){
                throw new Error('Error getting schedule: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },

    getScheduleByUserIdShiftYear: async (token, userId, shiftId, year) => {
        try {
            
            const response = await fetch(`${BASE_URL}/schedule/user/${userId}?shift=${shiftId}&year=${year}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 204){
                return null;
            } else if(!response.ok){
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

            if(response.status === 204){
                return null;
            } else if(!response.ok){
                throw new Error('Error getting schedule: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },
    
    getAllSchedule: async (token) => {
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

            if(response.status === 204){
                return null;
            } else if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    },

    getScheduleBySearchParameters: async (token, classperiod, shift, weekday, year, user, classroom) => {
        try {
            const response = await fetch(`${BASE_URL}/schedule/search?classperiod=${classperiod}&shift=${shift}
                &weekday=${weekday}&year=${year}&user=${user}&classroom=${classroom}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(response.status === 204){
                return null;
            } else if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw error;
        }
    }
}
