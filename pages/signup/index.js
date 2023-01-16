import React from 'react'

const index = () => {
  return (
    <div className="flex flex-col items-center pt-[4.6rem]">
      <h1 className="mt-[4rem] mb-[2rem] text-[3rem] font-bold text-teal-500">
        Sign Up
      </h1>
      <div className="mb-[1rem] bg-gray-800 p-2">
        <input
          className="mb-[1rem] block text-[1.6rem]"
          type="email"
          placeholder="Enter Email"
        />
        <input
          className="block text-[1.6rem]"
          type="password"
          placeholder="Enter Password"
        />
        <button className="m-2 bg-teal-600 p-2 text-[1.6rem]">Submit</button>
      </div>
      <button className="m-2 block bg-indigo-600 p-2 text-[1.6rem]">
        Discord
      </button>
      <button className="m-2 block bg-blue-600 p-2 text-[1.6rem]">
        Twitter
      </button>
    </div>
  )
}

export default index
