import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";
import classes from "./SubjectPage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import SubjectForm from "../../Components/Form/SubjectForm/SubjectForm";
import SubjectList from "../../Components/List/SubjectList/SubjectList";
import { subjectService } from "../../Services/subjectService";
import { useUserContext } from "../../Context/userContext";

import { Grid } from "react-loader-spinner";

const SubjectPage = () => {

    const [loading, setLoading] = useState(true);

    const [subjects, setSubjects] = useState([]);
    const { token, user } = useUserContext();

    const [openRegister, setOpenRegister] = useState(false);

    const fetchSubjects = async () => {
        try {
            const data = await subjectService.getAllSubjects(token);
            setSubjects(data);
        }
        catch (error) {
        }
    }

    const handleOpenRegisterDialog = () => {
        setOpenRegister(true);
    };

    const handleCloseRegisterDialog = () => {
        setOpenRegister(false);
        fetchSubjects();
    };

    const handleRegisterSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'La Materia ha sido registrada exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseRegisterDialog();
    }

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchSubjects();

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, []);


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
                <header className={[classes["headerContainer"]]}>
                    <Header name={user?.name} role={user?.role.name} />
                </header>

                <div className={[classes["bodyContainer"]]}>
                    <div className={[classes["allContentContainer"]]}>
                        <div className={[classes["pageContentContainerCol"]]}>
                            <div className={[classes["TitleContainer"]]}>
                                <Button color="white" className='m-4' onClick={handleOpenRegisterDialog}>
                                    <Typography className='text-sm justify-center my-auto
                            font-masferrerTitle font-medium PC-1280*720:text-xs 
                            PC-800*600:text-xs
                            PC-640*480:text-xs
                            Mobile-390*844:text-xs
                            Mobile-280:text-xs
                            IpadAir:text-xs'>Agregar materia</Typography>
                                </Button>
                                <Dialog open={openRegister} handler={handleOpenRegisterDialog}>
                                    <DialogHeader> Registrar Materia </DialogHeader>
                                    <DialogBody> <SubjectForm editStatus={false} onSuccess={handleRegisterSuccess} />
                                    </DialogBody>
                                    <DialogFooter>
                                        <Button color="red" className='m-4' onClick={handleCloseRegisterDialog}> Cancelar </Button>
                                    </DialogFooter>
                                </Dialog>
                            </div>
                            <div className={[classes["pageContentContainerRow"]]}>
                                <div className={[classes["SubtitleContainer"]]}>
                                    <SubjectList subjects={subjects} fetchSubjects={fetchSubjects} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
}

export default SubjectPage;
