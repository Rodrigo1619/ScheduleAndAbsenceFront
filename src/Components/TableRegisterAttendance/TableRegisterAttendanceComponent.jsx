import { MdOutlineSearch } from "react-icons/md";
import { Card, CardHeader, CardBody, CardFooter, Typography, Input, Button } from "@material-tailwind/react";
import { useState, useEffect } from 'react';
import styles from "./TableRegisterAttendanceComponent.module.css";

const TableRegisterComponent = ({
    title,
    tableHeaders,
    tableData = [],
    rowsPerPageOptions = [5, 10, 15],
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(tableData);

    useEffect(() => {
        setCurrentPage(1);
        const filtered = tableData.filter(row => 
            row.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, tableData]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleStatusChange = (index, newStatus) => {

        const globalIndex = (currentPage - 1) * rowsPerPage + index;

        const updatedData = [...filteredData];
        updatedData[globalIndex].absent = newStatus;
        setFilteredData(updatedData);
    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
        <Card className="h-full w-full mx-auto Mobile-390*844:p-0">
            <CardHeader floated={false} shadow={false}>
                <div className={styles.userHeaderContainer}>
                    <Typography color="blue-gray" className="text-lg ml-2">
                        {title}
                    </Typography>
                    <div className="flex items-center gap-3 p-1">
                        <Input
                            label="Buscar"
                            icon={<MdOutlineSearch size={24} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.userHeaderInput}
                        />
                    </div>
                </div>
            </CardHeader>

            <CardBody className={styles["table-container"] + " px-0 py-1 overflow-scroll Mobile-390*844:px-3"}>
                <table className={styles.table + " text-left"}>
                    <thead>
                        <tr>
                            {tableHeaders.map((head, index) => (
                                <th key={index} className="bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Array.isArray(paginatedData) && paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="p-4 text-center">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            No hay datos para mostrar
                                        </Typography>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, index) => (
                                    <tr key={index}>
                                        <td className="p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {row.name}
                                            </Typography>
                                        </td>
                                        <td className="p-4">
                                            <Button
                                                color={row.absent === "Si" ? "red" : "green"}
                                                onClick={() => handleStatusChange(index, row.absent === "Si" ? "No" : "Si")}>
                                                {row.absent}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )
                        }
                    </tbody>
                </table>
            </CardBody>

            <CardFooter className={styles.paginationFooterContainer}>
                <div className="flex items-center gap-2">
                    <Typography variant="small" color="blue-gray" className="font-normal Mobile-390*844:hidden">
                        Filas por página:
                    </Typography>
                    <select
                        className="border border-blue-gray-300 rounded-md px-2 py-1"
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    >
                        {rowsPerPageOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <Typography variant="small" color="blue-gray">
                    {startIndex + 1}-{endIndex} de {filteredData.length}
                </Typography>
                <div className={styles.paginationButtons}>
                    <Button variant="outlined" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                        Anterior
                    </Button>
                    <Button variant="outlined" size="sm" disabled={endIndex >= filteredData.length} onClick={() => handlePageChange(currentPage + 1)}>
                        Siguiente
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default TableRegisterComponent;

