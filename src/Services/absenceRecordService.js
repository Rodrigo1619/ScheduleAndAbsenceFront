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
    
            if (!response.ok) {
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
                throw new Error(response.status);
            }

            const data = await response.json();

            return data;
        } catch (error) {
            throw (error);
        }
    },
    editAbsenceRecord: async (token, absenceRecord) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/edit/${absenceRecord.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    date: absenceRecord.date,
                    id_classroom: absenceRecord.classroom.id,
                    maleAttendance: absenceRecord.maleAttendance,
                    femaleAttendance: absenceRecord.femaleAttendance,
                    absentStudents: absenceRecord.absentStudents
                
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
    getAllAbsentStudentsByYear: async (studentId, token, year) => {
        try {
            const response = await fetch(`${BASE_URL}/absence_record/all-absent-student/${studentId}?year=${year}`, {
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