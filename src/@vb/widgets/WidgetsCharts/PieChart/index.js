import { Divider } from 'antd'
import React, { useState } from 'react'
import { PieChart, Pie, Sector, Cell } from 'recharts'
import style from './style.module.scss'

const PieCharts = ({ title, subtitle, resourceData, formatBytes = true, formatType = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const COLORS = ['#FF8A65', '#FFC107', '#D7CCC8']

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 5) * sin
    const mx = cx + (outerRadius + 15) * cos
    const my = cy + (outerRadius + 15) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {displayFormattedValue(value)}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  const displayFormattedValue = (val) => {
    if (formatBytes) {
      return format(val)
    }
    return `${val} ${formatType}`
  }

  function format(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / k ** i).toFixed(dm))}${sizes[i]}`
  }

  return (
    <div>
      <div className="text-dark font-size-18 font-weight-bold mb-1">{title}</div>
      <div className="text-gray-6 mb-2">{subtitle}</div>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className=" mb-3">
              <PieChart width={350} height={250}>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </div>
          </div>
        </div>
        <Divider />
        <div className="row justify-content-center">
          <div className="col">
            <div className={style.title}>{displayFormattedValue(resourceData[0].value)}</div>
            <div>
              <span className={style.circleIconActive} />
              {resourceData[0].name}
            </div>
          </div>
          <div className="col">
            <div className={style.title}>{displayFormattedValue(resourceData[1].value)}</div>
            <div>
              <span className={style.circleIconPending} />
              {resourceData[1].name}
            </div>
          </div>
          <div className="col">
            <div className={style.title}>{displayFormattedValue(resourceData[2].value)}</div>
            <div>
              <span className={style.circleIconAvalilable} />
              {resourceData[2].name}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PieCharts
