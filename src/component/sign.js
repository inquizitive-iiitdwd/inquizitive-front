// import { useState } from 'react';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';
// import { useNavigate } from "react-router-dom";

// const Sign = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [name, setName] = useState('');

//   const navigate = useNavigate();

//   const navigateToLogin = (e) => {
//     e.preventDefault();
//     navigate("/Clientlogin");
//   };

//   const handleSignIn = async () => {
//     if (!email || !password || !confirmPassword || !phoneNumber || !name) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     const data = { email, password, phone_number: phoneNumber, name };
//     console.log("Signing in with data:", data);

//     try {
//       await axios.post("https://quiz-t7o5.onrender.com/users/signin", { data }, { withCredentials: true });
//       toast.success("Signed in successfully!");
//       navigate("/Clientlogin");
//     } catch (error) {
//       console.error("Error signing in:", error);
//       toast.error("Failed to sign in. Please try again.");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if ( e.key === "Enter") {
//       handleSignIn();
//     }
//   };

//   return (
//     <div className='bg-gradient-to-r from-[#2e1a47] to-[#624a82] flex items-center justify-center h-screen text-white'>
    
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
//         <h3 className="text-2xl font-bold mb-6 text-center">Client Page</h3>
//         <h4 className='text-lg mb-4 text-center'>Enter Your Details</h4>

//         <div className='flex flex-col space-y-4'>
//           <input
//             type='email'
//             className='w-full px-4 py-2 rounded-lg text-black font-bold'
//             placeholder='Enter your Email id'
//             value={email}
//             onKeyUp={handleKeyPress}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type='text'
//             className='w-full px-4 py-2 rounded-lg text-black font-bold'
//             placeholder='Enter your name'
//             value={name}
//             onKeyUp={handleKeyPress}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <input
//             type='password'
//             className='w-full px-4 py-2 rounded-lg text-black font-bold'
//             placeholder='Password'
//             value={password}
//             onKeyUp={handleKeyPress}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <input
//             type='password'
//             className='w-full px-4 py-2 rounded-lg text-black font-bold'
//             placeholder='Confirm Password'
//             value={confirmPassword}
//             onKeyUp={handleKeyPress}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//           <input
//             type='text'
//             className='w-full px-4 py-2 rounded-lg text-black font-bold'
//             placeholder='Enter your Phone Number'
//             value={phoneNumber}
//             onKeyUp={handleKeyPress}
//             onChange={(e) => setPhoneNumber(e.target.value)}
//           />
//           <button
//             className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-600"
//             id='Join'
//             onClick={handleSignIn}
//           >
//             Join
//           </button>

//           <span className='text-center'>
//             Already have an account? Click &nbsp;
//             <a href='#' className='text-green-400 font-bold' onClick={navigateToLogin}>Login</a>
//           </span>
//           <Toaster />
//         </div>
//       </div>
//       <footer className="fixed bottom-0 w-full text-center mt-4">
//         Created with <a href="https://github.com/maheshkatyayan" className="text-green-400 font-bold">codecraftmen</a>
//       </footer>
//     </div>
//   );
// };

// export default Sign;
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Nav from './Nav.js'


const Sign = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password || !confirmPassword || !phoneNumber || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = { email, password, phone_number: phoneNumber, name };
    console.log("Signing in with data:", data);

    try {
     const response= await axios.post("http://localhost:5000/users/signin", { data }, { withCredentials: true });
      toast.success(response.error)
      setVerificationSent(true); // Set this to true to indicate that the verification email has been sent
    } catch (error) {
      console.error("Error signing in:", error);
      toast.error("either you have enter wrong code or email already exits.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignIn();
    }
  };

  return (
    <><Nav />
    <div className='bg-gradient-to-r from-[#2e1a47] to-[#624a82] flex items-center justify-center h-screen text-white'>
    
      <div className="bg-[#2e1a47] p-8 rounded-lg shadow-2xl -mt-15">
        <h3 className="text-4xl font-bold mb-6 text-center">SignUp</h3>

        {verificationSent ? (
          <p className="text-center text-green-400">We have sent you a verification email. Please check your inbox.</p>
        ) : (
          <div className='flex flex-col space-y-4'>
            <input
              type='email'
              className='w-full px-4 py-2 rounded-lg text-black font-bold'
              placeholder='Enter your Email id'
              value={email}
              onKeyUp={handleKeyPress}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type='text'
              className='w-full px-4 py-2 rounded-lg text-black font-bold'
              placeholder='Enter your name'
              value={name}
              onKeyUp={handleKeyPress}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type='password'
              className='w-full px-4 py-2 rounded-lg text-black font-bold'
              placeholder='Password'
              value={password}
              onKeyUp={handleKeyPress}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type='password'
              className='w-full px-4 py-2 rounded-lg text-black font-bold'
              placeholder='Confirm Password'
              value={confirmPassword}
              onKeyUp={handleKeyPress}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              type='text'
              className='w-full px-4 py-2 rounded-lg text-black font-bold'
              placeholder='Enter your Phone Number'
              value={phoneNumber}
              onKeyUp={handleKeyPress}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-600"
              id='Join'
              onClick={handleSignIn}
            >
              Join
            </button>
            
          </div>
        )}

        {/* <footer className="fixed bottom-0 w-full text-center mt-4">
          Created with <a href="https://github.com/maheshkatyayan" className="text-green-400 font-bold">codecraftmen</a>
        </footer> */}
        

      </div>
      <Toaster />
      <footer className="fixed bottom-0 w-full text-center mt-4">
    Created with <a href="https://github.com/maheshkatyayan" className="text-green-400 font-bold">codecraftmen</a>
    </footer>
    </div>
    </>
  );
};

export default Sign;

