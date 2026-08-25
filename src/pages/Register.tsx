import axios from 'axios';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoggedIn, setLoggedOut } from '../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import InputWrapper from '../components/common/InputWrapper';
import { GoogleLogin } from "@react-oauth/google";
import { validateRegisterForm } from '../utils/authValidation';

interface AuthState {
    auth: {
        isLoggedIn: boolean;
        user: any;
    }
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 480);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const googleBtnWidth = windowWidth < 480 
        ? `${Math.max(200, Math.min(384, windowWidth - 90))}px` 
        : "384px";

    const { isLoggedIn } = useSelector((state: AuthState) => state.auth);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors = validateRegisterForm(formData);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Registration requirements not met');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/register`, {
                email: formData.email,
                username: formData.username,
                password: formData.password,
            }, { withCredentials: true });

            if (response.data.loggedIn) {
                toast.success("Welcome aboard!");
                (dispatch as any)(setLoggedIn());
                setTimeout(() => navigate('/'), 500);
            } else {
                (dispatch as any)(setLoggedOut());
            }
        } catch (error: any) {
            toast.error(error.response?.data.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsGoogleLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/google-login`,
                { token: credentialResponse.credential },
                { withCredentials: true }
            );

            if (response.data.loggedIn) {
                toast.success(response.data.message);
                (dispatch as any)(setLoggedIn());
                setTimeout(() => {
                    navigate("/");
                }, 500);
            }
        } catch (error: any) {
            toast.error(error.response?.data.error || "Google login failed");
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        toast.error("Google authentication failed");
    };

    if (isLoggedIn) {
        navigate("/");
        return null;
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-12 px-4 pt-20">
            {/* Background Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none animate-glow" />

            <div className="max-w-[480px] w-full relative z-10 transition-all duration-500">
                <div className="bg-zinc-50 backdrop-blur-3xl p-10 md:p-12 rounded-[2.5rem] border border-zinc-200 text-zinc-900 shadow-2xl">
                    <div className="text-center mb-10">
                        <img 
                            src={require('../assets/synckroIcon.png')} 
                            alt="SyncKro Logo" 
                            className="h-10 w-auto mb-4 mx-auto filter invert"
                        />
                        <h1 className="text-xl font-bold tracking-tight mb-2 text-zinc-900">Create Account</h1>
                        <p className="text-zinc-500 text-sm font-medium">Join the next generation of SyncKro</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputWrapper
                                label="Username"
                                name="username"
                                type="text"
                                icon={FaUser}
                                placeholder="johndoe"
                                error={errors.username}
                                value={formData.username}
                                onChange={handleChange}
                            />
                            <InputWrapper
                                label="Email"
                                name="email"
                                type="email"
                                icon={FaEnvelope}
                                placeholder="john@sync.com"
                                error={errors.email}
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <InputWrapper label="Password" error={errors.password} icon={FaLock}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`w-full pl-11 pr-11 py-3 rounded-xl bg-zinc-100 border ${errors.password ? 'border-red-500/50' : 'border-zinc-300 focus:border-zinc-500 focus:bg-zinc-200/50'} text-zinc-900 transition-all placeholder:text-zinc-400 text-sm outline-none`}
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-zinc-500 hover:text-black transition-colors"
                            >
                                {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                            </button>
                        </InputWrapper>

                        <InputWrapper label="Confirm Password" error={errors.confirmPassword} icon={FaLock}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className={`w-full pl-11 pr-11 py-3 rounded-xl bg-zinc-100 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-zinc-300 focus:border-zinc-500 focus:bg-zinc-200/50'} text-zinc-900 transition-all placeholder:text-zinc-400 text-sm outline-none`}
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 text-zinc-500 hover:text-black transition-colors"
                            >
                                {showConfirmPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                            </button>
                        </InputWrapper>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 mt-4 rounded-full bg-zinc-900 text-white font-bold tracking-tight hover:bg-zinc-800 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Get Started</span>
                                    <span className="text-lg">›</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-4">
                        <div className="h-px flex-1 bg-zinc-200"></div>
                        <span className="text-xs font-semibold text-zinc-400">Or continue with</span>
                        <div className="h-px flex-1 bg-zinc-200"></div>
                    </div>

                    <div className="flex justify-center h-[44px] items-center">
                        {isGoogleLoading ? (
                            <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-500 animate-pulse">
                                <div className="w-4 h-4 border-2 border-zinc-500/20 border-t-zinc-500 rounded-full animate-spin"></div>
                                <span className="text-sm font-medium">Verifying Google Account...</span>
                            </div>
                        ) : (
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                shape="pill"
                                size="large"
                                width={googleBtnWidth}
                            />
                        )}
                    </div>

                    <div className="mt-10 pt-8 border-t border-zinc-200 text-center">
                        <p className="text-zinc-500 text-sm font-medium tracking-tight">
                            Already a user?{" "}
                            <Link to="/login" className="text-zinc-900 hover:underline font-bold transition-all ml-1">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
