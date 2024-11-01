import React, { useState, useEffect } from "react";
import { Button, Typography } from '@material-tailwind/react';

import classes from "./CoordinatorHomepage.module.css";

import usersIcon from "../../assets/icons/users-icon.svg";
import searchIcon from "../../assets/icons/search-icon.svg";
import clipboardListIcon from "../../assets/icons/clipboard-list-icon.svg";
import teacherChalkboardIcon from "../../assets/icons/teacherchalkb.svg"
import chalkBoardIcon from "../../assets/icons/chalkboard.svg"

import Header from "../../Components/Header/Header";
import QuickAccessButtons from "../../Components/QuickAccessButtons/QuickAccessButtons";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";
import StudentAbsencesCard from "../../Components/StudentAbsencesCard/StudentAbsencesCard";
import Calendar from "../../Components/Calendar/Calendar";
import { useUserContext } from "../../Context/userContext";


const CoordinatorHomepage = () => {

    const { user } = useUserContext();

    useEffect(() => {
        document.title = "Sistema de Control de Asistencia - Escuela Masferrer";
    }, []);

    return (
        <div className={[classes["generalContainer"]]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
            </header>

            <div className={[classes["bodyContainer"]]}>
                <div className={[classes["allContentContainer"]]}>
                    <div className={[classes["pageContentContainer"]]}>
                        <div className={[classes["SubtitleContainer"]]}>
                            <QuickAccessButtons title="Acciones Generales y de Clase:"
                                iconsvg1={clipboardListIcon} description1="Reportar inasistencias" link1=""
                                iconsvg2={searchIcon} description2="Búsqueda de maestro" link2="/SearchTeacher"
                                iconsvg3={usersIcon} description3="Revisar listado de asistencias" link3=""/>

                            <div className={classes["moreQuickbtns"]}>

                            <div className={[classes["QuickAccessButtonContainer"]]}>
                                <a href={"/TeacherSchedule"}>
                                <Button color="white" className='w-auto h-auto flex flex-row justify-center
                                rounded-full px-12 my-4 hover:shadow-2xl hover:bg-gray-400 mx-2 max-w-80
                                PC-1280*720:my-0 PC-1280*720:mx-2 PC-1280*720:px-4
                                PC-800*600:my-0 PC-800*600:mx-2 PC-800*600:px-4 PC-800*600:w-auto PC-800*600:h-auto
                                PC-640*480:my-0 PC-640*480:mx-2 PC-640*480:px-4 PC-640*480:w-auto PC-640*480:h-auto
                                Mobile-390*844:my-0 Mobile-390*844:mx-2 Mobile-390*844:px-20 Mobile-390*844:w-auto Mobile-390*844:h-auto
                                Mobile-280:my-0 Mobile-280:mx-2 Mobile-280:px-20 Mobile-280:w-auto Mobile-280:h-auto
                                IpadAir:my-0 IpadAir:mx-0 IpadAir:px-4 IpadAir:w-auto IpadAir:h-auto'>
                                    <img src={teacherChalkboardIcon} alt="icon" className='
                                    PC-1280*720:w-7 PC-1280*720:h-7 
                                    PC-640*480:w-7 PC-640*480:h-7
                                    PC-800*600:w-7 PC-800*600:h-7
                                    IpadAir:w-6 IpadAir:h-6 IpadAir:mx-0
                                    Mobile-390*844:w-7 Mobile-390*844:h-7
                                    my-auto
                                    w-10 h-10 mx-4' />
                                    <Typography className='text-sm justify-center my-auto
                                    font-masferrerTitle font-normal PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>{"Ver Horario de Maestro"}</Typography>
                                </Button>
                                </a>
                            </div>

                            <div className={[classes["QuickAccessButtonContainer"]]}>
                                <a href={"/ClassroomSchedule"}>
                                <Button color="white" className='w-auto h-auto flex flex-row justify-center
                                rounded-full px-12 my-4 hover:shadow-2xl hover:bg-gray-400 mx-2 max-w-80
                                PC-1280*720:my-0 PC-1280*720:mx-2 PC-1280*720:px-4
                                PC-800*600:my-0 PC-800*600:mx-2 PC-800*600:px-4 PC-800*600:w-auto PC-800*600:h-auto
                                PC-640*480:my-0 PC-640*480:mx-2 PC-640*480:px-4 PC-640*480:w-auto PC-640*480:h-auto
                                Mobile-390*844:my-0 Mobile-390*844:mx-2 Mobile-390*844:px-20 Mobile-390*844:w-auto Mobile-390*844:h-auto
                                Mobile-280:my-0 Mobile-280:mx-2 Mobile-280:px-20 Mobile-280:w-auto Mobile-280:h-auto
                                IpadAir:my-0 IpadAir:mx-0 IpadAir:px-4 IpadAir:w-auto IpadAir:h-auto'>
                                    <img src={chalkBoardIcon} alt="icon" className='
                                        PC-1280*720:w-7 PC-1280*720:h-7 
                                        PC-640*480:w-7 PC-640*480:h-7
                                        PC-800*600:w-7 PC-800*600:h-7
                                        IpadAir:w-6 IpadAir:h-6 IpadAir:mx-0
                                        Mobile-390*844:w-7 Mobile-390*844:h-7
                                        my-auto
                                        w-10 h-10 mx-4' />
                                    <Typography className='text-sm justify-center my-auto 
                                    font-masferrerTitle font-normal PC-1280*720:text-xs 
                                    PC-800*600:text-xs
                                    PC-640*480:text-xs
                                    Mobile-390*844:text-xs
                                    Mobile-280:text-xs
                                    IpadAir:text-xs'>{"Ver Horario de Aula"}</Typography>
                                </Button>
                                </a>
                            </div>

                            </div>

                        </div>

                        <div className={[classes["dashboardContainer"]]}>
                        
                        <StudentAbsencesCard 
                        name1="Kevin Joshua Montano Martinez"
                        classroom1={"2° Bachillerato Tecnico A"}
                        absences1={5 + " inasistencias"} 
                        name2="Jonathan Adriel Morales Orellana"
                        classroom2={"2° General B"}
                        absences2={4 + " inasistencias"}
                        />

                        <Calendar />

                    </div>
                    
                    </div>
                </div>
            </div>
        </div>

    );
}



export default CoordinatorHomepage;
