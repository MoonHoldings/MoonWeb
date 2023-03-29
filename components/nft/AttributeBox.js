import React from 'react'

const Attribute = ({ attribute }) => {
  return (
    <div className="rounded-[1rem] border-2 border-[#191C20] bg-[#191C20] p-[1rem] font-inter text-white 2xl:min-w-[190px]">
      <div className="upper">{attribute.trait_type}</div>
      <div className="cap mt-[0.5rem] text-[1.5rem] font-bold ">
        {attribute.value}
      </div>
      {/* <div className="rounded-[0.5rem] bg-[#114239] p-[0.5rem]">
        {attribute.percentage} Have this
      </div> */}
    </div>
  )
}

export default Attribute
