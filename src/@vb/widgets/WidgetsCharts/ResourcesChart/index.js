import React, { useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import style from './style.module.scss'

const ResourcesChart = ({
  title,
  subtitle,
  resourceData,
  formatBytes = true,
  formatTitle = 'vcpu',
}) => {
  const tooltip = React.createRef()
  const [myRef, setMyRef] = useState(null)
  const [legend, setLegend] = useState(undefined)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const leg = generateLegend()
    setLegend(leg)
  })

  const setTextInputRef = (element) => {
    setMyRef(element)
  }

  const generateLegend = () => {
    if (!myRef) return null
    return myRef.chartInstance.generateLegend()
  }

  const createMarkup = () => {
    return { __html: legend }
  }

  const data = {
    labels: ['Available', 'Active', 'Pending'],
    datasets: [
      {
        data: resourceData,
        backgroundColor: ['#8BC34A', '#4DD0E1', '#FFA726'],
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderWidth: 0,
        borderAlign: 'inner',
      },
    ],
  }

  function format(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return [parseFloat((bytes / k ** i).toFixed(dm)), sizes[i]]
  }

  const options = {
    animation: false,
    responsive: true,
    cutoutPercentage: 70,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
      custom: (tooltipData) => {
        const tooltipEl = tooltip.current
        tooltipEl.style.opacity = 1
        if (tooltipData.opacity === 0) {
          tooltipEl.style.opacity = 0
        }
      },
      callbacks: {
        label: (tooltipItem, itemData) => {
          const dataset = itemData.datasets[0]
          let size = [dataset.data[tooltipItem.index], formatTitle]
          if (formatBytes) {
            size = format(dataset.data[tooltipItem.index])
          }
          const value = ` <span class="small-text">${size[0]} ${size[1]}</span>`
          tooltip.current.innerHTML = value
        },
      },
    },
    legendCallback: (chart) => {
      const { labels } = chart.data
      let legendMarkup = []
      const dataset = chart.data.datasets[0]
      legendMarkup.push('<div class="vb__c9__chartLegend flex-shrink-0">')
      let legends = labels.map((label, index) => {
        const color = dataset.backgroundColor[index]
        let size = [resourceData[index], formatTitle]
        if (formatBytes) {
          size = format(resourceData[index])
        }
        return `<div class="d-flex align-items-center flex-nowrap mt-2 mb-2"><div class="tablet mr-3" style="background-color: ${color}"></div>  ${size[0]} ${size[1]} - ${label}</div>`
      })
      legends = legends.join('')
      legendMarkup.push(legends)
      legendMarkup.push('</div>')
      legendMarkup = legendMarkup.join('')
      return legendMarkup
    },
  }

  return (
    <div>
      <div className="text-dark font-size-18 font-weight-bold mb-1">{title}</div>
      <div className="text-gray-6 mb-2">{subtitle}</div>
      <div className="d-flex flex-wrap align-items-center">
        <div className="mr-3 mt-3 mb-3 position-relative">
          <Doughnut
            ref={(element) => setTextInputRef(element)}
            data={data}
            options={options}
            width={140}
            height={140}
          />
          <div className={`${style.tooltip} text-gray-5 font-size-28`} ref={tooltip} />
        </div>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </div>
    </div>
  )
}

export default ResourcesChart
