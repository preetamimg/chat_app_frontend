import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({

  userName: Yup.string()
    .required("Username is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters")
    .required("Password is required"),
});
