import { useState, useEffect, useRef } from 'react'

const TextBlink = ({ text, className }) => {
  const solPriceRef = useRef(null)
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    if (solPriceRef.current && text !== currentText) {
      solPriceRef.current.classList.add('price-blink')

      setTimeout(() => {
        solPriceRef?.current?.classList?.remove('price-blink')
      }, 500)
    }

    setCurrentText(text)
  }, [text, currentText])

  return (
    <span className={className} ref={solPriceRef}>
      {currentText}
    </span>
  )
}

export default TextBlink
