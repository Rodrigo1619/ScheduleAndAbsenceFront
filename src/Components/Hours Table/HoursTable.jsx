import React from 'react';
import classes from './HoursTable.module.css';
import { Button, CardBody, Typography } from '@material-tailwind/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { IoAddCircleOutline } from 'react-icons/io5';

const HoursTable = () => {

    const TABLE_HEAD = [
        "HORA",
    ];

    const SUBJECTS = 
    [
        { id: 1, hora: "1° hora" },
        { id: 2, hora: "2° hora" },
        { id: 3, hora: "3° hora" },
        { id: 4, hora: "4° hora" },
        { id: 5, hora: "5° hora" },
        { id: 6, hora: "6° hora" },
        { id: 7, hora: "7° hora" },
        { id: 8, hora: "8° hora" },
    ];

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
                                <td className="p-4 w-auto bg-transparent">
                                    <div className="flex font-masferrer px-2 py-0 mt-2">
                                    <div className="font-masferrer text-xl font-regular border-2 
                                    px-2 py-2 border-black">
                                    <Typography
                                        className="font-masferrerTitle text-center text-xl font-bold"
                                    >
                                        {subject.hora}
                                    </Typography>
                                    </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>
        </div>
    );

}

export default HoursTable;