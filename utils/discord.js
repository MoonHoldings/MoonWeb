import Router from 'next/router'

export const openDiscordWindow = (discordUrl) => {
  const windowFeatures =
    'height=800,width=800,resizable=yes,scrollbars=yes,status=yes'

  const discordWindow = window.open(discordUrl, '_blank', windowFeatures)

  const intervalId = setInterval(() => {
    if (discordWindow.closed) {
      clearInterval(intervalId)
      Router.push('/')
    }
  }, 1000)
}
