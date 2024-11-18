import React, { useState, useEffect } from "react";
import { Button, 
    Typography, 
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter } from "@material-tailwind/react";
import classes from "./GradePage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import GradeList from "../../Components/List/GradeList/GradeList";
import GradeForm from "../../Components/Form/GradeForm/GradeForm";

import { gradeService } from "../../Services/gradeService";
import { useUserContext } from "../../Context/userContext";

import { Grid } from "react-loader-spinner";

const GradePage = () => {

    const [loading, setLoading] = useState(true);

    const [grades, setGrades] = useState([]);
    const { token, user } = useUserContext();

    const fetchGrades = async () => {
        try {
            const data = await gradeService.getAllGrades(token);

            const formattedData = data.map(grade => {
                return {
                    id: grade.id,
                    name: grade.name.split("").slice(0, -1).join(""),
                    section: grade.section,
                    idGoverment: grade.idGoverment,
                    shift: grade.shift
                }
            });

            setGrades(formattedData);
        } catch (error) {
            setGrades([]);
        }
    }

    const [open, setOpen] = useState(false);

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchGrades();

        setTimeout(() => {
            setLoading(false);
        }, 1500);

    }, []);
    

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchGrades();
    };

    const handleCreateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El grado ha sido actualizado exitosamente',
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
    )
        :(
        <div className={classes["generalContainer"]}>
            <header className={classes["headerContainer"]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={classes["bodyContainer"]}>
                <div className={classes["allContentContainer"]}>
                    <div className={classes["pageContentContainerCol"]}>
                        <div className={classes["TitleContainer"]}>
                        <Button color="white" className={classes["quickAddButton"]} onClick={handleOpenDialog}>
                            <Typography className='text-sm justify-center my-auto
                            font-masferrerTitle font-medium PC-1280*720:text-xs 
                            PC-800*600:text-xs
                            PC-640*480:text-xs
                            Mobile-390*844:text-xs
                            Mobile-280:text-xs
                            IpadAir:text-xs'>Agregar Grado</Typography>
                        </Button>
                        </div>
                        <div className={classes["pageContentContainerRow"]}>
                            <div className={classes["SubtitleContainer"]}>
                            <GradeList grades={grades} fetchGrades={fetchGrades} />
                            </div>
                        </div>
                        <Dialog open={open} handler={handleOpenDialog} className="overflow-auto h-6/7">
                            <DialogHeader> Registrar Grado </DialogHeader>
                            <DialogBody> 
                                <GradeForm onCreate={handleCreateSuccess}/>
                            </DialogBody>
                            <DialogFooter>
                                <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                            </DialogFooter>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default GradePage;
