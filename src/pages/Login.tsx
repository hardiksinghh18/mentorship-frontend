import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setLoggedIn, setLoggedOut } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import InputWrapper from "../components/common/InputWrapper";

interface AuthState {
  auth: {
    isLoggedIn: boolean;
    user: any;
  }
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state: AuthState) => state.auth);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/login`,
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      if (response.data.loggedIn) {
        toast.success(response.data.message);
        (dispatch as any)(setLoggedIn());
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        (dispatch as any)(setLoggedOut());
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data.message || "Something went wrong. Please try again.");
      toast.error(error.response?.data.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    navigate("/");
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Background Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none animate-glow" />

      <div className="max-w-[480px] w-full relative z-10 transition-all duration-500">
        <div className="bg-white/5 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] border border-white/10 text-white shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <img 
              src={require('../assets/skillsyncIcon.png')} 
              alt="SkillSync Logo" 
              className="h-12 w-auto mb-6"
            />
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-muted font-medium text-center">
              Sign in to continue your journey with <br /> SkillSync
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputWrapper
              label="Email Address"
              name="email"
              type="email"
              icon={FaEnvelope}
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <InputWrapper label="Password" icon={FaLock}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all placeholder:text-muted/30 text-sm"
                placeholder="Enter your security phrase"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-muted hover:text-white transition-colors"
              >
                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              </button>
            </InputWrapper>


            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 overflow-hidden rounded-full bg-white text-black font-bold tracking-tight hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="text-lg">›</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-muted text-sm font-medium">
              New to the platform?{" "}
              <Link to="/register" className="text-white hover:underline font-bold transition-all ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

