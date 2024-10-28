import { Card, Option } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import classes from './AddHourConfigurationEditForm.module.css';
import AsyncSelect from '../../AsyncSelect/AsyncSelect.jsx';
import { userService } from '../../../Services/userService.js';
import { useUserContext } from '../../../Context/userContext.jsx';
import { shiftService } from '../../../Services/shiftService.js';
import { subjectService } from '../../../Services/subjectService.js';
import AddScheduleTable from '../../Add Schedule Table/AddScheduleTable.jsx';
import { classroomService } from '../../../Services/classroomService.js';
import AddHourConfigurationTable from '../../AddHourConfigurationTable/AddHourConfigurationTable.jsx';

const AddHourConfigurationEditForm = () => {

    const [teacher, setTeacher] = useState(null);
    const [subject, setSubject] = useState(null);
    const [classroom, setClassroom] = useState(null);
    const [shift, setShift] = useState(null);	
    const [year, setYear] = useState(null);
    const [teachersList, setTeachersList] = useState([]);
    const [subjectsList, setSubjectsList] = useState([]);
    const [shiftsList, setShiftsList] = useState([]);
    const [classroomsList, setClassroomsList] = useState([]);

    const { token } = useUserContext();

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const teachers = await userService.getAllTeachersAdmin(token);
                    const shifts = await shiftService.getAllShifts(token);
                    
                    setTeachersList(teachers.filter(teacher => teacher.role.name === "Profesor") || []);
                    setShiftsList(shifts || []);

                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        fetchData();
        console.log(classroomsList);
    }, [token]);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (token) {
                try {
                   
                    const subjects = await subjectService.getSubjectByUserId(teacher.id, token);
                    setSubjectsList(subjects || []);
                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        if (teacher) {
            fetchSubjects();
        }
    }, [teacher, token]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            if (token) {
                try {
                    const classrooms = await classroomService.getClassroomsByShiftAndYear(token, shift.id, year);
                    setClassroomsList(classrooms || []);
                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        fetchClassrooms();
    }, [shift, year, token]);


    useEffect(() => {
        setClassroom(null);
        setClassroomsList([]);
        const fetchClassrooms = async () => {
            if (token) {
                try {
                    const classrooms = await classroomService.getClassroomsByShiftAndYear(token, shift.id, year);
                    setClassroomsList(classrooms || []);
                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        fetchClassrooms();
    }, [shift]);

    useEffect(() => {
        setClassroom(null);
        setClassroomsList([]);
        const fetchClassrooms = async () => {
            if (token) {
                try {
                    const classrooms = await classroomService.getClassroomsByShiftAndYear(token, shift.id, year);
                    setClassroomsList(classrooms || []);
                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        fetchClassrooms();
    }, [year]);

    const handleSelectTeacherChange = (value) => {
        const teacher = teachersList.find(teacher => teacher.id === value);
        setTeacher(teacher);
    };

    const handleSelectSubjectChange = (value) => {
        const subject = subjectsList.find(subject => subject.id === value);
        setSubject(subject);
    }

    const handleSelectClassroomChange = (value) => {
        const classroom = classroomsList.find(classroom => classroom.id === value);
        setClassroom(classroom);
    }

    const handleSelectShiftChange = (value) => {
        const shift = shiftsList.find(shift => shift.id === value);
        setShift(shift);
    }

    return (
        <div className={classes["form-container"]}>
            <Card className='bg-transparent p-4 mx-4 border-0 shadow-none'>
                <div className={classes["form-container"]}>
                    <div className={classes["inputsContainer"]}>
                <div className={classes["input-container"]}>
                    <label className={classes["label"]}>Turno:</label>
                   <AsyncSelect
                        value={shift ? shift.id : ''}
                        onChange={handleSelectShiftChange}
                        className="bg-white Mobile-280:w-full"
                    >
                        {shiftsList?.map((shift) => (
                            <Option key={shift.id} value={shift.id}>
                                {shift.name}
                            </Option>
                        ))}
                    </AsyncSelect>
                </div>
                <div className={classes["input-container"]}>
                    <label className={classes["label"]}>Año:</label>
                    <input type="number" minLength="4" maxLength="4" min="2024" max="2099" 
                    pattern='[0-9]{4}' value={year} onChange={(e) => setYear(e.target.value)}
                    className="Mobile-280:w-full text-black border-2 text-center mx-auto border-black border-opacity-20" placeholder="Año" />
                </div>
                <div className={classes["input-container"]}>
                    <label className={classes["label"]}>Salón de clases:</label>
                   <AsyncSelect
                        value={classroom ? classroom.id : ''}
                        onChange={handleSelectClassroomChange}
                        className="bg-white Mobile-280:w-full"
                    >
                        {classroomsList?.map((classroom) => (
                            <Option key={classroom.id} value={classroom.id}>
                                {classroom.grade.name}
                            </Option>
                        ))}
                    </AsyncSelect>
                </div>
                </div>
            </div>
            </Card>
            <AddHourConfigurationTable classroom={classroom?.id} shift={shift} year={year} edit={true} />
        </div>
    );
};

export default AddHourConfigurationEditForm;