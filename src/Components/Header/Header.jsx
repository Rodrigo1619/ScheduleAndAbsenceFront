import React from "react";
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
  RocketLaunchIcon,
  Bars2Icon,
  HomeIcon,
  TableCellsIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

import logo from "../../assets/logo.png";
import adminIcon from "../../assets/icons/admin-icon.svg";
import teacherIcon from "../../assets/icons/classroom-icon.svg";
import { FaChalkboardTeacher, FaSearch } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { useNavigate } from "react-router-dom";

import { userService } from "../../Services/userService";
import { useUserContext } from "../../Context/userContext";

// profile menu component
const profileMenuItems = [
  {
    label: "Sign Out",
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
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false)
    logout();
    console.log("Borrando token...");
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
    icon: HomeIcon
  },
  {
    label: "Tablas de bases de datos",
    icon: TableCellsIcon,
  },
  {
    label: "Revisar asistencia",
    icon: UsersIcon,
  },
  {
    label: "Reportar inasistencia",
    icon: ClipboardDocumentListIcon,
  },
  {
    label: "Profesores",
    icon: FaChalkboardTeacher,
  },
  {
    label: "Estudiantes",
    icon: PiStudentFill,
  },
  {
    label: "Salón de clases",
    icon: SiGoogleclassroom,
  },
];

const navListItemsTeacher = [
  {
    label: "Inicio",
    icon: HomeIcon,
  },
  {
    label: "Horario de clases",
    icon: SiGoogleclassroom,
  },
  {
    label: "Reportar inasistencias",
    icon: ClipboardDocumentListIcon,
  },
  {
    label: "Revisar listado de asistencias",
    icon: UsersIcon,
  },
  {
    label: "Búsqueda de maestro",
    icon: FaSearch,
  },
];

function NavList({ role }) {
  return (
    role === "Administrador" ?
      <ul className="mt-2 mb-4 hidden flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center PC-1920*1080:hidden 
    PC-1600*900:hidden PC-1366*768:hidden PC-1280*720:hidden IpadAir:flex Mobile-390*844:flex Mobile-280:flex">
        {navListItemsAdmin.map(({ label, icon }, key) => (
          <Typography
            key={label}
            as="a"
            href="#"
            variant="small"
            color="gray"
            className="font-medium text-blue-gray-500"
          >
            <MenuItem className="flex items-center gap-2 lg:rounded-full">
              {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
              <span className="text-gray-900"> {label}</span>
            </MenuItem>
          </Typography>
        ))}
      </ul>
      :
      <ul className="mt-2 mb-4 hidden flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center PC-1920*1080:hidden
    PC-1600*900:hidden PC-1366*768:hidden PC-1280*720:hidden IpadAir:flex Mobile-390*844:flex Mobile-280:flex">
        {navListItemsTeacher.map(({ label, icon }, key) => (
          <Typography
            key={label}
            as="a"
            href="#"
            variant="small"
            color="gray"
            className="font-medium text-blue-gray-500"
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

export default function Header({ name, role }) {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl p-2 lg:rounded-full lg:pl-6 bg-transparent shadow-none">
      <div className="relative mx-auto flex items-center justify-between text-blue-gray-900">

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
        <div className="hidden lg:block">
          <NavList role={role} />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        <ProfileMenu name={name} role={role} />
      </div>
      <Collapse open={isNavOpen} className="overflow-scroll">
        <NavList role={role} />
      </Collapse>
    </Navbar>
  );
}