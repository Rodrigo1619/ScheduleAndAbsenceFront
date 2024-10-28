import React, { useState, useEffect } from "react";
import {
    Button,
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import classes from "./UserxSubjectPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import UserxSubjectForm from "../../Components/Form/UserxSubjectForm/UserxSubjectForm";
import UserxSubjectList from "../../Components/List/UserxSubjectList/UserxSubjectList";
import { userxSubjectService } from "../../Services/userxSubjectService";
import { useUserContext } from "../../Context/userContext";

const UserxSubjectPage = () => {
    const [userxSubjects, setUserxSubjects] = useState([]);
    const [open, setOpen] = useState(false);
    const { token } = useUserContext();

    const fetchUserxSubjects = async () => {
        try {
            const data = await userxSubjectService.getUserxSubjects(token);
            setUserxSubjects(data);
            console.log(data);
        } catch (error) {
            console.log("Hubo un error al obtener los usuarios y materias" + error);
        }
    };

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchUserxSubjects();
    }, []);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchUserxSubjects();
    };

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={classes["headerContainer"]}>
                <Header name="Luis Morales" role="Administrador" />
            </header>

            <div className={classes["bodyContainer"]}>
                <div className={classes["allContentContainer"]}>
                    <SideBarNav />
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
                                    Asignar materia a profesor
                                </Typography>
                            </Button>
                        </div>
                        <div className={classes["pageContentContainerRow"]}>
                            <div className={classes["SubtitleContainer"]}>
                                <UserxSubjectList userxSubjects={userxSubjects} fetchData={fetchUserxSubjects}/>
                            </div>
                            <Dialog open={open} handler={handleOpenDialog}>
                                <DialogHeader> Asignar Materia a Profesor </DialogHeader>
                                <DialogBody className="overflow-auto h-CarouselItemPC-1024*768">
                                    <UserxSubjectForm/>
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

export default UserxSubjectPage;