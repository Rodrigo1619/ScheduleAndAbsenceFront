import React, { useState, useEffect } from "react";
import {
    Button,
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import classes from "./StudentPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import StudentForm from "../../Components/Form/StudentForm/StudentForm";
import StudentList from "../../Components/List/StudentList/StudentList";
import { studentService } from "../../Services/studentService";
import { useUserContext } from "../../Context/userContext";

import { Grid } from "react-loader-spinner";


const STUDENTS_DEMO = [
    {
        id: "4041aa06-d543-4161-8d39-4213feea4750",
        nie: "223366",
        name: "Zuniga Joaquin",
        estado: true,
    },
    {
        id: "6e7ad5bc-d579-4a30-ac96-043be9308bab",
        nie: "112233",
        name: "Montano Martinez Kevin Joshua",
        estado: true,
    },
    {
        id: "4041aa06-d543-4161-8d39-4213feea4750",
        nie: "223366",
        name: "Zuniga Joaquin",
        estado: false,
    },
    {
        id: "6e7ad5bc-d579-4a30-ac96-043be9308bab",
        nie: "112233",
        name: "Montano Martinez Kevin Joshua",
        estado: true,
    },
    {
        id: "4041aa06-d543-4161-8d39-4213feea4750",
        nie: "223366",
        name: "Zuniga Joaquin",
        estado: false,
    },
    {
        id: "6e7ad5bc-d579-4a30-ac96-043be9308bab",
        nie: "112233",
        name: "Montano Martinez Kevin Joshua",
        estado: false,
    }
];

const StudentPage = () => {

    const [loading, setLoading] = useState(true);

    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState(false);
    const { user, token } = useUserContext();

    const fetchStudents = async () => {
        try {
            const data = await studentService.getStudents(token);
            setStudents(data);
        } catch (error) {
        }
    };

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchStudents();

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, []);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchStudents();
    };

    return loading ? (
        <div className={[classes["loaderContainer"]]}>
            <Grid
                type="Grid"
                color="#170973"
                height={80}
                width={80}
                visible={loading}
            />
        </div>
    )
        :
        (
            <div className={[classes["generalContainer"]]}>
                <header className={classes["headerContainer"]}>
                    <Header name={user?.name} role={user?.role.name} />
                </header>

                <div className={classes["bodyContainer"]}>
                    <div className={classes["allContentContainer"]}>
                        <div className={classes["pageContentContainerCol"]}>
                            <div className={classes["TitleContainer"]}>
                                <Button
                                    color="white"
                                    className={classes["quickAddButton"]}
                                    onClick={handleOpenDialog}>
                                    <Typography
                                        className="text-sm justify-center my-auto
                                font-masferrerTitle font-normal PC-1280*720:text-xs 
                                PC-800*600:text-xs
                                PC-640*480:text-xs
                                Mobile-390*844:text-xs
                                Mobile-280:text-xs
                                IpadAir:text-xs"
                                    >
                                        Agregar estudiante
                                    </Typography>
                                </Button>
                            </div>
                            <div className={classes["pageContentContainerRow"]}>
                                <div className={classes["SubtitleContainer"]}>
                                    <StudentList students={students} fetchStudents={fetchStudents} />
                                </div>
                                <Dialog open={open} handler={handleOpenDialog}>
                                    <DialogHeader> Registrar Estudiante </DialogHeader>
                                    <DialogBody className="overflow-auto h-CarouselItemPC-1024*768">
                                        <StudentForm />
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button
                                            color="red"
                                            className="m-4"
                                            onClick={handleCloseDialog}>
                                            Cancelar
                                        </Button>
                                    </DialogFooter>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default StudentPage;
