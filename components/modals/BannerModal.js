import React from 'react'

const BannerModal = (props) => {
  return (
    <div
      className={`fixed left-0 top-0 z-50 w-full transform  px-4 py-2 text-white transition-all duration-300 ${
        props.showModal
          ? 'transition-y-100 opacity-100'
          : 'transition-y-0 opacity-0'
      } ${props.hasError ? 'modal-error-gradient' : 'primary-btn-gradient'}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <h2 className="text-[2.2rem] font-medium">{props.message}</h2>
        <button onClick={props.closeModal} className="text-[3rem] text-white">
          &times;
        </button>
      </div>
    </div>
  )
}

export default BannerModal
