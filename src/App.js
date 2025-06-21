import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import ClientLoginPage from "./features/auth/ClientLoginPage.js"; 
import Questiondemo from "./component/Questiondemo.js";
import Adminlogin from "./features/auth/AdminLoginPage.js";
import Home from "./pages/Home.js";
import Timer from "./features/quiz/components/Timer.js";
import Showqestion from "./features/quiz/ShowQuestions.js";
import RegisterPage from "./pages/RegisterPage.js"
import Buzzer from "./pages/BuzzerRoom.js"
import Adminebuzzer from "./component/adminebuzzer.js";
import Notlogin from "./component/notlogin.js";
import CreateQuiz from "./features/quiz/CreateQuiz.js"
import AdminDashboard from './pages/AdminDashboard.js'
import AboutUs from "./pages/AboutUs.js";
import EventRegistration from "./pages/Events.js"
import VerifyEmail from './features/auth/VerifyMail.js'
import Resetpassword from './features/auth/ResetPassword.js'
import Enternewpassword from "./features/auth/EnterNewPassword.js";
import Event from './pages/Events.js'
import ShowMarks from "./features/quiz/ShowMarks.js";

function App() {
  
  return (
    <div className="App">
      
      <BrowserRouter>
        <Routes>
        <Route 
         path="/" element={<Home/>}
        ></Route>
        {/* <Route 
         path="/home" element={<Home/>}
        ></Route> */}
        
          <Route  path="/Questiondemo" element={<Questiondemo/>}>
          </Route>
          <Route  path="/Event" element={<Event/>}>
          </Route>
          <Route  path="/Resetpassword" element={<Resetpassword/>}>
          </Route>
          <Route  path="/enternewpassword" element={<Enternewpassword/>}>
          </Route>
          
          <Route  path="/Adminlogin" element={<Adminlogin/>}>
          </Route>
          <Route  path="/EventRegistration" element={<EventRegistration/>}>
          </Route>
          <Route  path="/clientlogin" element={<ClientLoginPage/>}>
          </Route>
          <Route  path="/timer" element={<Timer/>}>
          </Route>
          <Route  path="/registerpage" element={<RegisterPage/>}>
          </Route>
          <Route  path="/showquestion" element={<Showqestion/>}>
          </Route>
          <Route  path="/buzzer" element={<Buzzer/>}>
          </Route>
          <Route  path="/adminebuzzer" element={<Adminebuzzer/>}>
          </Route>
          <Route  path="/aboutus" element={<AboutUs/>}>
          </Route>
          <Route  path="/verifyemail" element={<VerifyEmail/>}>
          </Route>

          <Route  path="/showmarks" element={<ShowMarks/>}>
          </Route>
          
          <Route 
         path="/notlogin" element={<Notlogin/>}
        ></Route>
        <Route 
         path="/CreateQuiz" element={<CreateQuiz/>}
        ></Route>
        <Route 
         path="/AdminDashboard" element={<AdminDashboard/>}
        ></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
//:roomid dynamic generated
export default App;
