import React from 'react'
import mergeClasses from 'utils/mergeClasses'

const ProgressIndicator = ({ percentValue, className }) => {
  return (
    <div
      className={mergeClasses(
        'h-[0.8rem] w-full rounded-md bg-[#dddddd]',
        className
      )}
    >
      <div
        className={mergeClasses('h-full', 'rounded-md', 'bg-[#62EAD2]')}
        style={{ width: `${percentValue}%` }}
      />
    </div>
  )
}

export default ProgressIndicator
