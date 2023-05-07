import Image from 'next/image'

const HistoryRow = ({ history }) => {
  return (
    <tr className="cursor-pointer bg-transparent text-[1.5rem] font-medium hover:bg-[#013C40]">
      <td className="px-6 py-6">
        <div className="flex items-center">
          <div className="flex h-[4rem] w-[4rem] items-center justify-center rounded-full bg-white">
            {history.collectionImage && (
              <Image
                className="h-full w-full rounded-full"
                src={history.collectionImage}
                unoptimized
                style={{ objectFit: 'cover' }}
                width={0}
                height={0}
                alt=""
              />
            )}
          </div>
          <div>
            <div className="ml-8">{history.collectionName}</div>
            <div className="ml-8">{history.collateralName}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-6">
        <div className="flex items-center">
          <p>{history.amountOffered}</p>{' '}
          <Image
            className="ml-3 h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={20}
            height={20}
            alt=""
          />
        </div>
      </td>
      <td className="px-6 py-6">
        <div className="flex items-center">
          <p>{history.offerInterest.toFixed(4)}</p>{' '}
          <Image
            className="ml-3 h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={20}
            height={20}
            alt=""
          />
        </div>
      </td>
      <td className="px-6 py-6 text-[#11AF22]">{history.apy}%</td>
      <td className="px-6 py-6">{history.status}</td>
    </tr>
  )
}

export default HistoryRow
