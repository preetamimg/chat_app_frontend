import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <>
      <div className="authLayout h-full overflow-hidden">
        <div className="grid h-full overflow-hidden justify-center">
          <div className="col-span-12 sm:col-span-10 md:col-span-8 lg:col-span-6 xl:col-span-5 xxl:col-span-4 h-full overflow-y-auto lg:overflow-hidden">
            {children}
          </div>
          <div className="col-lg-6 col-xl-7 col-xxl-8 d-none d-lg-block">
            <Image
              src={'/img/login5.webp'}
              alt="banner"
              width={1200}
              height={900}
              className="size-full object-fit-cover object authBanner"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthLayout