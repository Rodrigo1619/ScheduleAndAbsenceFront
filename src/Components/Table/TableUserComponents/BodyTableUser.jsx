import React from "react";
import { CardBody, Typography } from "@material-tailwind/react";
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline, IoMdCloseCircleOutline } from "react-icons/io";
import styles from "./BodyTableUser.module.css";

const BodyTableUser = ({ TABLE_HEAD, USERS, 
    selectedRows, 
    handleCheckboxChange, 
    handleUpdate, 
    handleDelete, 
    handleStatus, 
    noChange = true, 
    showUpdateButton = true, 
    isFromClassroom = false,
    editStatus = true, 
    enroll = false, 
    populate = false }) => {
    const tableHead = populate ? TABLE_HEAD.slice(1) : (enroll ? ["", ...TABLE_HEAD.slice(2)] : TABLE_HEAD);
    return (
        <CardBody className={`${styles["table-container"]} px-0 py-1 overflow-scroll`}>
            <table className={`${styles.table} text-left`}>
                <thead>
                    <tr>
                        {tableHead.map((head, index) => (
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
                    {
                        USERS.length === 0 ? (
                            <tr>
                                <td colSpan={tableHead.length} className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-masferrer text-center">
                                        No hay datos para mostrar
                                    </Typography>
                                </td>
                            </tr>
                        ) : (
                            USERS.map((row, index) => {
                                const rowData = populate ? { ...row, [Object.keys(row)[0]]: undefined } : (enroll ? Object.fromEntries(Object.entries(row).slice(2)) : row);
                                return (
                                    <tr key={index} className={selectedRows.some(selected => selected.id === row.id) ? styles["selected-row"] : ""}>
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.some(selected => selected.id === row.id)}
                                                onChange={() => handleCheckboxChange(row)}
                                            />
                                        </td>
                                        {Object.entries(rowData).map(([key, value]) => (
                                            <td className="p-4" key={key}>
                                                {key === "active" ? (
                                                    <Typography
                                                        as={"a"}
                                                        href="#"
                                                        variant="small"
                                                        className="font-medium"
                                                        onClick={editStatus ? () => handleStatus(row) : undefined}>
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
                                );
                            })
                        )
                    }
                </tbody>
            </table>
        </CardBody>
    );
};

export default BodyTableUser;
