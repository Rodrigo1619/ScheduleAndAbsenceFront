import React, { useState, useEffect } from "react";
import {
    Typography,
} from "@material-tailwind/react";
import classes from "./ClassroomSchedulePage.module.css";
import Header from "../../Components/Header/Header";
import SelectClassroomScheduleForm from "../../Components/Form/SelectClassroomScheduleForm/SelectClassroomScheduleForm";
import { useUserContext } from "../../Context/userContext";

const ClassroomSchedulePage = () => {

    const [isFormVisible, setIsFormVisible] = useState(false);
    const { user } = useUserContext();

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);
    
    const handleButtonClick = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainerCol"]]}>
                        <div className={[classes["TitleContainer"]]}>
                            <Typography className="font-masferrer text-4xl font-regular 
                            text-center justify-center items-center mx-auto font-bold text-black">
                                Horario del salón de clases
                            </Typography>
                        </div>
                        <div className={[classes["pageContentContainerRow"]]}>
                                <SelectClassroomScheduleForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ClassroomSchedulePage;