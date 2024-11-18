import React, { useState, useEffect } from "react";
import {
    Button,
    Typography,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import classes from "./ClassroomPage.module.css";
import Header from "../../Components/Header/Header";
import ClassroomList from "../../Components/List/ClassroomList/ClassroomList";
import { classroomService } from "../../Services/classroomService";
import { useUserContext } from "../../Context/userContext";
import ClassroomForm from "../../Components/Form/ClassroomForm/ClassroomForm";

import { Grid } from "react-loader-spinner";

const ClassroomPage = () => {

    const [loading, setLoading] = useState(true);

    const [classrooms, setClassrooms] = useState([]);
    const { token, user } = useUserContext();
    const [open, setOpen] = useState(false);

    const fetchClassrooms = async () => {
        try {
            const data = await classroomService.getAllClassrooms(token);
            setClassrooms(data);
        }
        catch (error) {
        }
    }

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchClassrooms();

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, []);


    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchClassrooms();
    };

    const handleCreateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El profesor ha sido resgistrado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    }

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
                                <Button color="white" className={classes["quickAddButton"]} onClick={handleOpenDialog}>
                                    <Typography className='text-sm justify-center my-auto
                            font-masferrerTitle font-medium PC-1280*720:text-xs 
                            PC-800*600:text-xs
                            PC-640*480:text-xs
                            Mobile-390*844:text-xs
                            Mobile-280:text-xs

                            IpadAir:text-xs'>Agregar Salon de Clases</Typography>
                            </Button>
                            </div>
                            <div className={[classes["pageContentContainerRow"]]}>
                                <div className={[classes["SubtitleContainer"]]}>
                                <ClassroomList classrooms={classrooms} fetchClassrooms={fetchClassrooms}/>
                                </div>
                            </div>
                            <Dialog open={open} handler={handleOpenDialog} className="overflow-auto h-6/7">
                                <DialogHeader> Registrar Salón de Clase:  </DialogHeader>
                                <DialogBody> <ClassroomForm /> </DialogBody>
                                <DialogFooter>
                                    <Button color="red" className='m-4' onClick={handleCloseDialog}> Cancelar </Button>
                                </DialogFooter>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        );
}

export default ClassroomPage;
