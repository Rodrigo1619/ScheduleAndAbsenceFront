import { useState, useEffect } from 'react';

import styles from "./TableVerificationAttendanceComponent.module.css";

import { MdOutlineSearch } from "react-icons/md";
import { RiFileDownloadFill } from "react-icons/ri";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import {Card, 
    CardHeader, 
    CardBody, 
    CardFooter, 
    Typography, 
    Input, 
    Button,
    Dialog,
    DialogHeader,
    DialogFooter 
} from "@material-tailwind/react";
import { Toaster, toast } from 'sonner';

import ExcelJS from 'exceljs';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

import { codeService } from "../../Services/codeService";
import { useUserContext } from '../../Context/userContext';
import { absenceRecordService } from "../../Services/absenceRecordService"


const TableVerificationComponent = ({
    title,
    tableHeaders,
    generalData = [],
    tableData = [],
    tableKeys,
    absenceRecordDetails,
    rowsPerPageOptions = [5, 10, 15],
    isDownload = false
}) => {

    const { token } = useUserContext();
    const [codeList, setCodeList] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(tableData);

    const [openDialog, setOpenDialog] = useState(false);

    const formatedHeaders = tableHeaders.filter(header => 
        header === "Código" ||
        header === "ID Sección" ||
        header === "Fecha" ||
        header === "NIE" ||
        header === "Justificación" ||
        header === "Observación"
    );
    formatedHeaders.splice(4, 0, "Faltó")
    const currentDate = new Date().toISOString().split("T")[0];

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const data = await codeService.getAllCodes(token);
                setCodeList(data);
            } catch (error) {
                console.log("Hubo un error al obtener los códigos" + error);
            }
        };

        fetchCodes();
    }, [token]);

    useEffect(() => {
        const filtered = tableData.filter(row => 
            Object.values(row).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredData(filtered);
    }, [searchTerm, tableData]);

    const handleDownloadExcel = async () => {
        if (selectedRows.length === 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.addRow(formatedHeaders);

            filteredData.forEach(row => {

                const newRow = tableKeys.map((key) => {
                    if (key.includes(".")) {
                        return key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row);
                    } else {

                        if(key === "code") {
                            return generalData.classroom.grade.section;
                        }

                        if(key === "idGoverment") {
                            return generalData.classroom.grade.idGoverment;
                        }

                        if(key === "absent") {
                            return "Sí";
                        }

                        return row[key];
                    }
                });
                worksheet.addRow(newRow);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Inasistencia-${currentDate}.xlsx`);
        }

        if (selectedRows.length > 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.addRow(formatedHeaders);

            selectedRows.forEach(row => {

                const newRow = tableKeys.map((key) => {
                    if (key.includes(".")) {
                        return key.split(".").reduce((acc, part) => acc ? acc[part] : "N/A", row);
                    } else {

                        if(key === "code") {
                            return generalData.classroom.grade.section;
                        }

                        if(key === "idGoverment") {
                            return generalData.classroom.grade.idGoverment;
                        }

                        if(key === "absent") {
                            return "Sí";
                        }

                        return row[key];
                    }
                });
                worksheet.addRow(newRow);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Inasistencia-${currentDate}.xlsx`);
        }
    };

    const handleDownloadCSV = () => {

        if (selectedRows.length === 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const csvData = filteredData.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    if (key === "absent") {
                        newRow[formatedHeaders[index]] = "Sí";
                    } else if(key === "code") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.section;
                    } else if (key === "idGoverment") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.idGoverment;  
                    } else if (key.includes(".")) {
                        const keys = key.split(".");
                        let value = row;
                        keys.forEach(k => {
                            value = value ? value[k] : "N/A";
                        });
                        newRow[formatedHeaders[index]] = value;
                    } else {
                        newRow[formatedHeaders[index]] = row[key];
                    }
                });
                return newRow;
            });

            const csvContent = Papa.unparse(csvData, { header: true });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `Inasistencia-${currentDate}.csv`);
        }

        if (selectedRows.length > 0 && tableHeaders.length > 1 && tableKeys.length > 0) {
            const csvData = selectedRows.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    if (key === "absent") {
                        newRow[formatedHeaders[index]] = "Sí";
                    } else if(key === "code") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.section;
                    } else if (key === "idGoverment") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.idGoverment;  
                    } else if (key.includes(".")) {
                        const keys = key.split(".");
                        let value = row;
                        keys.forEach(k => {
                            value = value ? value[k] : "N/A";
                        });
                        newRow[formatedHeaders[index]] = value;
                    } else {
                        newRow[formatedHeaders[index]] = row[key];
                    }
                });
                return newRow;
            });

            const csvContent = Papa.unparse(csvData, { header: true });
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `Inasistencia-${currentDate}.csv`);
        }
    };

    const handleSelectAllChange = () => {
        if (isSelectAll) {
            setSelectedRows([]);
        } else {
            setSelectedRows(filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
        }
        setIsSelectAll(!isSelectAll);
    };

    const handleCheckboxChange = (row) => {
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(selected => selected !== row));
        } else {
            setSelectedRows([...selectedRows, row]);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSelectCodeChange = (index, e) => {

        console.log("Codigo elegido: ", e.value)

        const newCode = codeList.find(code => code.id === e.value);

        const updatedData = [...filteredData];

        console.log("Codigo actual: ", updatedData[index].code);

        const globalIndex = (currentPage - 1) * rowsPerPage + index;

        updatedData[globalIndex].code = newCode;
        setFilteredData(updatedData);

        console.log("Codigo nuevo: ", updatedData[index].code);
    };

    const handleObservationChange = (index, newObservation) => {

        const globalIndex = (currentPage - 1) * rowsPerPage + index;

        const updatedData = [...filteredData];
        updatedData[globalIndex].comments = newObservation;
        setFilteredData(updatedData);
    };

    const handleSaveAbsenceChanges = async () => {
        
        const formatedAbsentStudents = filteredData.map((absentstudent) => {
            return {
                id_student: absentstudent.student.id,
                comments: absentstudent.comments,
                id_code: absentstudent.code.id,
            }
        });
        
        console.log("Estudiantes formateados: ", formatedAbsentStudents);

        const updatedData = absenceRecordDetails;
        updatedData.absentStudents = formatedAbsentStudents;
        console.log("Datos actualizados: ", updatedData);

        try {
            const response = await absenceRecordService.editAbsenceRecord(token, updatedData);

            if(response) {
                toast.success('Cambios guardados con exito', {
                    duration: 2000,
                    icon: <CheckCircleIcon style={{color: "green"}} />,
                });
            }

        } catch (error) {
            toast.error('Ocurrio un error', {
                duration: 2000,
                icon: <XCircleIcon style={{color: "red"}} />,
            });
        }

    };

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
        <Card className="h-full w-full mx-auto">
            <CardHeader floated={false} shadow={false}>
                <div className={styles.userHeaderContainer}>
                    <div className="flex items-center">
                        {isDownload && (
                            <input
                                type="checkbox"
                                checked={isSelectAll}
                                onChange={handleSelectAllChange}
                            />
                        )}
                        <Typography color="blue-gray" className="text-lg ml-2">
                            {title}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-3 p-1">
                        <Input
                            label="Buscar"
                            icon={<MdOutlineSearch size={24} />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.userHeaderInput}
                        />
                        {isDownload && (
                            <Typography as="a" href="#" color="blue-gray" size="sm" onClick={handleOpenDialog}>
                                <RiFileDownloadFill size={24} />
                            </Typography>
                        )}
                        {isDownload && (
                            <Typography as="a" href="#" className={styles["save-btn"]} onClick={handleSaveAbsenceChanges}>
                                Guardar cambios
                            </Typography>
                        )}
                    </div>
                </div>
                <Dialog open={openDialog} handler={handleOpenDialog}>
                    <DialogHeader>Descargar - {title.toLowerCase()}</DialogHeader>
                    <DialogFooter className="flex flex-col items-center gap-4">
                        <Button color="green" className="m-4" onClick={handleDownloadExcel}>Descargar Excel</Button>
                        <Button color="blue" className="m-4" onClick={handleDownloadCSV}>Descargar CSV</Button>
                        <Button color="red" className="m-4" onClick={handleCloseDialog}>Cancelar</Button>
                    </DialogFooter>
                </Dialog>
            </CardHeader>

            <CardBody className={styles["table-container"] + " px-0 py-1 overflow-scroll"}>
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
                        {paginatedData.map((row, index) => (
                            <tr key={index} className={selectedRows.includes(row) ? styles["selected-row"] : ""}>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(row)}
                                        onChange={() => handleCheckboxChange(row)}
                                    />
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {generalData.classroom.grade.section}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {generalData.classroom.grade.idGoverment}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {row.date}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {row.student.nie}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {row.student.name}
                                    </Typography>
                                </td>
                                <td className="p-4">                                    
                                    <select
                                        onChange={(e) => handleSelectCodeChange(index, e.target)}>
                                            <option value={row.code.description}>{row.code.description}</option>
                                            {codeList.map((codes) => <option key={codes.id} value={codes.id}>{codes.description}</option>)}
                                    </select>
                                </td>
                                <td className="p-4">
                                    <input
                                        type="text"
                                        value={row.comments || ""}
                                        onChange={(e) => handleObservationChange(index, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardBody>

            <CardFooter className={styles.paginationFooterContainer}>
                <div className="flex items-center gap-2">
                    <Typography variant="small" color="blue-gray" className="font-normal">
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

export default TableVerificationComponent;
