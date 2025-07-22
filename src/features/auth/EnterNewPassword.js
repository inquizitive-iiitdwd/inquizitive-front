import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

function Enternewpassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [Token,setToken]=useState('')
    const navigate = useNavigate();

    const handleSetpassword = async () => {
    
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
    
        const data = { password };
        console.log("Signing in with data:", data);
    
        try {
       const respond= await axios.post("https://quiz-t7o5.onrender.com/users/reset_password", { data }, { withCredentials: true });
       console.log(respond)
          toast.success("Signed in successfully!");
          navigate("/client-login");
        } catch (error) {
          console.error("Error signing in:", error);
          toast.error("Failed to sign in. Please try again.");
        }
      };
    
  return (
    <div>
    <input
    type="token"
    className="w-full px-4 py-2 rounded-lg text-black font-bold"
    placeholder="token"
    value={Token}
    onChange={(e) => setToken(e.target.value)}
  />
    <input
    type="password"
    className="w-full px-4 py-2 rounded-lg text-black font-bold"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
   <input
            type='password'
            className='w-full px-4 py-2 rounded-lg text-black font-bold'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Toaster/>
           <button
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-600"
            id='Join'
            onClick={handleSetpassword}
          >
            set
          </button>
      
    </div>
  )
}

export default Enternewpassword
