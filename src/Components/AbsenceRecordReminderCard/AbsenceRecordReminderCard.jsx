import React from 'react';
import { Card, Typography, Chip, CardBody } from "@material-tailwind/react";

const AbsenceRecordReminderCard = ({ classroomName = "", classroomSection = "", todayAbsence = [], fromCoordination = false, totalAbsenceList = null}) => {
    return (
        <Card className="rounded-lg mx-8 bg-white shadow-lg min-w-72 Mobile-390*844:min-w-40 Mobile-390*844:max-w-64">
           {
                fromCoordination ? (
                    <CardBody>
                    <Typography className="text-blueMasferrer font-masferrerTitle mt-4 font-bold text-2xl">
                        Recordatorio:
                    </Typography>
                    
                    <div className="flex flex-row justify-center my-auto">
                        <div className="flex flex-col w-full justify-center mx-auto bg-gray-100 border-black 
                        border-opacity-20 border-2 bg-opacity-70 pb-4 px-1 my-6 rounded-2xl">
                            {
                                totalAbsenceList === '0' ? (
                                    <div className="flex flex-row justify-center mx-auto mt-4 bg-green-500 py-1 px-3 rounded-2xl">
                                        <Typography className="text-white font-masferrerTitle font-normal text-xl">
                                                Registro de inasistencias diario revisado
                                        </Typography>
                                    </div>
                                ) : (
                                    totalAbsenceList === '1' ? (
                                        <div className="flex flex-row justify-center mx-auto mt-4 bg-yellow-800 py-1 px-3 rounded-2xl">
                                            <Typography className="text-white font-masferrerTitle font-normal text-xl">
                                                    Falta revisar {totalAbsenceList} registro de inasistencia diaria 
                                            </Typography>
                                        </div>
                                    ) : (
                                        <div className="flex flex-row justify-center mx-auto mt-4 bg-yellow-800 py-1 px-3 rounded-2xl">
                                            <Typography className="text-white font-masferrerTitle font-normal text-xl">
                                                    Faltan revisar {totalAbsenceList} registros de inasistencia diaria 
                                            </Typography>
                                        </div>
                                    )
                                )
                            }
                        </div>
                    </div>
                </CardBody>
                ) : (
                    <CardBody>
                    <Typography className="text-blueMasferrer font-masferrerTitle mt-4 font-bold text-2xl">
                        Recordatorio:
                    </Typography>
                    
                    <div className="flex flex-row justify-center my-auto">
                        <div className="flex flex-col w-full justify-center mx-auto bg-gray-100 border-black 
                        border-opacity-20 border-2 bg-opacity-70 pb-4 px-1 my-6 rounded-2xl">
                            {
                                !classroomName || !classroomSection || !todayAbsence ? (
                                    <div className="flex flex-row justify-center mx-auto mt-4 bg-red-600 py-1 px-3 rounded-2xl">
                                        <Typography className="text-white font-masferrerTitle font-normal text-xl">
                                                No tiene ningun salón asignado
                                        </Typography>
                                    </div>
                                ) : (
                                    Array.isArray(todayAbsence) && todayAbsence.length === 0 ? 
                                    (
                                        <div className="flex flex-row justify-center mx-auto mt-4 bg-red-600 py-1 px-3 rounded-2xl">
                                            <Typography className="text-white font-masferrerTitle font-normal text-xl">
                                                No se ha realizado el registro de inasistencias de hoy
                                            </Typography>
                                        </div>
    
                                    ) : 
                                    (
                                        todayAbsence[0].teacherValidation ? (
                                            <div className="flex flex-row justify-center mx-auto mt-4 bg-green-500 py-1 px-3 rounded-2xl">
                                                <Typography className="text-white font-masferrerTitle font-normal text-xl">
                                                    Se han registrado las inasistencias de hoy
                                                </Typography>
                                            </div>
                                            ) : (
                                                <div className="flex flex-row justify-center mx-auto mt-4 bg-yellow-800 py-1 px-3 rounded-2xl">
                                                    <Typography className="text-white font-masferrerTitle font-normal text-xl">
                                                        Falta revisar registro de inasistencias de hoy
                                                    </Typography>
                                                </div>
                                            )
                                    )
                                )
                            }
                            {
                                !classroomName || !classroomSection || !todayAbsence ? (
                                    <Typography className="text-red-600 font-masferrerTitle font-bold
                                        mb-2 mt-2 text-xl max-w-60 justify-center mx-auto ">
                                            -
                                        </Typography>
                                ) : (
                                    Array.isArray(todayAbsence) && todayAbsence.length === 0 ? (
                                        <>
                                         <Typography className="text-red-600 font-masferrerTitle font-bold
                                        mb-2 mt-2 text-xl max-w-60 justify-center mx-auto ">
                                            {classroomName}
                                        </Typography>
                                        <Typography className="text-red-600 font-masferrerTitle font-normal
                                        text-xl max-w-60 justify-center mx-auto ">
                                            Sección "{classroomSection}"
                                        </Typography>
                                        </>
                                    ) : (
                                        todayAbsence[0].teacherValidation ? (
                                           <>
                                            <Typography className="text-green-600 font-masferrerTitle font-bold
                                            mb-2 mt-2 text-xl max-w-60 justify-center mx-auto ">
                                                {classroomName}
                                            </Typography>
                                            <Typography className="text-green-600 font-masferrerTitle font-normal
                                            text-xl max-w-60 justify-center mx-auto ">
                                                Sección "{classroomSection}"
                                            </Typography>
                                           </>
                                        ) : (
                                           <>
                                            <Typography className="text-yellow-800 font-masferrerTitle font-bold
                                            mb-2 mt-2 text-xl max-w-60 justify-center mx-auto ">
                                                {classroomName}
                                            </Typography>
                                            <Typography className="text-yellow-800 font-masferrerTitle font-normal
                                            text-xl max-w-60 justify-center mx-auto ">
                                                Sección "{classroomSection}"
                                            </Typography>
                                           </>
                                        )
                                    )
                                )
                            }
                        </div>
                    </div>
                </CardBody>
                )
           }
        </Card>
    );
};

export default AbsenceRecordReminderCard;