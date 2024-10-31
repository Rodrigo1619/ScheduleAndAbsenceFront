import classes from "./NewClassroomPage.module.css";
import imgq from "../../assets/formimg.jpg";

import { Typography, Select, Option } from "@material-tailwind/react";

import Header from "../../Components/Header/Header";
import SideBarNav from "../../Components/SideBarNav/SideBarNav";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectSearch from 'react-select'
import ClassroomForm from "../../Components/Form/ClassroomForm/ClassroomForm";
import { useUserContext } from "../../Context/userContext";



const options = [
    { value: 'Montano Martinez Kevin Joshua', label: 'Montano Martinez Kevin Joshua' },
    { value: 'Morales Orellana Jonathan Adriel', label: 'Morales Orellana Jonathan Adriel' },
    { value: 'Bonilla Vides Jose Danilo', label: 'Bonilla Vides Jose Danilo' },
    { value: 'Carranza Campos Brian Darwin', label: 'Carranza Campos Brian Darwin' },
    { value: 'Molina Arias Brandon Rodrigo', label: 'Molina Arias Brandon Rodrigo' },
]

const grades = [
    "1° General", "2° General", "1° Tecnico", "2° Tecnico", "3° Tecnico"
]

const section = [
    { value: 'A', label: 'Sección A' },
    { value: 'B', label: 'Sección B' },
    { value: 'C', label: 'Sección C' },
    { value: 'D', label: 'Sección D' },
    { value: 'E', label: 'Sección E' },
];

const years = ["2021", "2022", "2023", "2024", "2025"];

const shifts = ["Matutino", "Vespertino"];

const NewClassroomPage = () => {

    const { user } = useUserContext();

    return (
        <div className={classes["generalContainer"]}>
            <header className={[classes["headerContainer"]]}>
                <Header name={user?.name} role={user?.role.name} />
                </header>
            <div className={classes["bodyContainer"]}>
                <div className={classes["allContentContainer"]}>
                    <div className={classes["pageContentContainer"]}>
                        <div className={classes["imgQuoteContainer"]}>
                            <img src={imgq} className={classes["imgQuote"]}/>
                            <Typography className="font-masferrer text-2xl font-semibold my-4
                                Mobile-390*844:hidden
                                Mobile-280:text-hidden
                                ">"Instruyendo a las Nuevas Generaciones"</Typography>
                            <Typography className="font-masferrer text-2xl font-light 
                                Mobile-390*844:text-hidden
                                Mobile-280:text-hidden
                                ">Escuela Masferrer</Typography>
                        </div>
                        <div className={classes["titleAndFormContainer"]}>
                            <Typography className="font-masferrerTitle text-3xl font-semibold my-4 text-darkblueMasferrer
                                Mobile-390*844:text-2xl
                                Mobile-280:text-2xl
                                ">Registrar un aula nueva</Typography>
                                <ClassroomForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default NewClassroomPage;