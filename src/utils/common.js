const avgBlockPerMonth = 425940
const avgBlockTime = 6.117

const uaktToAkt = (value) => {
  try {
    return Math.round((value / 1000000 + Number.EPSILON) * 10 ** 3) / 10 ** 3
  } catch (e) {
    throw e
  }
}
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}

const formatDate = (utcDateString) => {
  // Create a new Date object from the UTC string
  const utcDate = new Date(utcDateString)

  // Get the day, month, and year from the UTC date
  const day = utcDate.getUTCDate()
  const month = utcDate.getUTCMonth() + 1 // Months are zero-based, so we add 1
  const year = utcDate.getUTCFullYear()

  // Pad the day and month with leading zeros if needed
  const formattedDay = day < 10 ? `0${day}` : day
  const formattedMonth = month < 10 ? `0${month}` : month

  // Get the hours, minutes, and seconds from the UTC date
  const hours = utcDate.getUTCHours()
  const minutes = utcDate.getUTCMinutes()
  const seconds = utcDate.getUTCSeconds()

  // Pad hours, minutes, and seconds with leading zeros if needed
  const formattedHours = hours < 10 ? `0${hours}` : hours
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds

  // Create the "dd/mm/yyyy hh:mm:ss" formatted date string
  const formattedDateTime = `${formattedMonth}/${formattedDay}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`

  return formattedDateTime
}

const convertUtcToLocal = (utcTime) => {
  const utcDate = new Date(utcTime)

  // Get the user's local time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  // Create options for formatting the date and time
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: userTimeZone,
  }

  // Format the date and time in the user's local time zone
  const localTime = utcDate.toLocaleString(undefined, options).replace(',', '')

  return localTime
}

export { uaktToAkt, formatBytes, formatDate, convertUtcToLocal, avgBlockPerMonth, avgBlockTime }
