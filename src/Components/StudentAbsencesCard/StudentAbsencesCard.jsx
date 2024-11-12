import React from 'react';
import { Card, Typography, Chip, CardBody } from "@material-tailwind/react";
import studentAbsences from "../../assets/icons/student-absences.png";

const StudentAbsencesCard = ({name1, classroom1, absences1, name2, classroom2, absences2, fromCoordination = false}) => {
    return (
        <Card className="w-auto rounded-lg bg-white shadow-lg ml-8">
            <CardBody className='p-0'>
                <Typography className="text-blueMasferrer font-masferrerTitle 
                font-bold mb-2">
                    ALUMNOS CON MÁS FALTAS EN EL MES:
                </Typography>
                <div className="flex flex-row 
                Mobile-390*844:flex-col Mobile-390*844:mx-auto 
                Mobile-280:flex-col Mobile-280:mx-auto
                ">
                    <div className="flex flex-col w-64 mx-8 mb-8 bg-blueMasferrer bg-opacity-70 pb-4 justify-center
                    px-14 rounded-2xl
                    Mobile-390*844:my-4 Mobile-390*844:px-4 Mobile-390*844:mx-auto
                    Mobile-280:my-4 Mobile-280:px-4 Mobile-280:mx-auto
                    ">
                        <img src={studentAbsences} alt="Alumno" className="h-24 w-auto justify-center mx-auto my-4" />
                        <Typography className="text-white font-masferrerTitle w-full">
                            {name1 || "No hay estudiantes con inasistencias"}
                        </Typography>
                        {
                            classroom1 ? (
                                <>
                                    <Chip value={classroom1} className="bg-orange-900 p-2 my-2 mx-auto text-center
                                    font-masferrerTitle border rounded-full w-fit overflow-auto" />
                                    <Chip value={absences1} className="bg-blueMasferrer text-white mt-8 
                                    p-2 mx-auto font-masferrerTitle border rounded-full w-fit overflow-auto" />
                                </>
                            ) : (
                                <div className='p-16'>
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col w-64 mx-8 mb-8 bg-blueMasferrer bg-opacity-70 pb-4 justify-center
                    px-14 rounded-2xl
                    Mobile-390*844:my-4 Mobile-390*844:px-4 Mobile-390*844:mx-auto
                    Mobile-280:my-4 Mobile-280:px-4 Mobile-280:mx-auto">
                        <img src={studentAbsences} alt="Alumno" className="h-24 w-auto justify-center mx-auto my-4" />
                        <Typography className="text-white font-masferrerTitle w-full">
                            {name2}
                        </Typography>
                       {
                            classroom2 ? (
                                fromCoordination ? (
                                    <>
                                        <Chip value={classroom2} className="bg-orange-900 p-2 my-2 text-center -ml-3
                                        font-masferrerTitle border rounded-full w-fit overflow-auto" />
                                        <Chip value={absences2} className="bg-blueMasferrer text-white mt-8 
                                        px-2 py-2 mx-auto font-masferrerTitle border rounded-full w-fit overflow-auto" />
                                    </>
                                ) : (
                                    <>
                                        <Chip value={classroom2} className="bg-orange-900 p-2 my-2 mx-auto text-center
                                    font-masferrerTitle border rounded-full w-fit overflow-auto" />
                                        <Chip value={absences2} className="bg-blueMasferrer text-white mt-8 
                                        px-2 py-2 mx-auto font-masferrerTitle border rounded-full w-fit overflow-auto" />
                                    </>
                                )
                            ) : (
                                <div className='p-16'>
                                </div>
                            )
                       }
                    </div>
                </div>
               
            </CardBody>
        </Card>
    );
};

export default StudentAbsencesCard;