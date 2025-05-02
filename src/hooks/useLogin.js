
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { postAPI } from '../service/apiInstance';
import { loginValidationSchema } from '../validationSchema/loginValidationSchame';
import { API_ENDPOINT } from '../constant/apiConstants';
import { AUTH_TOKEN } from '../constant';
import useProfile from './useProfile';

const useLogin = () => {
  const {setToken} = useProfile()

  const initialValues = {
    userName: "",
    password: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await postAPI(API_ENDPOINT.AUTH.LOGIN, values);
      if(response?.data?.success) {
        localStorage.setItem(AUTH_TOKEN, response?.data?.data?.token);
        setToken(response?.data?.data?.token)
        toast.success(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize Formik with initial values, validation schema, and submit handler.
  const formik = useFormik({
    initialValues,
    validationSchema: loginValidationSchema,
    onSubmit,
  });

  return formik;
}

export default useLogin