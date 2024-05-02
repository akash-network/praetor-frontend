import { avgBlockPerMonth, avgBlockTime } from './common'

const totalDeploymentCost = (leases) => {
  let sum = 0.0
  if (leases.length) {
    leases.forEach((item) => {
      sum += item.price
    })
  }
  return sum * avgBlockPerMonth
}
const totalAmountSpent = (leases, latestBlock) => {
  let amountSpent = 0.0
  if (leases.length) {
    leases.forEach((item) => {
      const blocksPassed =
        item.status === 'active'
          ? Math.abs(latestBlock - Number(item.createdHeight))
          : Math.abs(Number(item.closedHeight) - Number(item.createdHeight))
      amountSpent += blocksPassed * item.price
    })
  }
  return amountSpent
}

const timeCalculation = (leases, latestBlock, balance) => {
  let time
  if (leases[0].status === 'active') {
    const blocksPassed = Math.abs(leases[0].createdHeight - latestBlock)

    const blocksLeft = balance / leases[0].price - blocksPassed

    const timeCalc = new Date(Date.now() + blocksLeft * avgBlockTime * 1000)
      .toISOString()
      .split('T')[0]

    time =
      Math.abs(new Date(timeCalc) - new Date(new Date().toISOString().split('T')[0])) /
      (1000 * 60 * 60)
  } else {
    const noOfBlocks = Math.abs(leases[0].createdHeight - leases[0].closedHeight)
    time = (noOfBlocks * avgBlockTime) / 3600
  }
  return time
}

const convertInput = (hours) => {
  if (hours < 0) {
    return 'Please provide a non-negative number of hours.'
  }
  const hoursInDay = 24
  const hoursInMonth = 24 * 30 // Assuming an average of 30 days in a month
  const hoursInYear = 24 * 365 // Assuming 365 days in a year

  const years = Math.floor(hours / hoursInYear)
  const remainingHoursAfterYears = hours % hoursInYear

  const months = Math.floor(remainingHoursAfterYears / hoursInMonth)
  const remainingHoursAfterMonths = remainingHoursAfterYears % hoursInMonth

  const days = Math.floor(remainingHoursAfterMonths / hoursInDay)
  const remainingHoursAfterDays = remainingHoursAfterMonths % hoursInDay

  let result = ''

  if (years > 0) {
    result += `${years} ${years === 1 ? 'year' : 'years'}`
    if (months > 0) {
      result += `,and ${months} ${months === 1 ? 'month' : 'months'}`
    }
  } else if (months > 0) {
    result += `${months} ${months === 1 ? 'month' : 'months'}`
    if (days > 0) {
      result += `,and ${days} ${days === 1 ? 'day' : 'days'}`
    }
  } else if (days > 0) {
    result += `${days} ${days === 1 ? 'day' : 'days'}`
    if (remainingHoursAfterDays > 0) {
      result += `,and ${remainingHoursAfterDays} ${
        remainingHoursAfterDays === 1 ? 'hour' : 'hours'
      }`
    }
  } else {
    result += `0 hours`
  }

  return result
}

export { totalDeploymentCost, totalAmountSpent, timeCalculation, convertInput }
