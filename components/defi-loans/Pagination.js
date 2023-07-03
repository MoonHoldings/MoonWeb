import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { changePage } from 'redux/reducers/sharkifyLendSlice'
import mergeClasses from 'utils/mergeClasses'

const Pagination = ({
  disabled = false,
  pageIndex,
  pageSize,
  totalItems,
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
}) => {
  const dispatch = useDispatch()

  const lastPage = Math.ceil(totalItems / pageSize)
  const currentPage = Math.floor(pageIndex / pageSize) + 1

  return (
    <div className="flex items-center">
      {pageSize && (
        <button
          type="button"
          className={mergeClasses(
            'flex',
            'h-14',
            'px-5',
            'mr-4',
            'items-center',
            'justify-center',
            'rounded-sm',
            'border',
            'border-[#434343]',
            'text-xl',
            pageIndex === 0 ? 'bg-[#262626]' : 'bg-[#141414]'
          )}
          onClick={() => dispatch(changePage(1))}
          disabled={pageIndex === 0 || disabled}
        >
          First Page
        </button>
      )}
      <button
        type="button"
        className={mergeClasses(
          'flex',
          'h-14',
          'w-14',
          pageSize ? 'mr-4' : 'mr-2',
          'items-center',
          'justify-center',
          'rounded-sm',
          'border',
          'border-[#434343]',
          previousDisabled ? 'bg-[#262626]' : 'bg-[#141414]'
        )}
        onClick={onPrevious}
        disabled={previousDisabled || disabled}
      >
        <Image
          className="rotate-180 transform"
          src={
            previousDisabled
              ? '/images/svgs/page-arrow-disabled.svg'
              : '/images/svgs/page-arrow.svg'
          }
          alt=""
          width="8"
          height="8"
        />
      </button>
      {pageSize && (
        <span className="text-[1.4rem]">
          {currentPage} / {lastPage}
        </span>
      )}
      <button
        type="button"
        className={mergeClasses(
          'flex',
          'h-14',
          'w-14',
          pageSize ? 'mx-4' : 'mx-2',
          'items-center',
          'justify-center',
          'rounded-sm',
          'border',
          'border-[#434343]',
          lastPage === currentPage || nextDisabled
            ? 'bg-[#262626]'
            : 'bg-[#141414]'
        )}
        onClick={onNext}
        disabled={lastPage === currentPage || nextDisabled || disabled}
      >
        <Image
          src={
            lastPage === currentPage || nextDisabled
              ? '/images/svgs/page-arrow-disabled.svg'
              : '/images/svgs/page-arrow.svg'
          }
          alt=""
          width="8"
          height="8"
        />
      </button>
      {pageSize && (
        <button
          type="button"
          className={mergeClasses(
            'flex',
            'h-14',
            'px-5',
            'items-center',
            'justify-center',
            'rounded-sm',
            'border',
            'border-[#434343]',
            'text-xl',
            lastPage === currentPage ? 'bg-[#262626]' : 'bg-[#141414]'
          )}
          onClick={() => dispatch(changePage(lastPage))}
          disabled={currentPage === lastPage || disabled}
        >
          Last Page
        </button>
      )}
    </div>
  )
}

export default Pagination
