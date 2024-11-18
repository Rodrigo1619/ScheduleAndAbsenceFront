const BASE_URL = import.meta.env.VITE_API_URL

export const absenceRecordService = {
    getByClassroomAndShift: async (id_classroom, token, shiftID) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/get-by-classroom-shift/${id_classroom}?shift=${shiftID}`, {
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
            throw (error);
        }
    },
    getByClassroomAndDate: async (classroomId, token, date) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/by-classroom/${classroomId}?date=${date}`, {
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
            throw (error);
        }
    },
    getRecordsWithoutCoodinationValidation: async (token, date) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/count-no-coordination-validation?date=${date}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
    
            if (!response.ok) {
                throw new Error(response.status);
            }
    
            const data = response.text()
    
            return data
            
        } catch (error) {
            throw (error);
        }
    },
    getTopAbsentStudentByMonthBothShifts: async (token, date) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/top-absent-students?date=${date}`, {
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
            throw (error);
        }
    },
    teacherValidation: async (token, absenceRecordID) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/toggle-teacher-active/${absenceRecordID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = response.text();

            return data;
        } catch (error) {
            throw (error);
        }
        
    },
    coordinatorValidation: async (token, absenceRecordID) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/toggle-coordination-active/${absenceRecordID}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = response.text();

            return data;
        } catch (error) {
            throw (error);
        }
    },
    createAbsenceRecord: async (token, absenceRecord, classroom) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: absenceRecord.date,
                    id_classroom: classroom.id,
                    maleAttendance: absenceRecord.maleAttendance,
                    femaleAttendance: absenceRecord.femaleAttendance,
                    absentStudents: absenceRecord.absentStudents
                })
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw (error);
        }
    },
    editAbsenceRecord: async (token, absenceRecord) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/${absenceRecord.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    updateDate: absenceRecord.date,
                    maleAttendance: absenceRecord.maleAttendance,
                    femaleAttendance: absenceRecord.femaleAttendance,
                    absentStudents: absenceRecord.absentStudents,
                    deleteAbsentStudents: absenceRecord.deleteAbsentStudents
                })
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw (error);
        }
    },
    deleteAbsentStudents: async (ids, token) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/absent-students`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(ids)
            });
        
            if (!response.ok) {
                throw new Error(response.status);
            }
        
            const data = await response.json();
            
        } catch (error) {
            throw error;
        }
    },

    getTop2ByTokenAndShiftAndYear : async (token, shift, year) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/top-absent-student-by-user?shift=${shift}&year=${year}`, 
                {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw (error);
        }
    },
    getAllAbsentStudentsByYear: async (classroomId, token, year) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/absent-student-count/${classroomId}?year=${year}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error(response.status);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw (error);
        }
    }
};