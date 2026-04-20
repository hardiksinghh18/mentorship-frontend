import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoggedIn, setLoggedOut } from '../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import InputWrapper from '../components/common/InputWrapper';

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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoggedIn } = useSelector((state: AuthState) => state.auth);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateUsername = (username: string) => {
        return username.trim().length > 0 && !/\s/.test(username);
    };

    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        const newErrors = { ...errors };
        switch (name) {
            case 'email':
                if (!validateEmail(value)) newErrors.email = 'Enter a valid email address';
                else delete newErrors.email;
                break;
            case 'username':
                if (!validateUsername(value)) newErrors.username = 'No spaces allowed';
                else delete newErrors.username;
                break;
            case 'password':
                if (!validatePassword(value)) newErrors.password = 'Needs uppercase, number & symbol';
                else delete newErrors.password;
                break;
            case 'confirmPassword':
                if (value !== formData.password) newErrors.confirmPassword = 'Passwords mismatch';
                else delete newErrors.confirmPassword;
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
        if (!validateUsername(formData.username)) newErrors.username = 'Invalid username';
        if (!validatePassword(formData.password)) newErrors.password = 'Weak password';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatch';

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

    if (isLoggedIn) {
        navigate("/");
        return null;
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden py-12 px-4 pt-20">
            {/* Background Spotlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none animate-glow" />

            <div className="max-w-[480px] w-full relative z-10 transition-all duration-500">
                <div className="bg-white/5 backdrop-blur-3xl p-10 md:p-12 rounded-[2.5rem] border border-white/10 text-white shadow-2xl">
                    <div className="text-center mb-10">
                        <img 
                            src={require('../assets/skillsyncIcon.png')} 
                            alt="SkillSync Logo" 
                            className="h-12 w-auto mb-6 mx-auto"
                        />
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
                        <p className="text-muted text-sm font-medium">Join the next generation of SkillSync</p>
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
                                className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10 focus:border-white/30 focus:bg-white/[0.08]'} text-white transition-all placeholder:text-muted/30 text-sm outline-none`}
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-muted hover:text-white transition-colors"
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
                                className={`w-full pl-11 pr-11 py-3 rounded-xl bg-white/5 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10 focus:border-white/30 focus:bg-white/[0.08]'} text-white transition-all placeholder:text-muted/30 text-sm outline-none`}
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 text-muted hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                            </button>
                        </InputWrapper>


                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 mt-4 rounded-full bg-white text-black font-bold tracking-tight hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Get Started</span>
                                    <span className="text-lg">›</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 text-center">
                        <p className="text-muted text-sm font-medium tracking-tight">
                            Already a user?{" "}
                            <Link to="/login" className="text-white hover:underline font-bold transition-all ml-1">
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
