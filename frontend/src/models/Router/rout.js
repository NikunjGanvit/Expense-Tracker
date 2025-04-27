import About from "../about";
import Dashboard from "../dashboard";
import Login from "../login";
import Register from "../register";
import NavBar from "./NavBar";
import Budget from "../Target";
import Coloboration from "../coloboration";
import History from "../History";
import Profile from "../profile";
import Contact from "../contactus";
import Notification from "../notification";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Routers=()=>{

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element=<NavBar/>>
                    <Route index path="" element=<Dashboard />></Route>
                    <Route path="register" element=<Register />> </Route>
                    <Route path="login" element=<Login/> > </Route>
                    <Route path="about" element=<About/> ></Route>
                    <Route path="budget" element=<Budget/> ></Route>
                    <Route path="history" element=<History/> ></Route>
                    <Route path="colobaration" element=<Coloboration/> ></Route>
                    <Route path="profile" element=<Profile/> ></Route>
                    <Route path="contact" element=<Contact/> ></Route>
                    <Route path="notification" element={<Notification />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Routers;