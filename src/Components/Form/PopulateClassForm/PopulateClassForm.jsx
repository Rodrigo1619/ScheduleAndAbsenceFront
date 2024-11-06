import React, { useState, useEffect, useRef } from 'react';
import SelectSearch from "react-select";
import {

    Typography,
    Select,
    Option,

} from "@material-tailwind/react";

import classes from './PopulateClassForm.module.css';
import { useUserContext } from '../../../Context/userContext';
import AsyncSelect from '../../AsyncSelect/AsyncSelect.jsx';
import { shiftService } from '../../../Services/shiftService';
import { classroomService } from '../../../Services/classroomService';
import { notification } from 'antd';
import { studentService } from '../../../Services/studentService.js';
import { Grid } from 'react-loader-spinner';


const PopulateClassForm = ({ setClassroom, fromDialog, onSuccess, studentsList, classroomInfo, buttonText }) => {
    const [shift, setShift] = useState(null);
    const [year, setYear] = useState(null);
    const [shiftsList, setShiftsList] = useState([]);
    const [classroomsList, setClassroomsList] = useState([]);
    const { token } = useUserContext();
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (classroomInfo) {
            setShift(classroomInfo.shift);
            setYear(classroomInfo.year);
        }
    }, [classroomInfo]);

    useEffect(() => {
        if (classroomInfo && shift && year) {
            fetchClassrooms();
        }
    }, [shift, year]);

    useEffect(() => {
        console.log(classroomsList);
        if (classroomInfo && shift && year && classroomsList.length > 0) {
            setSelectedClassroom(classroomInfo);
        }
    }, [shift, year, classroomsList]);

    useEffect(() => {
        console.log(selectedClassroom);
        console.log(classroomInfo);
    }, [selectedClassroom]);


    useEffect(() => {
        const fetchShifts = async () => {
            if (token) {
                try {
                    const shifts = await shiftService.getAllShifts(token);
                    setShiftsList(shifts || []);

                } catch (error) {
                    console.log("Error fetching data: ", error);
                }
            }
        };

        fetchShifts();
        console.log(classroomsList);
    }, [token]);

    useEffect(() => {
        console.log(shiftsList);
    }, [shiftsList]);


    useEffect(() => {
        if (!classroomInfo) {
            setSelectedClassroom(null);

            fetchClassrooms();
        }
    }, [shift, year, token]);


    useEffect(() => {

        if (!classroomInfo) {
            setSelectedClassroom(null);
            setClassroomsList([]);
            fetchClassrooms();
        }
    }, [shift]);

    useEffect(() => {
        if (!classroomInfo) {
            setSelectedClassroom(null);
            setClassroomsList([]);
            fetchClassrooms();
        }
    }, [year]);



    const handleSelectClassroomChange = (e) => {
        const classroom = classroomsList.find(classroom => classroom.id === e.value);
        console.log(classroom);
        setSelectedClassroom(classroom);
    }

    const handleSelectShiftChange = (value) => {
        const shift = shiftsList.find(shift => shift.id === value);
        setShift(shift);
        setClassroomsList([]);
        setSelectedClassroom(null);
    }

    const handleSelectYearChange = (e) => {
        setYear(e.target.value);
        setClassroomsList([]);
        setSelectedClassroom(null);
    }

    const addStudentsToClassroom = async (studentsList) => {
        setLoading(true);
        const idStudents = studentsList.map(student => student.id);
        console.log(idStudents);
        console.log(selectedClassroom?.id);
        console.log(studentsList);

        if (!selectedClassroom) {
            notification.error({
                message: 'Error',
                description: 'No se ha seleccionado un salón de clases',
                placement: 'top',
                duration: 2,
            });
            setLoading(false);
            return;
        }

        if (studentsList.length === 0) {
            notification.error({
                message: 'Error',
                description: 'No se han seleccionado estudiantes',
                placement: 'top',
                duration: 2,
            });
            setLoading(false);
            return;
        }

        try {
 
            const data = await classroomService.addStudentsToClassroom(token, idStudents, selectedClassroom.id);
            if (data) {
                notification.success({
                    message: 'Éxito',
                    description: 'Los estudiantes han sido registrados exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                onSuccess();
            }
        } catch (error) {
            console.log(`Hubo un error al registrar los estudiantes: ${error}`);
        }

        setLoading(false);
    }

    const enrollStudents = async (studentsList) => {
        setLoading(true);
        const idEnrollments = studentsList.map(student => student.enrolledId);

        if (!selectedClassroom) {
            notification.error({
                message: 'Error',
                description: 'No se ha seleccionado un salón de clases',
                placement: 'top',
                duration: 2,
            });
            setLoading(false);
            return;
        }

        if (studentsList.length === 0) {
            notification.error({
                message: 'Error',
                description: 'No se han seleccionado estudiantes',
                placement: 'top',
                duration: 2,
            });
            setLoading(false);
            return;
        }
        
        try {
            const data = await studentService.enrollStudents(token, idEnrollments, selectedClassroom.id);
            if (data) {
                notification.success({
                    message: 'Éxito',
                    description: 'Los estudiantes han sido matriculados exitosamente',
                    placement: 'top',
                    duration: 4,
                });
                onSuccess();
            }
        } catch (error) {
            console.log(`Hubo un error al matricular los estudiantes: ${error}`);
            notification.error({
                message: 'Error',
                description: 'Hubo un error al matricular los estudiantes',
                placement: 'top',
                duration: 4,
            });
        }
        setLoading(false);
    }

    const editClassroomList = async (studentsList) => {
        setLoading(true);
        const idEnrollments = studentsList.map(student => student.enrolledId);

        if (!selectedClassroom) {
            notification.error({
                message: 'Error',
                description: 'No se ha seleccionado un salón de clases',
                placement: 'top',
                duration: 2,
            });
            setLoading(false);
            return;
        }

        if (studentsList.length === 0) {
            notification.error({
                message: 'Error',
                description: 'No se han seleccionado estudiantes',
                placement: 'top',
                duration: 2,
            });
            setLoading(false);
            return;
        }

        
        try {
            const data = await classroomService.editClassroomStudentsList(token, idEnrollments, selectedClassroom.id);
            if (data) {
                notification.success({
                    message: 'Éxito',
                    description: 'Los estudiantes han sido editados exitosamente',
                    placement: 'top',
                    duration: 4,
                });
                onSuccess();

            }
        } catch (error) {
            console.log(`Hubo un error al editar los estudiantes: ${error}`);
            notification.error({
                message: 'Error',
                description: 'Hubo un error al editar los estudiantes',
                placement: 'top',
                duration: 4,
            });
        }
        setLoading(false);
    }

    const handleSubmit = (e) => {

        if (!fromDialog) {

            switch (true) {
                case buttonText === "Registrar":
                    e.preventDefault();
                    console.log("Registrando...");
                    console.log(studentsList);
                    if (studentsList) {
                        addStudentsToClassroom(studentsList);
                    }
                    else {
                        notification.error({
                            message: 'Error',
                            description: 'No se han seleccionado estudiantes',
                            placement: 'top',
                            duration: 2,
                        });
                        console.log(studentsList);
                    }

                    break;

                case buttonText === "Matricular":
                    e.preventDefault();
                    console.log("Matriculando...");
                    if (studentsList && selectedClassroom.year > classroomInfo.year) {
                        enrollStudents(studentsList);
                    }
                    else {
                        notification.error({
                            message: 'Error',
                            description: 'No se han seleccionado estudiantes o el año del aula no es válido',
                            placement: 'top',
                            duration: 2,
                        });
                    }
                    break;

                case buttonText === "Editar":
                    e.preventDefault();
                    console.log("Editando...");
                    if (studentsList) {
                        editClassroomList(studentsList);
                    }
                    break;

                default:
                    break;

            }
        }
        else {
            e.preventDefault();
            console.log("Buscando...");
            setClassroom(selectedClassroom);
            onSuccess();
        }

    }

    useEffect(() => {
        console.log(studentsList);
    }
        , [studentsList]);

    return (
        loading ?
        <div className="fixed">
                <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
                <Typography
                className='text-center text-blueMasferrer font-bold text-2xl'
                > Cargando... </Typography>
            </div>
        :
        <form onSubmit={handleSubmit} className={[classes["form"]]}>
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
                    pattern='[0-9]{4}' value={year} onChange={handleSelectYearChange}
                    className="Mobile-280:w-full text-black border-2 text-center mx-auto border-black border-opacity-20" placeholder="Año" />
            </div>
            <div className={classes["input-container"]}>
                <label className={classes["label"]}>Salón de clases:</label>
                <SelectSearch
                                        value={selectedClassroom ? { value: selectedClassroom.id, label: selectedClassroom.grade.name } : ''}
                                        options={classroomsList?.map((selectedClassroom) => ({
                                            value: selectedClassroom.id,
                                            label: selectedClassroom.grade.name,
                                        }))}
                                        onChange={handleSelectClassroomChange}
                                        placeholder="Seleccione un salon de clases"
                                        className=" Mobile-280:w-full text-black min-w-full border-2 border-black border-opacity-20"
                                        menuPlacement='top'
                                    />
            </div>
            <div className="button-container">
                {
                    <button type="submit" className={[classes["submit-button"]]}>{fromDialog ? "Buscar" : buttonText}</button>
                }

            </div>
        </form>
    );
};

export default PopulateClassForm;