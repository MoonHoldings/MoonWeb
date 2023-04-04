import React from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { search } from 'redux/reducers/sharkifyLendSlice'

const Search = () => {
  const dispatch = useDispatch()

  return (
    <div className="relative sticky top-20 mt-6 flex items-center rounded-xl bg-[#0C0D0F] p-7 md:top-0">
      <span className="absolute inset-y-0 left-0 flex items-center pl-12">
        <Image src="/images/svgs/search.svg" alt="" width="15" height="15" />
      </span>
      <input
        className="block w-full appearance-none rounded-xl border border-[#1D2026] bg-transparent py-5 pl-16 pr-3 text-[1.5rem] leading-tight placeholder-[#333333] focus:border-[#1D2026] focus:outline-none"
        type="text"
        placeholder="Search"
        onChange={(e) => dispatch(search(e.target.value))}
      />
    </div>
  )
}

export default Search
