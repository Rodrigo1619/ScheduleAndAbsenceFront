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

import classes from './PopulateClassroom.module.css';

import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import PopulateClassForm from "../../Components/Form/PopulateClassForm/PopulateClassForm";

import { studentService } from "../../Services/studentService";
import { useUserContext } from "../../Context/userContext";
import StudentListEnrollment from "../../Components/List/StudentList/StudentListEnrollment";

import { Grid } from 'react-loader-spinner';
import { set } from "date-fns";

const PopulateClassroom = () => {

    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [classroom, setClassroom] = useState(null);
    const [shifts, setShifts] = useState([]);
    const [open, setOpen] = useState(false);
    const { token, user } = useUserContext();
    const [loading, setLoading] = useState(true);


    // Callback function to set the selected students
    const updateSelectedStudents = (students) => {
        setSelectedStudents(students);
    };


    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";

    }, []);

    useEffect(() => {
        fetchStudents();

        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await studentService.getStudentNew(token);
            setStudents(data);
        } catch (error) {
            setStudents([]);
        }
    };


    const handleCreateSuccess = () => {

        fetchStudents();
        setSelectedStudents([]);
    }


    return(
        loading ?
            <div className={[classes["loaderContainer"]]}>
                <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
            </div>

            :
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["TitleContainer"]]}>
                            <Typography className="font-masferrer text-2xl font-bold my-4
                            Mobile-390*844:text-sm
                            Mobile-280:text-sm
                            ">AGREGAR ALUMNOS A UN SALÓN DE CLASES</Typography>
                        </div>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["pageContentContainerRow"]]}>    
                            <div className={[classes["SubtitleContainer"]]}>
                            <StudentListEnrollment students={students} classroom={true} updateSelectedStudents={updateSelectedStudents} populate={true}/>
                            </div>
                            <div className="hidden Mobile-390*844:flex Mobile-280:flex">   
                        <PopulateClassForm fromDialog={false} studentsList={selectedStudents} onSuccess={handleCreateSuccess} buttonText="Registrar" />   
                    </div>
                        </div>
                        
                    </div>
                    <div className="flex flex-col mx-auto sticky top-0 z-10 Mobile-390*844:hidden Mobile-280:hidden">   
                    <div className="flex flex-row mx-auto sticky top-0 z-10">   
                        <PopulateClassForm fromDialog={false} studentsList={selectedStudents} onSuccess={handleCreateSuccess} buttonText="Registrar" />   
                    </div>
                    </div>
                </div>          
            </div>
        </div>
    );
};

export default PopulateClassroom;