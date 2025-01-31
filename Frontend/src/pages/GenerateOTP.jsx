import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";



function GenerateOTP() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseFromServer, setResponseFromServer] = useState(null);
  const [isOTPGenerated, setIsOTPGenerated] = useState(false);
  const [otp, setOTP] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/generateCode`,
        {
          email: email
        }
      )
      console.log(response);
      setResponseFromServer(response.data);
      setIsOTPGenerated(true);
    } catch (e) {
      console.log(e);
      if (e.response && e.response.data && e.response.data.message) {
        setError(e.response.data.message);
      } else {
        setError(e.message);
      }
      setResponseFromServer(e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(JSON.stringify(responseFromServer));

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/verifyCode`,
        {
          otp: otp,
          userId: responseFromServer.userId
        }
      )
      navigate(`/reset-password/${response.data.resetJWT}`)
    } catch (e) {
      console.log(e);
      setResponseFromServer(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      <div className="max-w-md mx-auto w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-10">

        {/* Email Entering screen */}
        <div className={`text-center mb-8 ${isOTPGenerated ? "opacity-0 hidden" : "opacity-100"} transition-all duration-200`}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Forgot Your Password</h1>
          <p className="text-gray-600 mt-2">Enter you're email</p>

          <form
            onSubmit={handleEmailVerification}
            className={`space-y-6 flex flex-col justify-center items-center w-full`}
          >
            <div className="flex flex-col justify-center items-start gap-y-1 pt-6 w-full">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1 ml-2">
                Email
              </label>
              <input
                id="email"
                value={email}
                placeholder="Enter you're email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                type="text"
              />
            </div>
            {error !== "" && <div className="bg-red-200 text-black px-4 py-2 rounded-xl">{error}</div>}
            <button
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer py-2.5 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? "opacity-70 cursor-not-allowed" : "opacity-100"}`}
              type="submit"
              // onClick={() => { alert("trying") }}
              disabled={isLoading ? true : false}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>



        {/* OTP Entering screen */}
        <div className={`text-center mb-8 ${isOTPGenerated ? "opacity-100" : "opacity-0 hidden"} transition-all duration-200`}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Enter OTP</h1>
          <p className="text-gray-600 mt-2">We have sent you a reset one time password on you're mail {email}, kidnly enter it.</p>
          <form
            onSubmit={handleOTPVerification}
            className={`space-y-6 flex flex-col justify-center items-center w-full`}
          >
            <div className="flex flex-col justify-center items-start gap-y-1 pt-6 w-full">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1 ml-2">
                OTP
              </label>
              <input
                id="email"
                value={otp}
                placeholder="Enter you're OTP"
                onChange={(e) => setOTP(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900"
                type="text"
              />
            </div>
            <button
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? "opacity-70 cursor-not-allowed" : "opacity-100"}`}
              type="submit"
              disabled={isLoading ? true : false}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>


      </div>
    </div >
  )
}

export default GenerateOTP
