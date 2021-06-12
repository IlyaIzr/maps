import React, { useEffect, useRef, useState } from 'react'
import { getLocation } from '../rest/helperFuncs'
const google = window.google

export const GMap = () => {

  const [map, setMap] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const { lng, lat } = getLocation()

    // if (!ref.current) {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lng, lat },
      zoom: 13,
      mapTypeId:"hybrid",mapTypeControl:!1
    });

    window.gMap = map

    const geocoder = new window.google.maps.Geocoder()
    const placesService = new window.google.maps.places.PlacesService(map)
    setMap(map)



    map.addListener('click', function (event) {
      const lat = event.latLng.lat()
      const lng = event.latLng.lng()
      const latlng = { lat, lng };

      geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results) {
            console.log(results, results[1].place_id);
            getDets(results[1].place_id)
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    })
    
    function getDets(id) {
      placesService.getDetails({ placeId: id }, (place, status) => {
        if (
          status === "OK" &&
          place &&
          place.geometry &&
          place.geometry.location
        ) 
        
        console.log('%c⧭ place:!: ', 'color: #aa00ff', place);
      });
    }

    // }
  }, [])


  // console.log('%c⧭', 'color: #9c66cc', map);




  return (
    <div>
      <div ref={ref} id="map" className="map-container" />
    </div>
  )
}
