import React from "react";

import classes from "./TableCard.module.css";

import { CardHeader, CardBody, Typography, CardFooter, Button } from "@material-tailwind/react";

const TableCard = ({ title, TABLE_HEAD, USERS }) => {

    return (
        <div className={classes["generalCardContainer"]}>
            <div className={classes["tableTitle"]}>
                <div>
                    <Typography className="font-masferrer text-xl font-regular 
                            text-center justify-center items-center mx-auto font-bold text-black">
                        {title}
                    </Typography>
                </div>
            </div>

            <CardBody className="px-0 py-1">
                <table className="table-auto text-center w-full">
                    <thead>
                        <tr>
                            {TABLE_HEAD?.map((head, index) => (
                                <th key={index} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(USERS) && USERS.length > 0 ? (
                                USERS?.map((user, index) => (
                                    <tr key={index}>
                                        {Object.entries(user).slice(1)?.map(([key, value]) => ( // slice(1) to skip the first entry
                                            !['boolean'].includes(typeof value) &&
                                            <td className="p-4" key={key}>
                                                {typeof value === 'object' ? (
                                                    // Si el valor es un objeto, extrae sus propiedades
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {value && value.name ? value.name : "N/A"}
                                                    </Typography>
                                                ) : (
                                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                                        {value}
                                                    </Typography>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={TABLE_HEAD.length} className="p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            No hay datos para mostrar
                                        </Typography>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </CardBody>
        </div>

    );

};

export default TableCard;