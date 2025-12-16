import { useContext, useEffect, useState } from "react";
import { Button, IconButton } from "../ui/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import AuthContext from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useForm } from "react-hook-form";
import googleIcon from "../../assets/google-icon.svg";
import facebookIcon from "../../assets/facebook-icon.svg";

export const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext); // Đảm bảo sử dụng isAuthenticated
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
  }, [isAuthenticated]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password);
      if (response.success) {
        console.log("Login successful, navigating to dashboard"); // ✅ Thêm
        navigate("/dashboard"); // Sử dụng navigate để chuyển hướng
      } else {
        alert(response.message || "Login failed");
      }
    } catch (error) {
      console.error("CATCH ERROR in onSubmit:", error); // ✅ Thêm
      alert("An error occurred during login");
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-gray-100 rounded-lg shadow-sm">
          <h1 className="text-xl text-center font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in
          </h1>
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 ${
                  errors &&
                  errors.email &&
                  "border-red-500 focus:ring-red-500 focus:border-red-500"
                } block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="name@company.com"
              />
              {errors && errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 ${
                    errors &&
                    errors.password &&
                    "border-red-500 focus:ring-red-500 focus:border-red-500"
                  } block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                <IconButton
                  icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                  onClick={togglePasswordVisibility}
                  type="button"
                  className="absolute right-2 top-1/5"
                />
              </div>
              {errors && errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Forgot password?
              </a>
            </div>
            <Button
              variant="green"
              type="submit"
              className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign in
            </Button>
            <Button
              variant="light"
              type="button"
              className="w-full hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              <div className="flex items-center justify-center">
                <img src={googleIcon} alt="Google Icon" className="size-5" />
                <span className="mx-2">Sign in with Google</span>
              </div>
            </Button>
            <Button
              variant="light"
              type="button"
              className="w-full hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-bold rounded-lg text-sm px-5 py-2.5 text-center dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              <div className="flex items-center justify-center">
                <img
                  src={facebookIcon}
                  alt="Facebook Icon"
                  className="size-5"
                />
                <span className="mx-2">Sign in with Facebook</span>
              </div>
            </Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
