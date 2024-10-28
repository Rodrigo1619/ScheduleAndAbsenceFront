import React from 'react';
import classes from './HourDynamicTable.module.css';
import { Button, CardBody, Typography } from '@material-tailwind/react';

const HourDynamicTable = ({ hourConfiguration}) => {

    const TABLE_HEAD = [
        "Inicio",
        "Fin",
    ];


     // Sort hourConfiguration by hourStart to ensure correct order
     const sortedHourConfiguration = [...hourConfiguration].sort((a, b) => a.hourStart.localeCompare(b.hourStart));
    
 
     const scheduleMapping = sortedHourConfiguration.reduce((acc, block, index) => {
             acc[`${block.hourStart?.slice(0, 5)}-${block.hourEnd?.slice(0, 5)}`] = index;  
         return acc;
     }, {});

     console.log("Schedule mapping el otro: ", scheduleMapping);


     const SUBJECTS = scheduleMapping ? Object.keys(scheduleMapping).map((key) => {
            const index = scheduleMapping[key];
            return {
                inicio: sortedHourConfiguration[index].hourStart.slice(0, 5),
                fin: sortedHourConfiguration[index].hourEnd.slice(0, 5),
            };
        }) : [];



    return (
        <div className={classes.table}>
            <CardBody className="flex flex-row bg-white px-2 py-1">
                <table className="table-auto text-left w-max">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head, index) => (
                                <th key={index} className="p-4 bg-transparent">
                                    <div className="font-masferrer text-xl font-regular border-2 
                                    px-2 py-1 border-black">
                                    <Typography
                                        className="font-masferrerTitle text-center text-xl font-bold"
                                    >
                                        {head}
                                    </Typography>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {SUBJECTS.map((subject, index) => (
                            <tr key={index}>
                                {Object.values(subject).map((value, index) => (
                                    <td key={index} className="p-4 w-auto bg-transparent">
                                         <div className="flex font-masferrer text-lg font-regular border-2 
                                                px-2 py-3 border-black">
                                        <Typography className="font-masferrerTitle text-center font-bold mx-auto justify-center text-lg">{value}</Typography>
                                        </div>
                                    </td>
                                ))}
                                <td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
        </div>
    );

}

export default HourDynamicTable;