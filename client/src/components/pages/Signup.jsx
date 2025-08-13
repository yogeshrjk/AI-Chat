import { useState, useEffect } from "react";
import { showAlert } from "../../utils/showAlert";
import { gql, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, BotMessageSquare } from "lucide-react";

const SIGNUP_MUTATION = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
    $dob: String!
    $email: String!
    $gender: String!
    $password: String!
    $profilePic: String
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
      dob: $dob
      email: $email
      gender: $gender
      password: $password
      profilePic: $profilePic
    ) {
      _id
      token
      email
      firstName
    }
  }
`;

export function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dob: "",
    email: "",
    gender: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [signup, { loading }] = useMutation(SIGNUP_MUTATION);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // gives base64DataUri
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return;

    let profilePicBase64 = null;
    if (selectedFile) {
      profilePicBase64 = await toBase64(selectedFile);
    }

    try {
      await signup({
        variables: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          dob: formData.dob,
          email: formData.email,
          gender: formData.gender,
          password: formData.password,
          profilePic: profilePicBase64, // send base64 string
        },
      });

      showAlert("User SignedUp successfully!", "success");
    } catch (err) {
      showAlert(`${err}`, "error");
      console.error("Signup error:", err.message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white/80 dark:bg-[rgb(35,35,35)]">
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => {
            const newMode = !darkMode;
            setDarkMode(newMode);
            const theme = newMode ? "dark" : "light";
            localStorage.setItem("theme", theme);
            if (theme === "dark") {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }}
          className="text-xl text-[rgb(35,35,35)] dark:text-white"
          title="Toggle Dark Mode"
        >
          {!darkMode ? (
            <Sun fill="currentColor" />
          ) : (
            <Moon fill="currentColor" />
          )}
        </button>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm bg-opacity-50 flex flex-col items-center justify-center z-50">
          <BotMessageSquare className="w-25 h-25 text-black mb-4" />
          <div className="w-48 h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-black progress-bar"
              style={{
                animation: `grow 5s linear forwards`,
              }}
            ></div>
          </div>
          <style>
            {`
        @keyframes grow {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}
          </style>
        </div>
      )}

      <div className="flex rounded-2xl shadow-lg max-w-3xl px-4 items-center bg-white dark:bg-[#111]">
        <div className="md:block hidden w-1/2">
          <img
            src={darkMode ? "./AI.png" : "AI-Chat.png"}
            className="rounded-2xl w-sm"
            alt="Login Background"
          />
        </div>
        <div className="flex sm:py-5 rounded-2xl items-center w-full sm:w-auto h-screen sm:h-auto">
          <div className="w-full px-8">
            <form className="flex flex-col gap-4 mt-8" onSubmit={handleSubmit}>
              {/* First Name & Last Name */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                    First Name
                  </label>
                  <input
                    className="p-2 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                    type="text"
                    placeholder="e.g. John"
                    required
                    name="firstName"
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                    Last Name
                  </label>
                  <input
                    className="p-2 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                    type="text"
                    placeholder="e.g. Doe"
                    required
                    name="lastName"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Phone Number & Date of Birth */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                    Phone Number
                  </label>
                  <input
                    className="p-2 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                    type="tel"
                    placeholder="+91 9876543210"
                    required
                    name="phoneNumber"
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                    Date of Birth
                  </label>
                  <input
                    className="p-2 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                    type="date"
                    required
                    name="dob"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email & Gender (Email is wider than Gender) */}
              <div className="flex gap-4">
                <div className="w-2/3">
                  <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                    Email
                  </label>
                  <input
                    className="p-2 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                    type="email"
                    placeholder="example@email.com"
                    required
                    name="email"
                    onChange={handleChange}
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                    Gender
                  </label>
                  <select
                    className="p-2 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                    required
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                  Password
                </label>
                <input
                  className="p-2 pr-10 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter strong password"
                  required
                  name="password"
                  onChange={handleChange}
                />
                {/* Toggle Password Visibility */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`bi ${
                    showPassword ? "bi-eye-slash" : "bi-eye"
                  } absolute top-8 right-3 cursor-pointer`}
                  width="16"
                  height="16"
                  fill="grey"
                  viewBox="0 0 16 16"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <>
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </>
                  ) : (
                    <>
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                    </>
                  )}
                </svg>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                  Confirm Password
                </label>
                <input
                  className="p-2 pr-10 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  required
                  name="confirmPassword"
                  onChange={handleChange}
                />
                {/* Toggle Confirm Password Visibility */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`bi ${
                    showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                  } absolute top-8 right-3 cursor-pointer`}
                  width="16"
                  height="16"
                  fill="grey"
                  viewBox="0 0 16 16"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <>
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </>
                  ) : (
                    <>
                      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                      <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                    </>
                  )}
                </svg>
              </div>

              {/* Profile Picture Upload */}
              <div>
                <label className="block text-sm font-semibold text-[rgb(35,35,35)] dark:text-white">
                  Profile Picture
                </label>
                <input
                  className="p-2 mt-2 rounded-sm text-sm border w-full text-gray-700 dark:text-gray-100"
                  type="file"
                  name="profilePic"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              {/* Sign Up Button */}
              <button
                className="py-2 mb-4 rounded-sm font-bold text-sm text-white bg-[rgb(35,35,35)] hover:scale-105 duration-300 w-full"
                type="submit"
              >
                Sign Up
              </button>
            </form>
            {/* Login button */}
            <div className="mt-3 text-xs flex justify-between items-center text-[rgb(35,35,35)] dark:text-white">
              <p className="text-sm">Already have an account?</p>
              <Link
                to="/"
                className="py-2 px-6 bg-[rgb(35,35,35)] text-white text-xs text-center rounded-md hover:scale-110 "
              >
                <button>Login</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
