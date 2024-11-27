import { useState, useEffect } from 'react';

import styles from "./TableVerificationAttendanceComponent.module.css";

import { MdOutlineSearch } from "react-icons/md";
import { RiFileDownloadFill } from "react-icons/ri";
import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { AiOutlineLoading } from "react-icons/ai";
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

import dayjs from 'dayjs';
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
    isDownload = false,
    localDate,
    tableDate,
    noContent,
}) => {

    const formatedHeaders = tableHeaders.slice(1).filter((header) => header !== "Nombre");

    const { token } = useUserContext();
    const [codeList, setCodeList] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState(tableData);

    const [openDialog, setOpenDialog] = useState(false);

    const currentDate = dayjs(new Date()).format("DD-MM-YYYY");

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
            }
        };

        fetchCodes();
    }, [token]);

    useEffect(() => {
        setCurrentPage(1);
        const filtered = tableData.filter(row => 
            row.student.nie.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.student.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchTerm, tableData]);

    const handleDownloadExcel = async () => {
        if (selectedRows.length === 0 && formatedHeaders.length > 1 && tableKeys.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.addRow(formatedHeaders);

            filteredData.forEach(row => {

                const newRow = tableKeys.map((key) => {
                    if (key.includes(".")) {
                        return key.split(".").reduce((acc, part) => acc ? acc[part] : "", row);
                    } else {

                        if(key === "code") {
                            return generalData.classroom.grade.section;
                        }

                        if(key === "idGoverment") {
                            return generalData.classroom.grade.idGoverment;
                        }

                        if(key === "date"){
                            return localDate;
                        }

                        return row[key];
                    }
                });
                worksheet.addRow(newRow);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Inasistencia ${generalData.classroom.grade.name}-${localDate}.xlsx`);
        }

        if (selectedRows.length > 0 && formatedHeaders.length > 1 && tableKeys.length > 0) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Data');

            worksheet.addRow(formatedHeaders);

            selectedRows.forEach(row => {

                const newRow = tableKeys.map((key) => {
                    if (key.includes(".")) {
                        return key.split(".").reduce((acc, part) => acc ? acc[part] : "", row);
                    } else {

                        if(key === "code") {
                            return generalData.classroom.grade.section;
                        }

                        if(key === "idGoverment") {
                            return generalData.classroom.grade.idGoverment;
                        }

                        if(key === "date"){
                            return localDate;
                        }

                        return row[key];
                    }
                });
                worksheet.addRow(newRow);
            });

            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer], { type: "application/octet-stream" }), `Inasistencia ${generalData.classroom.grade.name}-${localDate}.xlsx`);
        }
    };

    const handleDownloadCSV = () => {

        if (selectedRows.length === 0 && formatedHeaders.length > 1 && tableKeys.length > 0) {
            const csvData = filteredData.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    if (key === "absent") {
                        newRow[formatedHeaders[index]] = row[key];
                    } else if(key === "code") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.section;
                    } else if (key === "idGoverment") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.idGoverment;  
                    } else if (key === "date") {
                        newRow[formatedHeaders[index]] = localDate;
                    } else if (key.includes(".")) {
                        const keys = key.split(".");
                        let value = row;
                        keys.forEach(k => {
                            value = value ? value[k] : "";
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
            saveAs(blob, `Inasistencia ${generalData.classroom.grade.name}-${localDate}.csv`);
        }

        if (selectedRows.length > 0 && formatedHeaders.length > 1 && tableKeys.length > 0) {
            const csvData = selectedRows.map(row => {
                const newRow = {};
                tableKeys.forEach((key, index) => {
                    if (key === "absent") {
                        newRow[formatedHeaders[index]] = row[key];
                    } else if(key === "code") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.section;
                    } else if (key === "idGoverment") {
                        newRow[formatedHeaders[index]] = generalData.classroom.grade.idGoverment;  
                    } else if (key === "date") {
                        newRow[formatedHeaders[index]] = localDate;
                    } else if (key.includes(".")) {
                        const keys = key.split(".");
                        let value = row;
                        keys.forEach(k => {
                            value = value ? value[k] : "";
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
            saveAs(blob, `Inasistencia ${generalData.classroom.grade.name}-${localDate}.csv`);
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

    const handleAbsentBtn = (index, newStatus) => {
        const updatedData = [...filteredData];
    
        const globalIndex = (currentPage - 1) * rowsPerPage + index;
    
        updatedData[globalIndex].absent = newStatus;
        setFilteredData(updatedData);
    };

    const handleSelectCodeChange = (index, e) => {

        const newCode = codeList.find(code => code.id === e.value);

        const updatedData = [...filteredData];

        const globalIndex = (currentPage - 1) * rowsPerPage + index;

        updatedData[globalIndex].code = newCode;
        setFilteredData(updatedData);

    };

    const handleObservationChange = (index, newObservation) => {

        const globalIndex = (currentPage - 1) * rowsPerPage + index;

        const updatedData = [...filteredData];
        updatedData[globalIndex].comments = newObservation;
        setFilteredData(updatedData);
    };

    const handleSaveAbsenceChanges = async () => {
        
        const editAbsentStudentsList = filteredData.filter((absentStudent) => absentStudent.absent === "Si");
        const deleteAbsentStudentsList = filteredData
                .filter(absentStudent => absentStudent.absent === "No" && absentStudent.id !== null)
                .map(absentStudent => (absentStudent.id));

        const formatedAbsentStudents = editAbsentStudentsList.map((absentstudent) => {
            return {
                id_student: absentstudent.student.id,
                id_code: absentstudent.code ? absentstudent.code.id : "",
                comments: absentstudent.comments ? absentstudent.comments : "",
            }
        });
        
        const updatedData = absenceRecordDetails;
        updatedData.absentStudents = formatedAbsentStudents;

        const absenceRecordJSON = {
            id: updatedData.id,
            date: updatedData.date,
            maleAttendance: updatedData.maleAttendance,
            femaleAttendance: updatedData.femaleAttendance,
            absentStudents: formatedAbsentStudents ? formatedAbsentStudents : [],
            deleteAbsentStudents: deleteAbsentStudentsList ? deleteAbsentStudentsList : [],
        }
        
        const loadingToast = toast('Cargando...', {
            icon: <AiOutlineLoading className="animate-spin" />,
        });
        try {
            const response = await absenceRecordService.editAbsenceRecord(token, absenceRecordJSON);

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
        } finally {
            toast.dismiss(loadingToast);
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
                            noContent ? (
                                <Typography as="a" href="#" size="sm" className='hover:pointer-events-none text-gray-400'>
                                    <RiFileDownloadFill size={24} />
                                </Typography>
                            ) : (
                                <Typography as="a" href="#" size="sm" onClick={handleOpenDialog} className='text-gray-900'>
                                    <RiFileDownloadFill size={24} />
                                </Typography>
                            )
                        )}
                        {isDownload && (
                            noContent ? (
                                <Typography className="bg-green-200 text-white font-masferrer font-medium rounded-md px-2 py-1 hover:pointer-events-none">
                                    Guardar cambios
                                </Typography>
                            ) :(
                                <Typography as="a" href="#" className="bg-green-500 text-white font-masferrer font-medium rounded-md px-2 py-1" onClick={handleSaveAbsenceChanges}>
                                    Guardar cambios
                                </Typography>
                            )
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
                        {
                            noContent ? (
                                <tr>
                                    <td colSpan={tableHeaders.length} className="p-4 text-center">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            No hay datos para mostrar
                                        </Typography>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((row, index) => (
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
                                                {row.date || tableDate}
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
                                            {
                                                row.absent === "Si" ? (
                                                    <button className='text-white font-masferrer font-normal bg-blueMasferrer py-1 px-4 rounded-md'
                                                        onClick={() => handleAbsentBtn(index, row.absent === "Si" ? "No" : "Si")}>
                                                        {row.absent}
                                                    </button>
                                                ) : (
                                                    <button className='text-gray-800 font-masferrer font-normal bg-gray-200 py-1 px-3 rounded-md'
                                                        onClick={() => handleAbsentBtn(index, row.absent === "Si" ? "No" : "Si")}>
                                                        {row.absent}
                                                    </button>
                                                )
                                            }
                                        </td>

                                        <td className="p-4">                                    
                                            {
                                                row.absent === "Si" ? (
                                                    <select
                                                        className='border-2 border-gray-400 rounded p-1'
                                                        onChange={(e) => handleSelectCodeChange(index, e.target)}
                                                        value={row.code ? row.code.id : ""}>
                                                            <option value={row.code ? row.code.id : ""}>{row.code ? row.code.description : "Elija una opcion"}</option>
                                                            {codeList.map((codes) => <option key={codes.id} value={codes.id}>{codes.description}</option>)}
                                                    </select>
                                                ) : (
                                                    <select disabled className='bg-gray-200 rounded p-1'
                                                        value={""}>
                                                        <option value={""}>{"N/A"}</option>
                                                        {codeList.map((codes) => <option key={codes.id} value={codes.id}>{codes.description}</option>)}
                                                    </select>
                                                )
                                            }
                                        </td>
                                        <td className="p-4">
                                            {
                                                row.absent === "Si" ? (
                                                    <input
                                                        type="text"
                                                        className='border-2 border-gray-400 rounded'
                                                        value={row.comments || ""}
                                                        onChange={(e) => handleObservationChange(index, e.target.value)}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className='border-2 border-gray-300 rounded' disabled
                                                        value={row.comments || ""}
                                                        onChange={(e) => handleObservationChange(index, e.target.value)}
                                                    />
                                                )
                                            }
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
