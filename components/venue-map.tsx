import * as React from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'

import { SpinnerSVG } from '@/components/icons'

function VenueMap({ venue }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  })

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return isLoaded ? (
    <GoogleMap
      zoom={16}
      center={{
        lat: venue.latitude,
        lng: venue.longitude
      }}
      mapContainerClassName="h-96 w-full"
      options={{
        disableDefaultUI: true,
        clickableIcons: false,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
        }
      }}
    >
      <Marker
        position={{
          lat: venue.latitude,
          lng: venue.longitude
        }}
      />
    </GoogleMap>
  ) : (
    <SpinnerSVG className="h-6 w-6 animate-spin" />
  )
}

export default VenueMap
