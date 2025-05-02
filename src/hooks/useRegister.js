
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { postAPI } from '../service/apiInstance';
import { API_ENDPOINT } from '../constant/apiConstants';
import { AUTH_TOKEN } from '../constant';
import { registerValidationSchema } from '../validationSchema/registerValidationSchema';
import useProfile from './useProfile';

const useRegister = () => {
  const {setToken} = useProfile()

  const initialValues = {
    userName: "",
    email : "",
    password: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await postAPI(API_ENDPOINT.AUTH.REGISTER, values);
      if(response?.data?.success) {
        localStorage.setItem(AUTH_TOKEN, response?.data?.token);
        setToken(response?.data?.token)
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
    validationSchema: registerValidationSchema,
    onSubmit,
  });

  return formik;
}

export default useRegister