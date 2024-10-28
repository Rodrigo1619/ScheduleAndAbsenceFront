import React from "react";
import { CardBody, Typography } from "@material-tailwind/react";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import styles from "./BodyTableUser.module.css";

const BodyTableUser = ({ TABLE_HEAD, USERS, selectedRows, handleCheckboxChange, handleUpdate, handleDelete, handleStatus, noChange = true, showUpdateButton = true, isFromClassroom = false }) => {
    return (
        <CardBody className={`${styles["table-container"]} px-0 py-1 overflow-scroll`}>
            <table className={`${styles.table} text-left`}>
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head, index) => (
                            <th key={index} className="bg-blue-gray-50 p-4">
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
                    {USERS.map((row, index) => (
                        <tr key={index} className={selectedRows.some(selected => selected.id === row.id) ? styles["selected-row"] : ""}>
                            {noChange &&
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.some(selected => selected.id === row.id)}
                                        onChange={() => handleCheckboxChange(row)}
                                    />
                                </td>
                            }
                            {Object.entries(row).map(([key, value]) => (
                                <td className="p-4" key={key}>
                                    {key === "active" ? (
                                        <Typography
                                            as={"a"}
                                            href="#"
                                            variant="small"
                                            className="font-medium"
                                            onClick={() => handleStatus(row)}>
                                            {value ? (
                                                <IoMdCheckmarkCircleOutline size={24} color={"green"} />
                                            ) : (
                                                <IoMdCloseCircleOutline size={24} color={"red"} />
                                            )}
                                        </Typography>
                                    ) : typeof value === 'object' ? (
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
                            {showUpdateButton && noChange && !isFromClassroom &&
                                <td className="p-4 w-auto">
                                    <Typography
                                        as="a"
                                        href="#"
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                        onClick={() => handleUpdate(row)}
                                    >
                                        <MdOutlineEdit size={24} />
                                    </Typography>
                                </td>
                            }
                            {noChange && !isFromClassroom &&
                                <td className="p-4 w-auto">
                                    <Typography
                                        as="a"
                                        href="#"
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                        onClick={() => handleDelete(row)}
                                    >
                                        <RiDeleteBin6Line size={24} />
                                    </Typography>
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </CardBody>
    );
};

export default BodyTableUser;
