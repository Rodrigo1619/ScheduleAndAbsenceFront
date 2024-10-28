import React from 'react';
import { Card, Typography, Chip, CardBody } from "@material-tailwind/react";

const NextSubjectCard = ({subject, classroom, hour, fromSearch = true, teacherName }) => {
    return (
        <Card className="rounded-lg mx-8 bg-white shadow-lg min-w-72 Mobile-390*844:min-w-40 Mobile-390*844:max-w-64">
            <CardBody>
                {
                    fromSearch ? (
                        <Typography className="text-blueMasferrer font-masferrerTitle mt-4 font-bold text-2xl">
                            PRÓXIMA CLASE:
                        </Typography>
                    )
                    : (
                        <Typography className="text-blueMasferrer font-masferrerTitle mt-4 font-bold text-2xl">
                            {teacherName}
                        </Typography>
                    )
                }
                <div className="flex flex-row">
                    <div className="flex flex-col w-full justify-center mx-auto bg-gray-100 border-black 
                    border-opacity-20 border-2 bg-opacity-70 pb-4 px-1 my-6 rounded-2xl">
                    <Chip value={subject} className="bg-orange-900 text-white mt-8 p-2 mx-2 
                    font-masferrerTitle border text-xl rounded-full Mobile-390*844:text-wrap Mobile-280:text-wrap" />
                        <Typography className="text-orange-900 font-masferrerTitle font-bold 
                        my-4 text-xl max-w-60 justify-center mx-auto ">
                            {classroom}
                        </Typography>
                    </div>
                </div>
                <div className="flex w-full mx-auto justify-center">
                <Chip value={hour} className=" text-white bg-blueMasferrer
                p-2 font-masferrerTitle border rounded-full text-md min-w-32" />
                </div>
            </CardBody>
        </Card>
    );
};

export default NextSubjectCard;