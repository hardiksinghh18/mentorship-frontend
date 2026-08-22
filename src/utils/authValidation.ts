import { EMAIL_REGEX, PASSWORD_REGEX } from './validationRegex';

export interface RegisterFormData {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
}

export const validateRegisterForm = (formData: RegisterFormData) => {
    const errors: { [key: string]: string } = {};

    // Email validation
    if (!formData.email) {
        errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
        errors.email = 'Invalid email format';
    }

    // Username validation
    if (!formData.username) {
        errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
        errors.password = 'Password is required';
    } else if (!PASSWORD_REGEX.test(formData.password)) {
        errors.password = 'Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char';
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
};
