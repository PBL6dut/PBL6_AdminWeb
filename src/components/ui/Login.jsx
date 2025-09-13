import { useContext, useEffect, useState } from "react";
import { Button, IconButton } from "./Button";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import AuthContext from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // const [errors, setErrors] = useState(null);

  // const validateForm = (email, password) => {
  //   const errors = {};
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //   if (!email) {
  //     errors.email = "Email is required";
  //   } else if (!emailRegex.test(email)) {
  //     errors.email = "Invalid email format";
  //   }

  //   if (!password) errors.password = "Password is required";
  //   // if (password && password.length < 6) errors.password = "Password must be at least 6 characters";

  //   setErrors(errors);
  //   return errors;
  // };

  const onSubmit = async (data) => {
    await login(data.email, data.password);
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
            action="#"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <label
                for="email"
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
                required
              />
              {errors && errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                for="password"
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
                  // required
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
              className="w-full hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign in
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
