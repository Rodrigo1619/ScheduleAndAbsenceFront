import { Card, Option, Chip } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import classes from './AddHourConfigurationNewForm.module.css';
import AsyncSelect from '../../AsyncSelect/AsyncSelect.jsx';
import SelectSearch from "react-select";
import { userService } from '../../../Services/userService';
import { useUserContext } from '../../../Context/userContext';
import { shiftService } from '../../../Services/shiftService';
import { subjectService } from '../../../Services/subjectService';
import { classroomService } from '../../../Services/classroomService.js';
import AddHourConfigurationTable from '../../AddHourConfigurationTable/AddHourConfigurationTable.jsx';
import { Typography } from 'antd';

const AddHourConfigurationNewForm = () => {
    const [teacher, setTeacher] = useState(null);
    const [subject, setSubject] = useState(null);
    const [selectedClassrooms, setSelectedClassrooms] = useState([]); // Cambia a un arreglo
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
                }
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        const fetchClassrooms = async () => {
            if (token && shift && year) {
                try {
                    const classrooms = await classroomService.getClassroomsByShiftAndYear(token, shift.id, year);
                    setClassroomsList(classrooms || []);
                } catch (error) {
                }
            }
        };

        fetchClassrooms();
    }, [shift, year, token]);

    const handleSelectClassroomChange = (e) => {
        const selectedClassroom = classroomsList.find(classroom => classroom.id === e.value);
        if (selectedClassroom && !selectedClassrooms.some(c => c.id === selectedClassroom.id)) {
            setSelectedClassrooms([...selectedClassrooms, selectedClassroom]);
        }
    };

    const handleRemoveClassroom = (id) => {
        setSelectedClassrooms(selectedClassrooms.filter(classroom => classroom.id !== id));
    };

    return (
        <div className={classes["form-container"]}>
            <Card className='bg-transparent p-4 mx-4 border-0 shadow-none'>
                <div className={classes["form-container"]}>
                    <div className={classes["inputsContainer"]}>
                        <div className={classes["input-container"]}>
                            <label className={classes["label"]}>Turno:</label>
                            <AsyncSelect
                                value={shift ? shift.id : ''}
                                onChange={(value) => setShift(shiftsList.find(shift => shift.id === value))}
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
                            <input 
                                type="number"
                                min="2024"
                                max="2099"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="Mobile-280:w-full text-black border-2 text-center mx-auto border-black border-opacity-20"
                                placeholder="Año"
                            />
                        </div>
                        <div className={classes["input-container"]}>
                <label className={classes["label"]}>Salón de clases:</label>
                <SelectSearch
                                        value=""
                                        options= {classroomsList?.map((classroom) => ({
                                            value: classroom.id,
                                            label: classroom.grade.name
                                        }))}
                                        onChange={handleSelectClassroomChange}
                                        placeholder="Seleccione un salon de clases"
                                        className=" Mobile-280:w-full text-black min-w-full border-2 border-black border-opacity-20"
                                        menuPlacement='top'
                                        menuPortalTarget={document.body}
                                    />
            </div>
                       
                    </div>
                    <Typography className="text-black font-bold text-lg">
                            Salones seleccionados:
                        </Typography>
                    {/* Chips de salones seleccionados */}
                    <div className="flex flex-wrap mt-4">
                        
                        {selectedClassrooms.map((classroom) => (
                            <Chip
                                key={classroom.id}
                                value={classroom.grade.name}
                                onClose={() => handleRemoveClassroom(classroom.id)}
                                className="m-1 bg-blueMasferrer text-white"
                            />
                        ))}
                    </div>
                </div>
            </Card>

            {/* Tabla de configuración de horas */}
            <AddHourConfigurationTable
                classroom={selectedClassrooms}
                shift={shift}
                year={year}
                edit={false}
                onSuccess={() => setSelectedClassrooms([])}
            />
        </div>
    );
};

export default AddHourConfigurationNewForm;
