import { v4 } from 'uuid';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Nav from '../../component/NavBar.js';
//import backgroundvideo from '../image/video1.mp4';

const ClientLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const createNewSignIn = (e) => {
    navigate('/sign');
  };
  const forgotpassword = (e) => {
    navigate('/Resetpassword');
  };
  

  const LogIn = async (e) => {
    if (!email || !password) {
      toast.error("Please enter both email and password");
    } else if (email && password) {
      try {
        const data = { email: email, password: password };
        console.log(data);
        const response = await axios.post("http://localhost:5000/users/login", { data }, { withCredentials: true });
        console.log(response.data);
        if (response.data) {
          toast.success("Signed in successfully!");
          navigate('/', {
            state: {
              password
            },
          });
        } else {
          setEmail('');
          setPassword('');
          toast.error("Failed to login");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        toast.error("Failed to log in. Please try again.");
      }
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      LogIn();
    }
  };

  return (
    <div className='bg-gradient-to-r from-[#2e1a47] to-[#624a82]'>
      <Nav/>
      <div className=" flex items-center justify-center h-screen text-white" >
        <div className="bg-[#2e1a47] p-8 rounded-lg shadow-2xl w-96 max-w-full z-10 -mt-20">
          <h3 className="text-3xl font-bold mb-9 text-center">Login</h3>

          <div className="flex flex-col space-y-4">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg text-black font-bold"
              placeholder="Enter the Email ID"
              value={email}
              onKeyUp={handleKey}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg text-black font-bold"
              placeholder="Password"
              value={password}
              onKeyUp={handleKey}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-600"
              id="Join"
              onClick={LogIn}
            >
              Login
            </button>

            <span className="text-center">
              If you don't have an ID, click &nbsp;
              <Toaster />
              <a href="#" className="text-green-400 font-bold" onClick={createNewSignIn}>sign up</a>
            </span>
            <span className="text-center">
             &nbsp;
              <a href="#" className="text-green-400 font-bold" onClick={forgotpassword}>Forgot_password</a>
            </span>
          </div>
        </div>
        <footer className="fixed bottom-0 w-full text-center mt-4 z-10">
          Created with <a href="https://github.com/maheshkatyayan" className="text-green-400 font-bold">codecraftmen</a>
        </footer>
      </div>
    </div>
  );
};

export default ClientLoginPage;