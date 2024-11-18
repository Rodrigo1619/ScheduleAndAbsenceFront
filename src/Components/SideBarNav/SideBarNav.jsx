import {
   Card
} from "@material-tailwind/react";
import { FaHome, FaTable, FaUsers, FaClipboardList, FaChalkboardTeacher, FaSearch } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { SiGoogleclassroom } from "react-icons/si";
import { IoLogOutSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/userContext";

export default function SideBarNav({ role }) {

   const navigate = useNavigate();
   const { logout, user } = useUserContext();

   const homeHandler = () => {
      switch (user.role.name) {
         case "Administrador":
            navigate('/AdminPage');
            break;
         case "Moderador":
            navigate('/ModeratorPage');
            break;
         case "Coordinador":
            navigate('/CoordinatorHomepage');
            break;
         case "Profesor":
            navigate('/HomePage');
            break;
         default:
            navigate('/');
      }
   };

   const logOutHandler = () => {
      logout(); 
      
      navigate('/');
      
   };

   return (
      user?.role.name === "Administrador" ?
         <Card className="flex w-16 mr-16 justify-start my-12 max-h-screen h-full
       shadow-lg shadow-blueMasferrer rounded-t-full bg-darkblueMasferrer
       PC-1280*720:w-16 PC-1280*720:ml-4
         PC-800*600:w-16 PC-800*600:ml-4
            PC-640*480:w-16 PC-640*480:ml-4
       IpadAir:hidden
       Mobile-390*844:w-16 Mobile-390*844:mr-0 Mobile-390*844:ml-2 Mobile-390*844:hidden
         Mobile-280:ml-2 Mobile-280:mr-0 Mobile-280:hidden relative">
            <div className="flex flex-col items-center h-full mx-auto w-auto mt-8">
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl" onClick={homeHandler} title="Incio">
                     <FaHome className="w-7 h-7 text-white hover:text-gray-300" />
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl" onClick={() => {navigate("/DBDashboard")}} title="Base de Datos">
                     <FaTable className="w-7 h-7 text-white hover:text-gray-300" title="Dashboard Base de Datos"/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <FaUsers className="w-7 h-7 text-white hover:text-gray-300" title="Registro de Asistencia"/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <FaClipboardList className="w-7 h-7 text-white hover:text-gray-300" title="Registrar Inasistencia"/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <FaChalkboardTeacher className="w-7 h-7 text-white hover:text-gray-300" title=""/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <PiStudentFill className="w-7 h-7 text-white hover:text-gray-300" title=""/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <SiGoogleclassroom className="w-7 h-7 text-white hover:text-gray-300" title=""/>
                  </button>
               </div>
               <div className="flex-grow"></div>
               <div className="flex flex-col justify-end items-center mx-auto mb-8">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl" onClick={logOutHandler} title="Cerrar Sesión">
                     <IoLogOutSharp className="w-7 h-7 text-white hover:text-gray-300" />
                  </button>
               </div>
            </div>
         </Card>
         :
         <Card className="flex w-16 mr-20 justify-start my-12 max-h-screen h-auto
            shadow-lg shadow-blueMasferrer rounded-t-full bg-darkblueMasferrer
            PC-1280*720:w-16 PC-1280*720:ml-4
            PC-800*600:w-16 PC-800*600:ml-4
            PC-640*480:w-16 PC-640*480:ml-4
            IpadAir:hidden
            Mobile-390*844:w-16 Mobile-390*844:mr-0 Mobile-390*844:ml-2 Mobile-390*844:hidden
            Mobile-280:ml-2 Mobile-280:mr-0 Mobile-280:hidden
         ">
            <div className="flex flex-col items-center h-full mx-auto w-auto mt-8">
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl" onClick={homeHandler} title="Inicio">
                     <FaHome className="w-7 h-7 text-white hover:text-gray-300" title="Inicio"/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <FaClipboardList className="w-7 h-7 text-white hover:text-gray-300" title="Registrar Inasistencia"/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl" onClick={() => {navigate("/TeacherSearch")}}>
                     <FaSearch className="w-7 h-7 text-white hover:text-gray-300" title="Buscar Profesor"/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <FaUsers className="w-7 h-7 text-white hover:text-gray-300" title="Registro de Asistencia"/>
                  </button>
               </div>
               <div className="flex flex-col justify-center items-center mx-auto my-4">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl">
                     <SiGoogleclassroom className="w-7 h-7 text-white hover:text-gray-300" title=""/>
                  </button>
               </div>
               <div className="flex-grow"></div>
               <div className="flex flex-col justify-end items-center mx-auto mb-8">
                  <button className="w-auto h-auto justify-center items-center hover:shadow-2xl" onClick={logOutHandler} title="Cerrar Sesión">
                     <IoLogOutSharp className="w-7 h-7 text-white hover:text-gray-300" />
                  </button>
               </div>
            </div>
         </Card>

   );
}