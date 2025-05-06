
import { Eye, Sparkle } from 'lucide-react'
import React from 'react'
import { Link, Navigate } from 'react-router';
import { AUTH_TOKEN } from '../../../constant';
import useRegister from '../../../hooks/useRegister';
import Loader from '../../../components/Loader';


const Register = () => {
  const formik = useRegister();
  const token = localStorage.getItem(AUTH_TOKEN);

  if (token) return <Navigate to="/"/>

  else return (
    <>
      <div className="authLayout h-full overflow-hidden">
        <div className="grid grid-cols-12 h-full overflow-hidden justify-center">
          <div className="col-span-12 sm:col-span-10 md:col-span-8 lg:col-span-6 xl:col-span-4 xxl:col-span-4 h-full overflow-y-auto lg:overflow-hidden">
            <div className="h-full authPage flex flex-col lg:justify-center items-center text-center p-5 sm:py-10 sm:px-16">
              <Sparkle strokeWidth={2} className='starIcon text-2xl'/>
              <div className="wlcmTxt mt-5 text-3xl font-semibold">Create Account</div>
              <div className="detailTxt mb-4 text-sm font-medium text-slate-500">Please enter your details</div>
              <form className='w-full' onSubmit={formik?.handleSubmit}>
                <div className="customInput">
                  <input 
                      type="text" 
                      name='userName'
                      id='userName'
                      placeholder='User Name'
                      value={formik?.values?.userName || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-control ${formik.touched.userName && formik.errors.userName ? 'inputError' : ''}`}
                    />
                    {formik.touched.userName && formik.errors.userName && (
                      <div className="errorText">{formik.errors.userName}</div>
                    )}
                </div>
                <div className="customInput">
                  <input 
                      type="text" 
                      name='email'
                      id='email'
                      placeholder='Email'
                      value={formik?.values?.email || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-control ${formik.touched.email && formik.errors.email ? 'inputError' : ''}`}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="errorText">{formik.errors.email}</div>
                    )}
                </div>
                  <div className="customInput">
                    <div className="relative">
                    <input 
                      type="text" 
                      name='password'
                      id='password'
                      placeholder='Password'
                      value={formik?.values?.password || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`form-control ${formik.touched.password && formik.errors.password ? 'inputError' : ''}`}
                    />
                      <div className="eyeIcon">
                        <Eye size={16} />
                      </div>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="errorText">{formik.errors.password}</div>
                    )}
                  </div>
                <div className="d-flex align-items-center justify-content-between">
                  {/* <Form.Check // prettier-ignore
                    type={'checkbox'}
                    id={`rememberMe`}
                    label={`Remember Me`}
                    className='customCheckbox'
                  /> */}
                </div>
                <button disabled={formik.isSubmitting} type='submit' className='commonBtn w-full mt-3 disabled:opacity-70'>
                  {
                    formik.isSubmitting ? <Loader isWhite={true}/> : 'Sign up'
                  }
                  
                </button>
              </form>
              <div className="detailTxt mt-3 text-sm font-medium text-slate-500">
                  Already have an account?
                <Link className='ps-2 text-[#2B04A6]' to='/login'>Sign in</Link>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-8 xxl:col-span-8 hidden lg:block">
            <img
              src={'./assets/img/login5.webp'}
              alt="banner"
              width={1200}
              height={900}
              className="w-full h-full object-cover authBanner object-top"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Register