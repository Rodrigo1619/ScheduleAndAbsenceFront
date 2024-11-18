import React, { useEffect, useState } from 'react';
import { Option } from '@material-tailwind/react';
import classes from './ClassroomForm.module.css';
import { useUserContext } from '../../../Context/userContext';
import { Typography, notification } from 'antd';
import { userService } from '../../../Services/userService.js';
import { shiftService } from '../../../Services/shiftService.js';
import { gradeService } from '../../../Services/gradeService.js';
import { classroomService } from '../../../Services/classroomService.js';
import AsyncSelect from '../../AsyncSelect/AsyncSelect.jsx';
import SelectSearch  from "react-select";
import { Toaster, toast } from 'sonner';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';


const ClassroomForm = ({ classroom, editStatus = false, onSuccess }) => {
    const { token } = useUserContext();
    const [teachersList, setTeachersList] = useState([]);
    const [shiftsList, setShiftsList] = useState([]);
    const [gradesList, setGradesList] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedShift, setSelectedShift] = useState(null);
    const [teacher, setTeacher] = useState(null);
    const [shift, setShift] = useState(null);
    const [grade, setGrade] = useState();
    const minYear = new Date().getFullYear();
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(true);

    const handleSelectTeacherChange = (e) => {
        const teacher = teachersList.find((teacher) => teacher.id === e.value);

        if(teacher){
            setTeacher(teacher);
        }
    };

    const handleSelectShiftChange = (value) => {
        const shift = shiftsList.find(shift => shift.id === value);
        setShift(shift);
    };

    const handleSelectGradeChange = (e) => {
        const grade = gradesList.find((grade) => grade.id === e.value);
        
        if(grade){
            setGrade(grade);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    const teachers = await userService.getAllTeachersAdmin(token);
                    const shifts = await shiftService.getAllShifts(token);

                    setTeachersList(teachers.filter(teacher => teacher.role.name === "Profesor"));
                    setShiftsList(shifts);
                    setLoading(false);

                    if (editStatus && classroom) {
                        setSelectedGrade(classroom.grade);
                        setSelectedShift(classroom.shift);
                        setSelectedTeacher(classroom.teacher);
                        setSelectedYear(classroom.year);
                    }
                } catch (error) {
                }
            }
        };

        fetchData();
    }, [token, editStatus, classroom]);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const grades = await gradeService.getGradesByShift(token, shift?.id);
                setGradesList(grades);
            } catch (error) {
            }
        };

        fetchGrades();
    }, [shift]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            if( !teacher ){ throw new Error('Por favor, seleccione un orientador.'); }
            if( !grade ){ throw new Error('Por favor, seleccione un grado.'); }
            if( year === "" ){ throw new Error('Por favor, ingrese el año.'); }

        } catch (error) {
            toast.error(error.message, {
                duration: 2000,
                icon: <XCircleIcon style={{ color: "red" }} />,
            });
            return;
        }
    
        if (editStatus && classroom && classroom.id && token) {
            try {
                const data = await classroomService.updateClassroom(classroom.id, {
                    year: year,
                    idGrade: grade.id,
                    idTeacher: teacher.id
                }, token);
                    
                onSuccess();

            } catch (error) {

                toast.error('Error al editar, posible duplicado de datos', {
                    duration: 2000,
                    icon: <XCircleIcon style={{ color: "red" }} />,
                });
            }
        } else {
            try {
                    const data = await classroomService.createClassroom({
                        year: year,
                        idGrade: grade.id,
                        idTeacher: teacher.id
                    }, token);

                    toast.success('Salón de clases registrado con exito', { 
                        duration: 4000,
                        icon: <CheckCircleIcon style={{color: "green"}}/>,
                    });
                    
                    setYear(new Date().getFullYear());
                    setSelectedGrade(null);
                    setSelectedShift(null);
                    setSelectedTeacher(null);

                    
            } catch (error) {
                toast.error('Error al registrar, posible duplicado de datos', { 
                    duration: 2000,
                    icon: <XCircleIcon style={{color: "red"}} />,
                });
            }
        }
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <form className={classes["form"]} onSubmit={handleSubmit}>
            <Toaster />
            {editStatus && (
                <div className={classes["classroomInfoContainer"]}>
                    <Typography className='text-white font-masferrerTitle font-normal text-lg text-center my-2'>EDITANDO ACTUALMENTE:</Typography>
                    <Typography className='text-white font-masferrerTitle font-normal text-lg'>Grado: {selectedGrade} - Turno : {selectedShift}</Typography>
                    <Typography className='text-white font-masferrerTitle font-normal text-lg'>Orientador: {selectedTeacher}</Typography>
                    <Typography className='text-white font-masferrerTitle font-normal text-lg'>Año: {selectedYear}</Typography>
                </div>
            )}
            <div className={classes["input-container"]}>
                <label className={classes["label"]}>Orientador:</label>
                <SelectSearch
                    options={teachersList.map((teacher) => ({
                            value: teacher.id,
                            label: teacher.name,
                        }))}
                    onChange={handleSelectTeacherChange}
                    placeholder="Seleccione un maestro"
                    className=" Mobile-280:w-full text-black min-w-full border-2 border-black border-opacity-20"
                    />
            </div>
            <div className={classes["input-container"]}>
                <label className={classes["label"]}>Turno:</label>
                <AsyncSelect
                    value={shift ? shift.id : ''}
                    onChange={handleSelectShiftChange}
                    className="bg-white Mobile-280:w-full"
                >
                    {shiftsList.map((shift) => (
                        <Option key={shift.id} value={shift.id}>
                            {shift.name}
                        </Option>
                    ))}
                </AsyncSelect>
            </div>
            <div className={classes["input-container"]}>
                <label className={classes["label"]}>Grado:</label>
                <SelectSearch
                    options={gradesList.map((grade) => ({
                            value: grade.id,
                            label: grade.name,
                        }))}
                    onChange={handleSelectGradeChange}
                    placeholder="Seleccione un salon"
                    className=" Mobile-280:w-full text-black min-w-full border-2 border-black border-opacity-20"
                    />
            </div>
            <div className={classes["input-container"]}>
                <label className={classes["label"]}>Año:</label>
                <input type="number" minLength="4" maxLength="4" min={minYear} max="2099"
                    pattern='[0-9]{4}' value={year} onChange={(e) => setYear(e.target.value)}
                    className="Mobile-280:w-full text-black border-2 text-center mx-auto border-black border-opacity-20" placeholder="Año" />
            </div>
            <div className={classes["button-container"]}>
                {editStatus ? (
                    <button type="submit" className={classes["submit-button"]}>
                        Editar Aula
                    </button>
                ) : (
                    <button type="submit" className={classes["submit-button"]}>
                        Registrar Aula
                    </button>
                )}
            </div>
        </form>
    );
};

export default ClassroomForm;
