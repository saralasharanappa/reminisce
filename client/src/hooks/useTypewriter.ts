import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed: number = 150) {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, speed)

    return () => clearInterval(typingInterval)
  }, [text, speed])

  return displayedText
}

