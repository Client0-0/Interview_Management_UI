export const VALIDATION_RULES = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\d{10}$/,
    PASSWORD: /^.{6,}$/, // Min 6 chars
};

export const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    if (!VALIDATION_RULES.EMAIL.test(email)) return "Invalid email format";
    return null;
};

export const validatePhone = (phone: string): string | null => {
    if (!phone) return "Phone number is required";
    if (!VALIDATION_RULES.PHONE.test(phone)) return "Phone number must be 10 digits";
    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (!VALIDATION_RULES.PASSWORD.test(password))
        return "Password must be at least 6 characters";
    return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    return null;
};
