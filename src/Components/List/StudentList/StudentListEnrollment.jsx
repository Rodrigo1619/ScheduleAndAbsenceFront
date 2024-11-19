import React, { useEffect, useState } from 'react';
import { Button, Card, Dialog, DialogBody, DialogFooter, DialogHeader, Typography } from "@material-tailwind/react";
import UserTable from '../../Table/TableUserComponents/BodyTableUser.jsx'; 
import PaginationFooter from '../../Table/TableUserComponents/FooterTableUser.jsx';
import UserHeader from '../../Table/TableUserComponents/HeaderTableUser.jsx';
import { useUserContext } from '../../../Context/userContext'
import StudentForm from '../../Form/StudentForm/StudentForm.jsx';
import { notification } from 'antd';
import { studentService } from '../../../Services/studentService.js';
import { classroomService } from '../../../Services/classroomService.js';
import { Grid } from 'react-loader-spinner';

const TABLE_HEAD = ["", "ID", "NIE", "Nombre Completo", "Estado", "",""];

const TABLEH_Class = ["", "", "", "NIE", "Nombre Completo", "Estado"];

const TABLEH2_Class = ["", "", "NIE", "Nombre Completo", "Salón Actual", "Matriculado en"];

const TABLE_KEYS = ["id", "nie", "fullName"];

