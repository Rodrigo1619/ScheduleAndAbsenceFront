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
import classes from "./TeacherPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import TeacherForm from "../../Components/Form/TeacherForm/TeacherForm";
import TeacherList from "../../Components/List/TeacherList/TeacherList";
import { useUserContext } from "../../Context/userContext";
import { userService } from "../../Services/userService";

import { Grid } from "react-loader-spinner";

const TeacherPage = () => {
    const [loading, setLoading] = useState(true);

    const [teachers, setTeachers] = useState([]);
    const { token, user } = useUserContext();

    const fetchTeachers = async () => {
        try {
            const data = await userService.getAllTeachersAdmin(token);
            setTeachers(data);
        } catch (error) {
        }
    };

    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchTeachers();

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, []);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchTeachers();
    };

    const handleCreateSuccess = () => {
        notification.success({
            message: "Éxito",
            description: "El usuario ha sido resgistrado exitosamente",
            placement: "top",
            duration: 2,
        });
        handleCloseDialog();
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
    ) : (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            <Button
                                color="white"
                                className={classes["quickAddButton"]}
                                onClick={handleOpenDialog}
                            >
                                <Typography
                                    className="text-sm justify-center my-auto
                                font-masferrerTitle font-medium PC-1280*720:text-xs 
                                PC-800*600:text-xs
                                PC-640*480:text-xs
                                Mobile-390*844:text-xs
                                Mobile-280:text-xs
                                IpadAir:text-xs"
                                >
                                    Agregar usuario
                                </Typography>
                            </Button>
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                            <div className={[classes["SubtitleContainer"]]}>
                                <TeacherList
                                    teachers={teachers}
                                    fetchTeachers={fetchTeachers}
                                />
                            </div>
                            <Dialog open={open} handler={handleOpenDialog}>
                                <DialogHeader> Registrar Usuario </DialogHeader>
                                <DialogBody className="overflow-auto h-CarouselItemPC-1024*768">
                                    <TeacherForm onCreate={handleCreateSuccess} />
                                </DialogBody>
                                <DialogFooter>
                                    <Button
                                        color="red"
                                        className="m-4"
                                        onClick={handleCloseDialog}
                                    >
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

export default TeacherPage;
