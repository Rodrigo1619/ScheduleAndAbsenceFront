import React from 'react';
import { Card, Typography, Chip, CardBody } from "@material-tailwind/react";
import studentAbsences from "../../assets/icons/student-absences.png";

const StudentAbsencesCard = ({name1, classroom1, absences1, name2, classroom2, absences2}) => {
    return (
        <Card className="w-auto rounded-lg bg-white shadow-lg mr-4">
            <CardBody>
                <Typography className="text-blueMasferrer font-masferrerTitle 
                font-bold">
                    ALUMNOS CON MÁS FALTAS EN EL MES:
                </Typography>
                <div className="flex flex-row
                Mobile-390*844:flex-col Mobile-390*844:mx-auto 
                Mobile-280:flex-col Mobile-280:mx-auto
                ">
                    <div className="flex flex-col w-64 mr-8 bg-blueMasferrer bg-opacity-70 pb-4 
                    px-14 rounded-2xl
                    Mobile-390*844:my-4 Mobile-390*844:px-4 Mobile-390*844:mx-auto
                    Mobile-280:my-4 Mobile-280:px-4 Mobile-280:mx-auto
                    ">
                        <img src={studentAbsences} alt="Alumno" className="h-24 w-auto justify-center mx-auto my-4" />
                        <Typography className="text-white font-masferrerTitle w-full">
                            {name1 || "No hay estudiantes con inasistencias"}
                        </Typography>
                        <Chip value={classroom1} className="bg-orange-900 text-white p-2 mx-auto my-2
                        font-masferrerTitle border rounded-full w-fit overflow-auto" />
                        <Chip value={absences1} className="bg-blueMasferrer text-white mt-8 
                        p-2 mx-auto font-masferrerTitle border rounded-full w-fit overflow-auto" />
                    </div>
                    <div className="flex flex-col mr-8 bg-blueMasferrer bg-opacity-70 pb-4 
                    px-14 w-64 rounded-2xl
                    Mobile-390*844:my-4 Mobile-390*844:px-4 Mobile-390*844:mx-auto
                    Mobile-280:my-4 Mobile-280:px-4 Mobile-280:mx-auto">
                        <img src={studentAbsences} alt="Alumno" className="h-24 w-auto justify-center mx-auto my-4" />
                        <Typography className="text-white font-masferrerTitle w-full">
                            {name2}
                        </Typography>
                        <Chip value={classroom2} className="bg-orange-900 text-white p-2 mx-auto my-2
                        font-masferrerTitle border rounded-full w-fit overflow-auto" />
                        <Chip value={absences2} className="bg-blueMasferrer text-white mt-8 
                        px-2 py-2 mx-auto font-masferrerTitle border rounded-full w-fit overflow-auto" />
                    </div>
                </div>
               
            </CardBody>
        </Card>
    );
};

export default StudentAbsencesCard;