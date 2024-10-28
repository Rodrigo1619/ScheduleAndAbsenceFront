import { Card, Typography } from "@material-tailwind/react";

const teacherName = "";

const TABLE_HEAD = ["Hora 1", "Hora 2", "Hora 3", "RECREO", "Hora 4", "Hora 5", "Hora 6", "RECREO", 
"Hora 7", "Hora 8"];

const TABLE_ROWS = [
    {
        hora1: "Primer Grado A",
        hora2: "Tercer Grado B",
        hora3: "",
        recreo: "",
        hora4: "Segundo Grado A",
        hora5: "",
        hora6: "",
        recreo: "",
        hora7: "Tercer Grado A",
        hora8: "Primer Grado B",
    },
    // Agrega más filas para representar las demás horas del horario
];

export function TeacherSchedule({ teacherName}) {
    return (
        <Card className="h-fit w-full overflow-auto px-12 bg-transparent mx-12 shadow-none">
            <Typography variant="h5" color="blue-gray" className="font-medium p-4">
                Horario de profesor/a {teacherName}
            </Typography>
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th
                                key={head}
                                className="border-b border-blue-gray-100 bg-blue-gray-100 p-4"
                            >
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
                    {TABLE_ROWS.map(({ hora1, hora2, hora3, recreo, hora4, hora5, hora6, hora7, hora8 }, index) => {
                        const isLast = index === TABLE_ROWS.length - 1;
                        const classes = isLast ? "p-4 bg-white" : "p-4 border-b border-blue-gray-50";

                        return (
                            <tr key={index}>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora1}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora2}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora3}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {recreo}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora4}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora5}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora6}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {recreo}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora7}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                    >
                                        {hora8}
                                    </Typography>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </Card>
    );
}

export default TeacherSchedule;