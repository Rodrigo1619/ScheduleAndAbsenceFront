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
import UserxSubjectForm from "../../Components/Form/UserxSubjectForm/UserxSubjectForm";
import UserxSubjectList from "../../Components/List/UserxSubjectList/UserxSubjectList";

import { Grid } from "react-loader-spinner";

import { userxSubjectService } from "../../Services/userxSubjectService";
import { useUserContext } from "../../Context/userContext";

const UserxSubjectPage = () => {
    const [userxSubjects, setUserxSubjects] = useState([]);
    const [open, setOpen] = useState(false);
    const { token, user } = useUserContext();
    const [loading, setLoading] = useState(true);

    const fetchUserxSubjects = async () => {
        try {
            const data = await userxSubjectService.getUserxSubjects(token);
            setUserxSubjects(data);
        } catch (error) {
            setUserxSubjects([]);
        }
    };

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchUserxSubjects();

        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchUserxSubjects();
    };

    return (
        loading ?
            <div className={[classes["loaderContainer"]]}>
                <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
            </div>

            :
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
                                font-masferrerTitle font-medium PC-1280*720:text-xs 
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
                                <DialogBody className="overflow-visible h-CarouselItemPC-1024*768">
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