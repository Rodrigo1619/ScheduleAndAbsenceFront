import React, { useEffect, useRef } from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Collapse,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  PowerIcon,
  Bars2Icon,
  HomeIcon,
  TableCellsIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

import logo from "../../assets/logo.png";
import adminIcon from "../../assets/icons/admin-icon.svg";
import teacherIcon from "../../assets/icons/classroom-icon.svg";
import { FaCalendarPlus, FaChalkboardTeacher, FaSearch } from "react-icons/fa";
import { PiChalkboardTeacher, PiChalkboardTeacherFill, PiStackPlusFill, PiStudentFill } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { GiTeacher } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";

import { userService } from "../../Services/userService";
import { useUserContext } from "../../Context/userContext";
import { FcHome } from "react-icons/fc";
import { IoTimeSharp } from "react-icons/io5";

// profile menu component
const profileMenuItems = [
  {
    label: "Cerrar sesión",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");

  const navigate = useNavigate();
  const { token, logout } = useUserContext();

  React.useEffect(() => {
    async function getUser() {
      const user = await userService.verifyToken(token);

      if (user) {
        const headerName = () => {
          const splitName = user.name.split(" ");

          switch (splitName.length) {
            case 1:
              return splitName[0];
            case 3:
              return `${splitName[0]} ${splitName[1]} ${splitName[2]}`;
            case 4:
              return `${splitName[0]} ${splitName[2]}`;
            default:
              return `${splitName[0]} ${splitName[1]}`;
          }
        };

        setName(headerName());
        setRole(user.role.name);
      }
    }

    getUser();
  }, [token]);


  const closeMenu = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <div className="flex flex-col items-start gap-1 p-4">
            <Typography className=" text-darkblueMasferrer font-masferrerTitle font-normal text-xs text-center mx-auto">
              {name}
            </Typography>
            <Typography className="text-black font-masferrerTitle font-light text-xs text-center mx-auto">
              {role}
            </Typography>
          </div>
          {role === "Administrador" ? (
            <Avatar
              variant="circular"
              size="md"
              alt="admin"
              className="border border-gray-900 p-0.5"
              src={adminIcon}
            />
          ) : (
            <Avatar
              variant="circular"
              size="md"
              alt="teacher"
              className="border border-gray-900 p-0.5"
              src={teacherIcon}
            />
          )}
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${isMenuOpen ? "rotate-180" : ""
              }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          return (
            <MenuItem
              key={label}
              onClick={closeMenu}
              className={`flex items-center gap-2 rounded ${isLastItem
                ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                : ""
                }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

// nav list component
const navListItemsAdmin = [
  {
    label: "Inicio",
    icon: HomeIcon,
    path: "/AdminPage"
  },
  {
    label: "Tablas de bases de datos",
    icon: TableCellsIcon,
    path: "/DBDashboard"
  },
  {
    label: "Revisar asistencia",
    icon: UsersIcon,
    path: "/AttendanceGeneralView"
  },
  {
    label: "Buscar profesor",
    icon: FaSearch,
    path: "/SearchTeacher"
  },
  {
    label: "Ver horario de un profesor",
    icon: GiTeacher,
    path: "/TeacherSchedule"
  },
  {
    label: "Registrar a un nuevo usuario",
    icon: PiChalkboardTeacher,
    path: "/TeacherPage"
  },
  {
    label: "Ver horario de un salón de clases",
    icon: CalendarIcon,
    path: "/ClassroomSchedule"
  },
];

const navListItemsTeacher = [
  {
    label: "Inicio",
    icon: HomeIcon,
    path: "/HomePage"
  },
  {
    label: "Buscar maestro",
    icon: SiGoogleclassroom,
    path: "/SearchTeacher"
  },
  {
    label: "Revisar asistencia",
    icon: UsersIcon,
    path: "/AttendanceGeneralView"
  },
  {
    label: "Reportar inasistencia",
    icon: ClipboardDocumentListIcon,
    path: "/AttendanceRegisterView"
  },
];

const navListItemsModerator = [
  {
    label: "Inicio",
    icon: HomeIcon,
    path: "/ModeratorPage"
  },
  {
    label: "Buscar maestro",
    icon: SiGoogleclassroom,
    path: "/SearchTeacher"
  },
  {
    label: "Asignar orientador a salón de clase",
    icon: PiChalkboardTeacherFill,
    path: "/ClassroomPage"
  },
  {
    label: "Registrar un nuevo alumno",
    icon: UserPlusIcon,
    path: "/StudentPage"
  },
  {
    label: "Asignar alumnos a un aula",
    icon: PiStudentFill,
    path: "/PopulateClassroom"
  },
  {
    label: "Matricular estudiantes",
    icon: PiStudentFill,
    path: "/EnrollStudents"
  },
  {
    label: "Ver horario de un salón de clases",
    icon: CalendarIcon,
    path: "/ClassroomSchedule"
  },
  {
    label: "Ver horario de un profesor",
    icon: GiTeacher,
    path: "/TeacherSchedule"
  },
];

const navListItemsCoordinator = [
  {
    label: "Inicio",
    icon: HomeIcon,
    path: "/CoordinatorHomepage"
  },
  {
    label: "Revisar asistencia general",
    icon: UsersIcon,
    path: "/AttendanceGeneralView"
  },
  {
    label: "Buscar maestro",
    icon: FaSearch,
    path: "/SearchTeacher"
  },
  {
    label: "Ver horario de un salón de clases",
    icon: CalendarIcon,
    path: "/ClassroomSchedule"
  },
  {
    label: "Ver horario de un profesor",
    icon: GiTeacher,
    path: "/TeacherSchedule"
  },
];


const navListItemsDefault = [
  {
    label: "Inicio",
    icon: HomeIcon,
    path: "/"
  },
  {
    label: "Buscar maestro",
    icon: FaSearch,
    path: "/SearchTeacher"
  },
];

function NavList({ role, closeNav }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    closeNav();
  };

  let navListItems;
  if (role !== "") {
  if (role === "Profesor") {
    navListItems = navListItemsTeacher;
  } else if (role === "Administrador") {
    navListItems = navListItemsAdmin;
  } 
  else if (role === "Moderator" || role === "Moderador") {
    navListItems = navListItemsModerator;
  }
  else if (role === "Coordinador" || role === "Coordinator") {
    navListItems = navListItemsCoordinator;
  }
  else {
    navListItems = navListItemsDefault;
  }
}

  return (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-col lg:items-start">
      {navListItems?.map(({ label, icon, path }, key) => (
        <Typography
          key={label}
          as="a"
          onClick={() => handleNavigation(path)}
          variant="small"
          color="gray"
          className="font-medium text-blue-gray-500 cursor-pointer"
        >
          <MenuItem className="flex items-center gap-2 lg:rounded-full">
            {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
            <span className="text-gray-900"> {label}</span>
          </MenuItem>
        </Typography>
      ))}
    </ul>
  );
}

export default function Header() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const navRef = useRef();
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");

  const { token, logout } = useUserContext();

  React.useEffect(() => {
    async function getUser() {
      const user = await userService.verifyToken(token);

      if (user) {
        const headerName = () => {
          const splitName = user.name.split(" ");

          switch (splitName.length) {
            case 1:
              return splitName[0];
            case 3:
              return `${splitName[0]} ${splitName[1]} ${splitName[2]}`;
            case 4:
              return `${splitName[0]} ${splitName[2]}`;
            default:
              return `${splitName[0]} ${splitName[1]}`;
          }
        };

        setName(headerName());
        setRole(user.role.name);
      }
    }

    getUser();
  }, [token]);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  const closeNav = () => setIsNavOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeNav();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navRef]);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);

  return (
    <>
      <Navbar className="mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6 bg-transparent shadow-none">
        <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={toggleIsNavOpen}
            className="mr-2"
          >
            <Bars2Icon className="h-6 w-6" />
          </IconButton>
          <div className="flex items-center gap-2">
            <img src={logo} alt="logo" className="h-24 w-18" />
            <Typography
              as="a"
              href="/"
              className="mr-4 ml-2 cursor-pointer py-1.5 text-darkblueMasferrer 
            font-masferrerTitle font-normal max-w-40
            Mobile-390*844:hidden
            Mobile-280:hidden
            text-left"
            >
              Centro Escolar Católico "Alberto Masferrer"
            </Typography>
          </div>
          <ProfileMenu name={name} role={role} />
        </div>
      </Navbar>
      <div ref={navRef} className={`fixed top-16 left-2 ${isNavOpen ? 'block' : 'hidden'} bg-white shadow-lg rounded-lg p-4`}>
        <NavList role={role} closeNav={closeNav} />
      </div>
    </>
  );
}