const StudentListEnrollment = ({ students = [], classroom, fetchStudents, classroomName, 
    updateSelectedStudents, populate, enroll }) => {
    const { token } = useUserContext();
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [enrolledClassrooms, setEnrolledClassrooms] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openStatus, setOpenStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notificationShown, setNotificationShown] = useState(false);


    useEffect(() => {
        if (!notificationShown && !populate) {
            notification.info({
                message: 'Información',
                description: 'Haga una busqueda por salón de clase para obtener los estudiantes',
                placement: 'top',
                duration: 2,
            });
            setNotificationShown(true);
        }

        const fetchEnrolledStudents = async () => {
            try {
                const data = await classroomService.getEnrollmentsByClassroom(token, classroomName.id);
                setEnrolledStudents(data.map((student) => ({
                    id: student.student.id,
                    enrolledId: student.id,
                    nie: student.student.nie,
                    name: student.student.name,
                    actualClassroom: student.classroom.grade.name + " - " + student.classroom.grade.shift.name
                     + " " + student.classroom.year,
                    enrolled: student.enrolledClassroom ? student.enrolledClassroom.grade.name + " - " + student.enrolledClassroom.grade.shift.name
                        + " " + student.enrolledClassroom.year : "No matriculado"
                })));

            notification.success({
                message: 'Éxito',
                description: 'Estudiantes obtenidos exitosamente',
                placement: 'top',
                duration: 2,
            });

            } catch (error) {
                if (!classroomName && !populate) {
                    notification.info({
                        message: 'Información',
                        description: 'Haga una busqueda por salón de clase para obtener los estudiantes',
                        placement: 'top',
                        duration: 2,
                    });
                } else if (!populate && enrolledStudents.length == 0) {
                    notification.error({
                        message: 'Error',
                        description: 'No se encontraron estudiantes en los registros',
                        placement: 'top',
                        duration: 2,
                    });
                }
                setEnrolledStudents([]);
            } 
        };

        if (classroomName) {
            fetchEnrolledStudents();
        }
        setSelectedRows([]);
    }, [classroomName, token, students]);

    // Ensure STUDENTS is an array before mapping
    const STUDENTSWC = Array.isArray(students) ? students.map((student) => ({
        id: student.id,
        nie: student.nie,
        fullName: student.name,
        active: student.active,
    })) : [];


    const STUDENTS = classroomName != undefined ? enrolledStudents.map((student) => ({
        id: student.id,
        enrolledId: student.enrolledId,
        nie: student.nie,
        fullName: student.name,
        actualClassroom: student.actualClassroom,
        enrolled: student.enrolled || "No matriculado"
    })) : STUDENTSWC;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, rowsPerPage]);

    // Filtra las filas según el término de búsqueda
    const filteredStudents = STUDENTS.filter((student) =>
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.nie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcula el índice inicial y final de las filas a mostrar
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    // Filtra las filas según el índice inicial y final, 
    // si classroomName no es undefined no se mostrara el ultimo campo en la tabla
    const visibleStudents = classroomName != undefined ? filteredStudents.slice(startIndex, endIndex) : filteredStudents.slice(startIndex, endIndex).map((student) => ({
        id: student.id,
        nie: student.nie,
        fullName: student.fullName,
        active: student.active,
    }));

    // Calcula el total de páginas
    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);

    // Actualiza la página actual
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleCheckboxChange = (row) => {
        const isSelected = selectedRows.some(selected => selected.id === row.id);
        
        if (isSelected) {
            // Si la fila ya está seleccionada, la removemos
            setSelectedRows(selectedRows.filter(selected => selected.id !== row.id));
        } else {
            // Si la fila no está seleccionada, la agregamos
            setSelectedRows([...selectedRows, row]);
        }

    };  

    const handleSelectAllChange = () => {
        if (selectedRows.length === visibleStudents.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(visibleStudents);
        }
    };

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        fetchStudents()
    };

    const handleOpenDeleteDialog = (student) => {
        setSelectedStudent(student);
        setOpenDelete(true);
    };

    const handleCloseDeleteDialog = () => { 
        setOpenDelete(false);
    };

    const handleOpenStatusDialog = (student) => {
        setSelectedStudent(student);
        setOpenStatus(true);
    };

    const handleCloseStatusDialog = () => { 
        setOpenStatus(false);
    };

    const handleUpdateStudents = (student) => {
        setSelectedStudent(student);
        handleOpenDialog();
    }

    const handleUpdateSuccess = () => {
        notification.success({
            message: 'Éxito',
            description: 'El estudiante ha sido actualizado exitosamente',
            placement: 'top',
            duration: 2,
        });
        handleCloseDialog();
    }

    const handleDeleteStudents = async () => {
        try {
            const data = await studentService.deleteStudent(selectedStudent.id, token);
            if (data) {
                setOpenDelete(false);
                notification.success({
                    message: 'Éxito',
                    description: 'El estudiante ha sido eliminado exitosamente',
                    placement: 'top',
                    duration: 2,
                });
                fetchStudents();
            }
        }
        catch (error) {
        }
    }

    const handleChangeStatus = async () => {
    };

    useEffect(() => {
        updateSelectedStudents(selectedRows);
    }
    , [selectedRows]);

    return (
        loading ? (
                <div className="fixed">
                    <Grid type="Grid" color="#170973" height={80} width={80} visible={loading} />
                    <Typography
                    className='text-center text-blueMasferrer font-bold text-2xl'
                    > Cargando... </Typography>
                </div>

            ):(
            <Card className="h-full w-full mx-auto">
                <UserHeader 
                    title="Lista de Estudiantes" 
                    searchTerm={searchTerm} 
                    setSearchTerm={setSearchTerm} 
                    handleDelete={handleDeleteStudents}
                    isDownload={true}
                    selectedRows={selectedRows}
                    tableHeaders={TABLE_HEAD}
                    tableKeys={TABLE_KEYS}
                    allRows={visibleStudents}
                    setSelectedRows={setSelectedRows}
                    handleSelectAllChange={handleSelectAllChange}
                    AllData={filteredStudents}
                />
                <UserTable 
                    TABLE_HEAD={classroomName ? TABLEH2_Class : TABLEH_Class} 
                    USERS={visibleStudents} 
                    selectedRows={selectedRows}
                    handleCheckboxChange={handleCheckboxChange}
                    handleDelete={handleOpenDeleteDialog}
                    handleUpdate={handleUpdateStudents}
                    handleStatus={handleOpenStatusDialog}
                    isFromClassroom={classroom}
                    editStatus={false}
                    enroll={enroll}
                    populate={populate}
                />
                <PaginationFooter 
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    filteredTeachers={filteredStudents}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                />
                    <Dialog open={open}  handler={handleOpenDialog}>
                        <DialogHeader> Editar Estudiante </DialogHeader>
                        <DialogBody> <StudentForm student={selectedStudent} editStatus={true} onSuccess={handleUpdateSuccess} /> </DialogBody>
                    <DialogFooter>
                        <Button color="red" className='m-4' onClick={handleCloseDialog}> Cancelar </Button>
                    </DialogFooter>
                    </Dialog>
                    <Dialog open={openDelete} handler={handleOpenDeleteDialog}>
                        <DialogHeader> Eliminar Estudiante </DialogHeader>
                        <DialogBody> 
                            ¿Estás seguro que deseas eliminar el estudiante {selectedStudent.fullName}? <br/>
                            <p className="font-semibold"> Puede que el dato se este utilizando en otro lugar. </p>
                            </DialogBody>
                    <DialogFooter>
                        <Button color="green" className='m-4' onClick={handleDeleteStudents}> Eliminar </Button>
                        <Button color="red" className='m-4' onClick={handleCloseDeleteDialog}> Cancelar </Button>
                    </DialogFooter>
                    </Dialog>
                    <Dialog open={openStatus} handler={handleOpenStatusDialog}>
                    <DialogHeader> Editar Estado de Actividad </DialogHeader>
                    <DialogBody> ¿Estás seguro que deseas cambiar el estado de { selectedStudent.fullName }? </DialogBody>
                    <DialogFooter>
                        <Button color="green" className='m-4' onClick={handleChangeStatus}> Cambiar </Button>
                        <Button color="red" className='m-4' onClick={handleCloseStatusDialog}> Cancelar </Button>
                    </DialogFooter>
                </Dialog>
            </Card>
        )
    );
}

export default StudentListEnrollment;

