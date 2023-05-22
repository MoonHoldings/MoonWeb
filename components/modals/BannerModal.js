import React from 'react'

const BannerModal = (props) => {
  const shouldShowButton =
    typeof props.message === 'string' && props.message.includes('verify')
  return (
    <div
      className={`fixed left-0 top-0 z-50 w-full transform  px-4 py-2 text-black transition-all duration-300 ${
        props.showModal
          ? 'transition-y-100 opacity-100'
          : 'transition-y-0 pointer-events-none opacity-0'
      } ${
        props.hasError
          ? 'bg-gradient-to-b from-red-600 to-red-500'
          : 'bg-gradient-to-b from-teal-400 to-teal-300'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <h2 className="text-[2rem] opacity-70">
          {props.message}
          {shouldShowButton && (
            <>
              <a> Click </a>
              <a
                onClick={props.resendEmail}
                className="underline hover:cursor-pointer"
              >
                here
              </a>
              <a> to resend the verification email</a>
            </>
          )}
        </h2>
        <button onClick={props.closeModal} className="text-[3rem] text-black">
          &times;
        </button>
      </div>
    </div>
  )
}

export default BannerModal
