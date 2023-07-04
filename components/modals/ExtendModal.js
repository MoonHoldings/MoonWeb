import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { changeExtendModalOpen } from 'redux/reducers/utilSlice'
import Image from 'next/image'
import { createSharkyClient } from '@sharkyfi/client'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import mergeClasses from 'utils/mergeClasses'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import createAnchorProvider from 'utils/createAnchorProvider'
import { Tooltip, notification } from 'antd'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_BEST_OFFER_FOR_BORROW, MY_LOANS } from 'utils/queries'
import Link from 'next/link'
import calculateBorrowInterest from 'utils/calculateBorrowInterest'
import { BORROW_LOAN } from 'utils/mutations'
import axios from 'axios'
import { AXIOS_CONFIG_SHYFT_KEY, SHYFT_URL } from 'application/constants/api'

const ExtendModal = () => {
  const dispatch = useDispatch()

  const wallet = useWallet()

  const { extendModalOpen } = useSelector((state) => state.util)
  const { orderBook, extendLoan } = useSelector((state) => state.sharkifyLend)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [failMessage, setFailMessage] = useState(null)
  const [txLink, setTxLink] = useState(null)
  const [nftCollateral, setNftCollateral] = useState(null)

  const [getBestOffer, { data, loading, stopPolling, startPolling }] =
    useLazyQuery(GET_BEST_OFFER_FOR_BORROW, {
      fetchPolicy: 'no-cache',
    })
  const [getMyLoans, { data: myLoans, loading: loadingMyLoans }] =
    useLazyQuery(MY_LOANS)
  const bestOffer = data?.getLoans?.data[0]
  const bestOfferSolNum = bestOffer
    ? bestOffer.principalLamports / LAMPORTS_PER_SOL
    : 0
  const bestOfferSol = toCurrencyFormat(
    bestOffer ? bestOffer.principalLamports / LAMPORTS_PER_SOL : 0
  )
  const duration = bestOffer?.duration
  let interest = calculateBorrowInterest(
    bestOfferSolNum,
    duration,
    orderBook?.apy
  )
  interest = interest < 0.01 ? interest.toFixed(3) : interest.toFixed(2)
  const [borrowLoan] = useMutation(BORROW_LOAN)

  const floorPriceSol = orderBook?.floorPriceSol
    ? orderBook?.floorPriceSol
    : null

  useEffect(() => {
    if (wallet.publicKey && !loadingMyLoans) {
      getMyLoans({
        variables: {
          args: {
            filter: {
              borrowerWallet: wallet.publicKey.toBase58(),
              type: 'taken',
            },
          },
        },
      })
    }
  }, [wallet.publicKey, loadingMyLoans, getMyLoans])

  useEffect(() => {
    if (extendLoan && !loading && extendModalOpen) {
      getBestOffer({
        variables: {
          args: {
            pagination: {
              limit: 1,
              offset: 0,
            },
            filter: {
              type: 'offered',
              orderBookId: extendLoan?.orderBook?.id,
            },
            sort: {
              order: 'DESC',
              type: 'amount',
            },
          },
        },
        pollInterval: 1000,
      })
    }

    if (!extendModalOpen) {
      stopPolling()
    } else {
      startPolling()
    }
  }, [
    extendLoan,
    getBestOffer,
    loading,
    extendModalOpen,
    stopPolling,
    startPolling,
  ])

  useEffect(() => {
    if (extendLoan && !nftCollateral) {
      fetchNftCollateral(extendLoan)
    }
  }, [extendLoan, nftCollateral])

  const fetchNftCollateral = async (loan) => {
    const { data } = await axios.get(
      `${SHYFT_URL}/nft/read?network=mainnet-beta&token_address=${loan?.nftCollateralMint}`,
      AXIOS_CONFIG_SHYFT_KEY
    )

    setNftCollateral(data?.result)
  }

  const onClose = () => {
    dispatch(changeExtendModalOpen(false))
    setFailMessage(null)
    setIsSuccess(false)
    setTxLink(null)
  }

  const renderCloseButton = () => {
    return (
      <div className="absolute right-10 top-10">
        <button onClick={onClose}>
          <Image
            className="h-[2.2rem] w-[2.2rem]"
            src="/images/svgs/cross-btn.svg"
            alt="cross button"
            width={20}
            height={20}
          />
        </button>
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <motion.div
        key={isSuccess}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex w-full justify-center"
      >
        {isSuccess ? (
          <h1 className="text-[2.1rem] font-bold">SUCCESS!</h1>
        ) : (
          <div className="flex w-full items-center justify-between">
            <h1 className="text-[18px]">You are extending:</h1>
            <h1 className="text-[2.1rem] font-bold">{nftCollateral?.name}</h1>
          </div>
        )}
      </motion.div>
    )
  }

  const renderOrderBookInfo = () => {
    return (
      <>
        <div className="mt-8 flex w-full justify-between text-xl">
          <p>Interest</p>
          <p>Duration</p>
          <p>Floor</p>
        </div>
        <div className="mt-4 flex w-full justify-between text-3xl">
          <p className="flex flex-1 justify-start text-[#11AF22]">{interest}</p>
          <p className="flex flex-1 justify-center">{orderBook?.duration}d</p>
          <div className="flex flex-1 items-center justify-end">
            {floorPriceSol && (
              <Image
                className="mr-2 h-[2rem] w-[2rem]"
                src="/images/svgs/sol.svg"
                width={16}
                height={16}
                alt=""
              />
            )}
            <p>{floorPriceSol ? toCurrencyFormat(floorPriceSol) : 'No Data'}</p>
          </div>
        </div>
      </>
    )
  }

  const ownedNftsCount = orderBook?.ownedNfts?.filter(
    (ownedNft) =>
      myLoans?.getLoans?.data?.find(
        (myLoan) => myLoan.nftCollateralMint === ownedNft.mint
      ) === undefined
  ).length

  const renderTotal = () => {
    return (
      <div className="mt-4 flex justify-between">
        <p className="text-2xl">Total</p>
        <div className="flex items-center">
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={16}
            height={16}
            alt=""
          />
          <p className="ml-2 text-2xl">{bestOfferSol}</p>
        </div>
      </div>
    )
  }

  const renderBorrowButton = () => {
    const disabled = isSubmitting

    return (
      <Tooltip
        color="#1F2126"
        title={
          <span className="text-[1.35rem]">Select an NFT as collateral</span>
        }
        trigger={disabled ? 'hover' : null}
      >
        <div>
          <button
            type="button"
            onClick={null}
            disabled={disabled}
            className="flex items-center justify-center rounded rounded-xl bg-[#6B3A00] px-[2rem] py-[1.5rem] text-[1.25rem] font-bold text-white"
          >
            <span>Extend by 7d</span>
            {isSubmitting && (
              <svg
                aria-hidden="true"
                className="ml-2 mr-2 h-7 w-7 animate-spin fill-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
          </button>
        </div>
      </Tooltip>
    )
  }

  console.log(extendLoan)

  const waitTransactionConfirmation = async (tx, loan) => {
    const provider = createAnchorProvider(wallet)

    const confirmedTransaction = await provider.connection.confirmTransaction(
      { signature: tx },
      'confirmed'
    )

    if (confirmedTransaction.value.err) {
      setFailMessage(`Transaction failed: ${confirmedTransaction.value.err}`)
    } else {
      try {
        await borrowLoan({ variables: { borrowedLoan: loan } })
      } catch (error) {
        console.log(error)
      }

      setIsSuccess(true)
      setTxLink(`https://solana.fm/tx/${tx}?cluster=mainnet-qn1`)

      notification.open({
        closeIcon: (
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close"
            width="0.9em"
            height="0.9em"
            fill="#ffffff"
            aria-hidden="true"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        ),
        type: 'success',
        className: 'bg-[#191C20] text-white',
        description: `Done! You've taken out a ${bestOfferSol} SOL loan, in a few seconds
            this will reflect in your history`,
        duration: 5,
        placement: 'top',
        message: <p className="text-white">Success</p>,
      })
    }
  }

  //   const borrow = async () => {
  //     setIsSubmitting(true)
  //     setFailMessage(null)
  //     setIsSuccess(false)

  //     const provider = createAnchorProvider(wallet)
  //     const sharkyClient = createSharkyClient(provider)
  //     const { program } = sharkyClient

  //     // Fetch best loan
  //     const {
  //       data: {
  //         getLoans: { data },
  //       },
  //     } = await getBestOffer({
  //       variables: {
  //         args: {
  //           pagination: {
  //             limit: 1,
  //             offset: 0,
  //           },
  //           filter: {
  //             type: 'offered',
  //             orderBookId: orderBook?.id,
  //           },
  //           sort: {
  //             order: 'DESC',
  //             type: 'amount',
  //           },
  //         },
  //       },
  //       pollInterval: 0,
  //     })

  //     if (data && data.length) {
  //       const bestOffer = data[0]
  //       const offeredOrTaken = await sharkyClient.fetchLoan({
  //         program,
  //         loanPubKey: new PublicKey(bestOffer.pubKey),
  //       })

  //       if (!offeredOrTaken) {
  //         setFailMessage(`No loan found with pubkey ${bestOffer.pubKey}`)
  //       }
  //       if (!offeredOrTaken.offered) {
  //         setFailMessage('Loan is already taken.')
  //       }

  //       const loan = offeredOrTaken.offered
  //       const metadata =
  //         await sharkyClient.program.provider.connection.getParsedAccountInfo(
  //           new PublicKey(selectedNft?.mint),
  //           'confirmed'
  //         )
  //       const { freezeAuthority } = metadata?.value?.data?.parsed?.info
  //       const isFreezable = Boolean(freezeAuthority)

  //       try {
  //         const { takenLoan, sig } = await loan.take({
  //           program,
  //           nftMintPubKey: new PublicKey(selectedNft?.mint),
  //           nftListIndex: selectedNft?.nftListIndex,
  //           skipFreezingCollateral: !isFreezable,
  //         })
  //         const loanToBorrow = {
  //           pubKey: takenLoan.pubKey.toBase58(),
  //           nftCollateralMint:
  //             takenLoan.data.loanState.taken?.taken.nftCollateralMint.toBase58(),
  //           lenderNoteMint:
  //             takenLoan.data.loanState.taken?.taken.lenderNoteMint.toBase58(),
  //           borrowerNoteMint:
  //             takenLoan.data.loanState.taken?.taken.borrowerNoteMint.toBase58(),
  //           apy: takenLoan.data.loanState.taken?.taken.apy.fixed?.apy,
  //           start:
  //             takenLoan.data.loanState.taken?.taken.terms.time?.start?.toNumber(),
  //           totalOwedLamports:
  //             takenLoan.data.loanState.taken?.taken.terms.time?.totalOwedLamports?.toNumber(),
  //         }

  //         // Check if the transaction was successful
  //         await waitTransactionConfirmation(sig, loanToBorrow)
  //       } catch (e) {
  //         if (e.sig) {
  //           setFailMessage(`Error taking loan (sig: ${e.sig})`)
  //         }
  //       }
  //     }

  //     setIsSubmitting(false)
  //   }

  return (
    extendModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex h-full items-center justify-center font-inter md:h-auto"
      >
        <Overlay onClose={onClose} />
        <div className="relative flex w-full flex-col items-center justify-center md:block md:w-auto">
          {orderBook?.collectionImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute left-1/2 z-[99] mr-3 hidden h-[8rem] w-[8rem] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white md:flex"
            >
              <Image
                className={mergeClasses(
                  'h-full',
                  'w-full',
                  'rounded-full',
                  'border'
                )}
                src={orderBook?.collectionImage}
                width={0}
                height={0}
                alt=""
                unoptimized
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          )}
          <div
            className={`modal duration-400 relative flex h-screen flex-col justify-center rounded-[1.25rem] transition-colors ease-in-out md:h-auto md:overflow-y-auto ${
              isSuccess ? 'bg-[#022628]' : 'bg-[#191C20]'
            } w-full overflow-y-scroll px-[2rem] pb-[3rem] pt-[5.8rem] text-white shadow-lg md:w-[450px]`}
          >
            {renderCloseButton()}
            {renderTitle()}
            <div className="my-6 border border-white opacity-10" />

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] font-bold text-[#666666]">
                  Current
                </p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem] font-bold text-white">New Loan</p>
              </div>
            </div>

            <div className="mt-3 flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">Principal</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">Principal</p>
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">0.3</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">0.21</p>
              </div>
            </div>

            <div className="mt-3 flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">Interest</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">Interest</p>
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">0.3</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">0.21</p>
              </div>
            </div>

            <div className="mt-3 flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">Remaining Time</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">New Duration</p>
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">1d 1h 27m</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">7d</p>
              </div>
            </div>

            <div className="my-8 border border-white opacity-10" />

            <div className="mt-4 flex w-full justify-center">
              {renderBorrowButton()}
            </div>
            <div className="mt-6 flex w-full justify-center text-[1.35rem]">
              Amount owned after extending: 0.215
            </div>
            {txLink && (
              <div className="flex w-full justify-center">
                <Link
                  href={txLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-[1.4rem] underline"
                >
                  View your last transaction on Solana FM
                </Link>
              </div>
            )}
            {failMessage && (
              <div className="mt-4 flex w-full justify-center break-all text-center text-[1.6rem] text-red-500">
                {failMessage}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )
  )
}

const Overlay = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="absolute bottom-0 left-0 right-0 top-0 bg-[#00000099]"
    />
  )
}

export default ExtendModal
