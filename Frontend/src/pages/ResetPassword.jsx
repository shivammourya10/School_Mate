import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

function ResetPassword() {

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [isJWTValid, setIsJWTValid] = useState(false);
  const [isIntialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();

  const { resetJWT } = useParams();


  useEffect(() => {
    if (confirmPassword === "") {
      setError("");
    } else if (confirmPassword !== newPassword) {
      setError("Both passwords don't match");
    } else {
      setError("");
    }
  }, [newPassword, confirmPassword])

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Both passwords don't match");
    } else {
      setError("");
      try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/admin-password/${resetJWT}`,
          {
            newPassword: newPassword
          }
        )
        setError("");
        setSuccess("Password successfully updated, redirecting in few moments");
        setTimeout(() => {
          navigate("/admin-signin");
        }, 2000);

      } catch (e) {
        console.log(e);
        setError(e.message);
      }
    }
  }

  useEffect(() => {
    const verifyJWT = async () => {

      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/verify/${resetJWT}`);
        setIsJWTValid(true);
      } catch (e) {
        console.log(e);
        setIsJWTValid(false);
        setTimeout(() => {
          navigate("/admin-signin");
        }, 2000)
      } finally {
        setInitialLoading(false);
      }
    }
    verifyJWT();
  }, [])

  if (isIntialLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <svg height={250} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="none" stroke-opacity="1" stroke="#000000" stroke-width=".5" cx="100" cy="100" r="0"><animate attributeName="r" calcMode="spline" dur="2" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate><animate attributeName="stroke-width" calcMode="spline" dur="2" values="0;25" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate><animate attributeName="stroke-opacity" calcMode="spline" dur="2" values="1;0" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate></circle></svg>
      </div>
    )
  }

  if (!isJWTValid) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <p className="bg-red-200 text-black px-4 py-2 rounded-xl">Trying to reset password? Try again. Redirecting in few moments</p>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 sm:p-6 md:p-8 flex flex-col justify-between">
      <div className="max-w-md mx-auto w-full bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-10">

        <div className={`text-center mb-8`}>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Reset password</h1>

          <form
            onSubmit={handlePasswordUpdate}
            className={`space-y-6 flex flex-col justify-center items-center w-full gap-y-6`}
          >
            <div className="flex flex-col justify-center items-start pt-6 w-full gap-y-4">
              <div className="flex flex-col justify-center items-start pt-6 w-full gap-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value.trimEnd())}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 pr-12"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  disabled={isLoading ? true : false}
                />
              </div>
              <div className="flex flex-col justify-center items-start pt-6 w-full gap-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative w-full">
                  <input
                    id="confirmNewPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.trimEnd())}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 pr-12"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter you're new password"
                    disabled={isLoading ? true : false}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading ? true : false}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error !== "" && <div className="text-black bg-red-200 px-4 py-2 rounded-lg">{error}</div>}
              {success !== "" && <div className="text-black bg-green-200 px-4 py-2 rounded-lg">{success}</div>}
              <button
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isLoading ? "opacity-70 cursor-not-allowed" : "opacity-100"}`}
                type="submit"
                disabled={isLoading ? true : false}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
