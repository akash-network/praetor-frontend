import { Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import worldJson from '../../worldmap.json'

const WorldMapStatus = ({ map, green }) => {
  const [mapData, setMapData] = useState([])
  useEffect(() => {
    setMapData(formatMapData(map))
  }, [map])
  const formatMapData = (data) => {
    const response = []
    data.forEach((marker) => {
      if (marker.provider_location) {
        const res = {}
        res.key = marker.address
        res.name = `${marker.provider_location.city}, ${marker.provider_location.countryCode}`
        res.markerOffset = 25
        res.coordinates = [marker.provider_location.lon, marker.provider_location.lat]
        res.praetor = marker.praetor
        response.push(res)
      }
    })
    return response
  }
  return (
    <ComposableMap
      height={300}
      width={600}
      projectionConfig={{
        scale: 100,
      }}
    >
      <Geographies geography={worldJson}>
        {({ geographies }) =>
          geographies.map((geo) => <Geography key={geo.rsmKey} geography={geo} fill="#222222ED" />)
        }
      </Geographies>
      {mapData.map(({ key, name, coordinates }) => (
        <Marker key={key} coordinates={coordinates}>
          <Tooltip title={name}>
            <circle r={4} fill={green ? '#59980e' : '#F00'} stroke="#fff" strokeWidth={0.5} />
          </Tooltip>
        </Marker>
      ))}
    </ComposableMap>
  )
}

export default WorldMapStatus
