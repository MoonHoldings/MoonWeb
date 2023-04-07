import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import {
  nextPage,
  previousPage,
  changePage,
} from 'redux/reducers/sharkifyLendSlice'
import mergeClasses from 'utils/mergeClasses'

const Pagination = ({ totalItems }) => {
  const dispatch = useDispatch()
  const { pageIndex, pageSize } = useSelector((state) => state.sharkifyLend)
  const { orderBooks } = useSelector((state) => state.sharkify)

  const lastPage = Math.ceil(totalItems / pageSize)
  const currentPage = Math.floor(pageIndex / pageSize) + 1

  return (
    <div className="flex items-center">
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
        disabled={pageIndex === 0}
      >
        First Page
      </button>
      <button
        type="button"
        className={mergeClasses(
          'flex',
          'h-14',
          'w-14',
          'mr-4',
          'items-center',
          'justify-center',
          'rounded-sm',
          'border',
          'border-[#434343]',
          pageIndex === 0 ? 'bg-[#262626]' : 'bg-[#141414]'
        )}
        onClick={() => dispatch(previousPage())}
        disabled={pageIndex === 0}
      >
        <Image
          className="rotate-180 transform"
          src={
            pageIndex === 0
              ? '/images/svgs/page-arrow-disabled.svg'
              : '/images/svgs/page-arrow.svg'
          }
          alt=""
          width="8"
          height="8"
        />
      </button>
      <span className="text-[1.4rem]">
        {currentPage} / {lastPage}
      </span>
      {/* <button
        type="button"
        className={mergeClasses(
          'flex',
          'h-14',
          'w-14',
          'ml-4',
          'items-center',
          'justify-center',
          'rounded-sm',
          'border',
          'border-[#434343]',
          'text-[1.3rem]',
          'font-bold'
        )}
        onClick={() => dispatch(changePage(currentPage))}
      >
        {currentPage}
      </button>
      {lastPage > 1 && currentPage !== lastPage && (
        <button
          type="button"
          className={mergeClasses(
            'flex',
            'h-14',
            'w-14',
            'ml-4',
            'items-center',
            'justify-center',
            'rounded-sm',
            'border',
            'border-[#434343]',
            'text-[1.3rem]',
            'font-bold'
          )}
          onClick={() => dispatch(changePage(currentPage + 1))}
        >
          {currentPage + 1}
        </button>
      )}
      {lastPage > 2 && currentPage !== lastPage && (
        <button
          type="button"
          className={mergeClasses(
            'flex',
            'h-14',
            'w-14',
            'ml-4',
            'items-center',
            'justify-center',
            'rounded-sm',
            'border',
            'border-[#434343]',
            'text-[1.3rem]',
            'font-bold'
          )}
          onClick={() => dispatch(previousPage())}
        >
          {lastPage}
        </button>
      )} */}
      <button
        type="button"
        className={mergeClasses(
          'flex',
          'h-14',
          'w-14',
          'mx-4',
          'items-center',
          'justify-center',
          'rounded-sm',
          'border',
          'border-[#434343]',
          lastPage === currentPage ? 'bg-[#262626]' : 'bg-[#141414]'
        )}
        onClick={() => dispatch(nextPage({ length: orderBooks.length }))}
        disabled={lastPage === currentPage}
      >
        <Image
          src={
            lastPage === currentPage
              ? '/images/svgs/page-arrow-disabled.svg'
              : '/images/svgs/page-arrow.svg'
          }
          alt=""
          width="8"
          height="8"
        />
      </button>
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
        onClick={() => dispatch(changePage(lastPage))}
        disabled={currentPage === lastPage}
      >
        Last Page
      </button>
    </div>
  )
}

export default Pagination
