import React from 'react'

const WelcomePage = () => {
  return (
    <div className="z-90 relative h-screen bg-black px-[2rem] pt-[8rem]">
      <img
        className="absolute bottom-0 left-0 w-screen"
        src="/images/svgs/ufo-graphic.svg"
        alt=""
      />
      <h1 className="mb-[4rem] max-w-[26rem] text-[2rem] font-bold">
        Skyrocketing portfolio decision-making
      </h1>
      <div className="text-paste-gradient mb-[4rem] flex flex-col font-[] font-bold leading-tight">
        <div>Track.</div>
        <div>Compare.</div>
        <div>Compete.</div>
      </div>
      <p className="text-[1.6rem]">
        MoonHolding's purpose is to make investing engaging, not just for
        current investors but for newcomers alike. We believe in utilizing
        atomic habits to make portfolio management obvious, attractive, and
        rewarding.
      </p>
    </div>
  )
}

export default WelcomePage
