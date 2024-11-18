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
            const data = await classroomService.getEnrollmentsByClassroom(token, classroom.id);
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
        }
    };

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";

    }, []);

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
                    <div className="hidden Mobile-390*844:flex Mobile-280:flex Mobile-390*844:flex-col Mobile-280:flex-col ">
                    <div className="flex flex-row">
                            <Typography className="font-masferrer text-2xl font-bold my-4
                            Mobile-390*844:text-sm
                            Mobile-280:text-sm text-center mx-auto
                            ">MATRICULAR ESTUDIANTES</Typography>
                        </div>
                        <div className="flex flex-col justify-center items-center mx-auto sticky top-0 z-10">   
                            <div className="flex flex-row justify-center items-center mt-4 py-4 px-2 rounded-xl">
                                <Button color="white" className={`mx-2 hover:bg-blue-300 ${enrollButton ? 'bg-blue-400' : ''}`} onClick={handleEnrollForm}
                                disabled={enrollButton}>
                                    <Typography className='text-sm justify-center my-auto 
                                    font-masferrerTitle font-bold PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>Registrar matricula</Typography>
                                </Button>
                                <Button color="white" className={`mx-2 hover:bg-blue-200 ${!enrollButton ? 'bg-blue-400' : ''}`} onClick={handleEditList}
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
                            <div className="flex flex-row justify-center items-center mt-4 sticky top-0 z-10">
                            <PopulateClassForm fromDialog={false} studentsList={selectedStudents} onSuccess={handleCreateSuccess} classroomInfo={classroom} buttonText={buttonText}/>
                            </div>
                            </div>
                        </div>
                    <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
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
                            <StudentListEnrollment students={students} classroom={true} classroomName={classroom} updateSelectedStudents={updateSelectedStudents} enroll={true}/>
                            </div>
                            <div className="flex flex-col justify-center items-center mx-auto">
                            <Dialog open={open} handler={handleOpenDialog} className="overflow-auto h-CarouselItemPC-1920*1080" >
                                <DialogHeader className="justify-center items-center text-center"> Busqueda de Alumnos por Aula </DialogHeader>
                                <DialogBody className="flex justify-center h-auto items-center mx-auto"> 
                                    <PopulateClassForm fromDialog={true} onSuccess={handleCreateSuccess} setClassroom={setClassroomName} />
                                </DialogBody>
                                <DialogFooter>
                                    <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                                </DialogFooter>
                            </Dialog>
                        </div>
                        </div>
                    </div>
                    <div className="flex flex-col Mobile-390*844:hidden Mobile-280:hidden ">
                    <div className="flex flex-row">
                            <Typography className="font-masferrer text-2xl font-bold my-4
                            Mobile-390*844:text-sm
                            Mobile-280:text-sm text-center mx-auto
                            ">MATRICULAR ESTUDIANTES</Typography>
                        </div>
                        <div className="flex flex-col justify-center items-center mx-auto sticky top-0 z-10">   
                            <div className="flex flex-row justify-center items-center mt-4 py-4 px-2 rounded-xl">
                                <Button color="white" className={`mx-2 hover:bg-blue-300 ${enrollButton ? 'bg-blue-400' : ''}`} onClick={handleEnrollForm}
                                disabled={enrollButton}>
                                    <Typography className='text-sm justify-center my-auto 
                                    font-masferrerTitle font-bold PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>Registrar matricula</Typography>
                                </Button>
                                <Button color="white" className={`mx-2 hover:bg-blue-200 ${!enrollButton ? 'bg-blue-400' : ''}`} onClick={handleEditList}
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
                            <div className="flex flex-row justify-center items-center mt-4 sticky top-0 z-10">
                            <PopulateClassForm fromDialog={false} studentsList={selectedStudents} onSuccess={handleCreateSuccess} classroomInfo={classroom} buttonText={buttonText}/>
                            </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollStudentsPage;