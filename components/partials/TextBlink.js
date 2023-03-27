import { useState, useEffect, useRef } from 'react'

const TextBlink = ({ text, className }) => {
  const solPriceRef = useRef(null)
  const [currentText, setCurrentText] = useState('')

  useEffect(() => {
    setCurrentText(text)

    if (text !== currentText) {
      if (solPriceRef.current && currentText !== text) {
        solPriceRef.current.classList.add('price-blink')

        setTimeout(() => {
          solPriceRef?.current?.classList?.remove('price-blink')
        }, 1000)
      }
    }
  }, [text, currentText])

  return (
    <span className={className} ref={solPriceRef}>
      {currentText}
    </span>
  )
}

export default TextBlink
