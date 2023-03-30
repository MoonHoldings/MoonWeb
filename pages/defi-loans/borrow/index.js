import Header from 'components/defi-loans/Header'
import SidebarsLayout from 'components/partials/SidebarsLayout'
import Search from 'components/defi-loans/Search'
import React from 'react'

const Lend = () => {
  return (
    <SidebarsLayout>
      <div className="mt-[2rem] md:order-2">
        <Header
          title="Borrow"
          description="Instantly take a loan against your NFTs. Escrow-free loans allows you to keep the collateral NFT in your wallet. When you accept a loan offer, a secure contract is created, freezing the NFT in-wallet. Not repaying by the due date means the lender can repossess your NFT. Successfully pay the loan in full by the expiration date to automatically thaw the NFT."
        />
        <Search />
      </div>
    </SidebarsLayout>
  )
}

export default Lend
