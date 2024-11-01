import React, { useState, useEffect } from "react";
import {
    Navbar,
    Button,
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";

import classes from './EnrollStudentsPage.module.css';

import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import PopulateClassForm from "../../Components/Form/PopulateClassForm/PopulateClassForm";

import { studentService } from "../../Services/studentService";
import { useUserContext } from "../../Context/userContext";
import StudentListEnrollment from "../../Components/List/StudentList/StudentListEnrollment";
import { notification } from "antd";
import { classroomService } from "../../Services/classroomService";

const EnrollStudentsPage = () => {

    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [buttonText, setButtonText] = useState("Matricular");
    const [enrollButton, setEnrollButton] = useState(true);
    const [classroom, setClassroom] = useState(null);
    const [shifts, setShifts] = useState([]);
    const [open, setOpen] = useState(false);
    const { token, user } = useUserContext();

    // Callback function to set the classroom name
    const setClassroomName = (classroom) => {
        setClassroom(classroom);
    };

    // Callback function to set the selected students
    const updateSelectedStudents = (students) => {
        setSelectedStudents(students);
    };

    const fetchEnrolledStudents = async () => {
        try {
            const data = await classroomService.getEnrollmentsByGradeandShift(token, classroom.grade.id, classroom.shift.id, classroom.year);
            console.log("Data: ", data);
            setStudents(data.map((student) => ({
                id: student.student.id,
                enrolledId: student.id,
                nie: student.student.nie,
                name: student.student.name,
                active: student.student.active,
                actualClassroom: student.classroom.grade.name + " - " + student.classroom.shift.name
                 + " " + student.classroom.year,
                enrolled: student.classroom.grade.name + " - " + student.classroom.shift.name
                + " " + student.classroom.year             
            })));

        } catch (error) {
            console.log(`Hubo un error al obtener los estudiantes matriculados: ${error}`);
        }
    };

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";

    }, []);

    useEffect(() => {
        console.log("Selected students: ", selectedStudents);
    }, [selectedStudents]);

    useEffect(() => {
        console.log("Classroom: ", classroom);
    }, [classroom]);


    const handleEditList = () => {
        setButtonText("Editar");
        setEnrollButton(false);
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleCreateSuccess = () => {
        // Necesito que solo el componente de StudentListEnrollment se actualice
        handleCloseDialog();
        setSelectedStudents([]);
        setStudents([]);
        fetchEnrolledStudents();
    }

    const handleEnrollForm = () => {
        setButtonText("Matricular");
        setEnrollButton(true);
    }

    return(
        
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                    <div className="flex flex-row justify-between items-center">
                            <Typography className="font-masferrer text-2xl font-bold my-4
                            Mobile-390*844:text-sm
                            Mobile-280:text-sm
                            ">MATRICULAR ESTUDIANTES</Typography>
                        </div>
                        <div className="flex flex-col justify-start items-start m-auto">    
                            <div className="flex flex-row justify-center items-center mt-4">
                                <Button color="white" className={`mx-2 hover:bg-blue-300 ${enrollButton ? 'bg-blue-300' : ''}`} onClick={handleEnrollForm}
                                disabled={enrollButton}>
                                    <Typography className='text-sm justify-center my-auto 
                                    font-masferrerTitle font-bold PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>Registrar matricula</Typography>
                                </Button>
                                <Button color="white" className={`mx-2 hover:bg-blue-200 ${!enrollButton ? 'bg-blue-300' : ''}`} onClick={handleEditList}
                                disabled={(!enrollButton || !classroom)} 
                                >
                                    <Typography className='text-sm justify-center my-auto
                                    font-masferrerTitle font-bold PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'> Editar listado del aula </Typography>
                                </Button>
                            </div>
                            <PopulateClassForm fromDialog={false} studentsList={selectedStudents} onSuccess={handleCreateSuccess} classroomInfo={classroom} buttonText={buttonText}/>
                            </div>
                        <div className={[classes["TitleContainer"]]}>
                        <Button color="white" className="mx-2 hover:bg-blue-gray-300" onClick={handleOpenDialog}>
                            <Typography className='text-sm justify-center my-auto
                            font-masferrerTitle font-normal PC-1280*720:text-xs 
                            PC-800*600:text-xs
                            PC-640*480:text-xs
                            Mobile-390*844:text-xs
                            Mobile-280:text-xs
                            IpadAir:text-xs'>Buscar Alumnos por Aula</Typography>
                        </Button>
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                            <StudentListEnrollment students={students} classroom={true} classroomName={classroom} updateSelectedStudents={updateSelectedStudents}/>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                            <Dialog open={open} handler={handleOpenDialog} >
                                <DialogHeader> Busqueda de Alumnos por Aula </DialogHeader>
                                <DialogBody className="overflow-auto h-auto"> 
                                    <PopulateClassForm fromDialog={true} onSuccess={handleCreateSuccess} setClassroom={setClassroomName} />
                                </DialogBody>
                                <DialogFooter>
                                    <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                                </DialogFooter>
                            </Dialog>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollStudentsPage;