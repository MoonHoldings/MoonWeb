import { useState } from 'react'
import mergeClasses from 'utils/mergeClasses'

export const SearchInput = (props) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  return (
    <div class="relative mb-[1rem] flex h-[6.4rem] bg-gray-900">
      <label class="absolute inset-y-0 left-0 mr-4 flex items-center pl-4 focus-within:text-teal-200">
        <svg
          className={mergeClasses(
            'h-10',
            'w-10',
            isFocused ? 'text-teal-200' : 'text-white'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.873-4.873M14.382 9.764a5.5 5.5 0 11-7.778 0 5.5 5.5 0 017.778 0z"
          />
        </svg>
      </label>
      <input
        class="text-14px block h-full w-full appearance-none rounded-xl border border-black bg-gray-900 pl-16 pt-2 text-teal-200 placeholder-white focus:placeholder-teal-200 focus:outline-none focus:ring-1 focus:ring-teal-200 "
        type="text"
        placeholder="Search Coins"
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <div class="absolute left-0 top-full z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-b-xl bg-gray-900 shadow-lg">
        <ul class="py-2">
          {props.listData.map((item) => (
            <li
              key={item.id}
              class="cursor-pointer px-4 py-3 text-teal-200 hover:bg-gray-800"
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
