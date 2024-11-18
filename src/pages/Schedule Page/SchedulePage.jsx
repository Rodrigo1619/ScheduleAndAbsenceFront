import React, { useState, useEffect } from "react";
import {
    Button,
    Typography,
} from "@material-tailwind/react";
import classes from "./SchedulePage.module.css";
import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import ScheduleList from "../../Components/List/ScheduleList/ScheduleList";
import { scheduleService } from "../../Services/scheduleService";
import { useUserContext } from "../../Context/userContext";

import { Grid } from "react-loader-spinner";

const SchedulePage = () => {

    const [loading, setLoading] = useState(true);

    const [schedules, setSchedules] = useState([]);
    const [open, setOpen] = useState(false);
    const { token, user } = useUserContext();

    const fetchSchedules = async () => {
        try {
            const data = await scheduleService.getSchedules(token);
            setSchedules(data);
        } catch (error) {
        }
    };

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
        fetchSchedules();

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
                                    onClick={() => {
                                        window.location.href = "/AddSchedule";
                                    }}
                                >
                                    <Typography
                                        className="text-sm justify-center my-auto
                                font-masferrerTitle font-normal PC-1280*720:text-xs 
                                PC-800*600:text-xs
                                PC-640*480:text-xs
                                Mobile-390*844:text-xs
                                Mobile-280:text-xs
                                IpadAir:text-xs"
                                    >
                                        Agregar horario
                                    </Typography>
                                </Button>
                            </div>
                            <div className={classes["pageContentContainerRow"]}>
                                <div className={classes["SubtitleContainer"]}>
                                    <ScheduleList schedules={schedules} fetchSchedules={fetchSchedules} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default SchedulePage;
