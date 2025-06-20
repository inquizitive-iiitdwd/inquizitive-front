import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [sendingmailverification, setsending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(true);
  const [showEnterNewPassword, setShowEnterNewPassword] = useState(false); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const verify = async () => {
    if (!email) {
      toast.error("Please enter your email");
    } else {
      try {
        setsending(true);
        const data = { email };
        const response = await axios.post("https://quiz-t7o5.onrender.com/users/forgot_password", { data }, { withCredentials: true });
        console.log("response", response.data.result);
        if (response.data.result === 'TRUE') {
          toast.success("Verification email sent successfully!");
          setSuccessMessage(`We have sent you a token to your ${email}, please enter the token.`);
          setCanResend(true);
          setIsEditingEmail(false); 
          setShowEnterNewPassword(true); 
        } else {
          setEmail('');
          toast.error("Failed to verify. Please enter the correct email.");
        }
      } catch (error) {
        console.error("Error verifying:", error);
        toast.error("Failed to verify. Please try again.");
      } finally {
        setsending(false);
      }
    }
  };

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = { token, password };
    console.log("Setting new password with data:", data);

    try {
      const response = await axios.post("https://quiz-t7o5.onrender.com/users/reset_password", { data }, { withCredentials: true,headers:token });
      console.log('response2',response);
      if (response.data.result === 'TRUE'){
      toast.success("Password reset successfully!");
      navigate("/clientlogin");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <>
      <video autoPlay muted loop className="fixed top-0 left-0 w-full h-full object-cover z-0">
        <source src="https://firebasestorage.googleapis.com/v0/b/quizmaster-b0faf.appspot.com/o/video%2F5453622-uhd_3840_2160_24fps.mp4?alt=media&token=c71e9ee2-8b59-4e79-bf9c-050c88a49032" type="video/mp4" />
      </video>

      <div className="bg-gradient-to-r from-[#2e1a47] to-[#624a82] flex items-center justify-center h-screen text-white z-10 relative">
        <div className="bg-transparent p-8 rounded-lg shadow-lg w-96 max-w-full">
          {showEnterNewPassword ? (
            <>
              <h3 className="text-2xl font-bold mb-6 text-center">Enter New Password</h3>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg text-black font-bold mb-4"
                placeholder="Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg text-black font-bold mb-4"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg text-black font-bold mb-4"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-bold transition duration-300 ease-in-out hover:bg-green-600"
                onClick={handleSetPassword}
              >
                Set Password
              </button>

              {canResend && (
                <button
                  className={`w-full px-4 py-2 mt-4 text-white rounded-lg font-bold transition duration-300 ease-in-out ${sendingmailverification ? 'bg-gray-500' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                  onClick={verify}
                  disabled={sendingmailverification}
                >
                  {sendingmailverification ? 'Resending...' : 'Resend Email'}
                </button>
              )}

              {successMessage && <p className="mt-4 text-center text-green-400 font-bold">{successMessage}</p>}
            </>
          ) : (
            <>
              <h3 className="text-2xl font-bold mb-6 text-center">Reset Password</h3>
              <h4 className="text-lg mb-4 text-center">Enter your email id</h4>
              <div className="flex flex-col space-y-4">
                {isEditingEmail ? (
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded-lg text-black font-bold"
                    placeholder="Enter your Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={sendingmailverification}
                  />
                ) : (
                  <button
                    className="w-full px-4 py-2 text-white rounded-lg font-bold bg-blue-500 hover:bg-blue-600 transition duration-300 ease-in-out"
                    onClick={() => setIsEditingEmail(true)}
                  >
                    Edit Email
                  </button>
                )}
                <button
                  className={`w-full px-4 py-2 text-white rounded-lg font-bold transition duration-300 ease-in-out ${sendingmailverification ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
                  onClick={verify}
                  disabled={sendingmailverification}
                >
                  {sendingmailverification ? 'Sending...' : 'Verify'}
                </button>
                {successMessage && <p className="mt-4 text-center text-green-400 font-bold">{successMessage}</p>}
              </div>
            </>
          )}
          <Toaster />
        </div>
        <footer className="fixed bottom-0 w-full text-center mt-4 z-10">
          Created with <a href="https://github.com/maheshkatyayan" className="text-green-400 font-bold">codecraftmen</a>
        </footer>
      </div>
    </>
  );
};

export default ResetPassword;
