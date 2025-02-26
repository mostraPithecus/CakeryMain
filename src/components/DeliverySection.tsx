import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Circle, StandaloneSearchBox } from '@react-google-maps/api';
import { toast } from 'react-hot-toast';

interface DeliverySectionProps {
  onDeliveryMethodChange: (method: 'pickup' | 'delivery' | null, deliveryCost?: number, distance?: number) => void;
  onAddressConfirm: (address: string, isConfirmed: boolean) => void;
  googleMapsApiKey: string;
  totalWeightKg?: number;
}

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

const pickupPoints = [
  {
    id: 1,
    name: 'takeaway pickup the main hall of:',
    address: 'Itäkeskus, Turku, Southwest Finland, Finland',
    position: { lat: 60.442764, lng: 22.359507 }
  }
];

const defaultCenter = { lat: 60.442764, lng: 22.359507 };
const deliveryZone = {
  center: defaultCenter,
  radius: 20000 // 20 km in meters
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem'
};

const COST_PER_KM = 2; // €2 per kilometer
const MIN_DELIVERY_COST = 5; // Minimum €5 delivery cost
const WEIGHT_SURCHARGE_PER_KG = 1; // €1 additional per kg over 5kg

const calculateDeliveryCost = (distanceInMeters: number, totalWeightKg: number = 0): number => {
  const distanceInKm = distanceInMeters / 1000;
  const baseCost = Math.max(MIN_DELIVERY_COST, Math.ceil(distanceInKm * COST_PER_KM));
  
  // Add weight surcharge for orders over 5kg
  const weightSurcharge = Math.max(0, totalWeightKg - 5) * WEIGHT_SURCHARGE_PER_KG;
  
  return Math.ceil(baseCost + weightSurcharge);
};

const DeliverySection: React.FC<DeliverySectionProps> = ({ 
  onDeliveryMethodChange, 
  onAddressConfirm,
  googleMapsApiKey,
  totalWeightKg = 0
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery' | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(1);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);
  const [deliveryDistance, setDeliveryDistance] = useState<number | null>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLng | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const markerSize = { width: 32, height: 32 };

  const onLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setIsLoaded(false);
  }, []);

  const onLoadError = useCallback((error: Error) => {
    console.error('Error loading Google Maps:', error);
  }, []);

  const onSearchBoxLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry && place.formatted_address) {
          handlePlaceSelected(place);
        }
      }
    }
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location || !isLoaded) {
      toast.error('Invalid address selected');
      return;
    }

    const distance = google.maps.geometry.spherical.computeDistanceBetween(
      place.geometry.location,
      new google.maps.LatLng(pickupPoints[0].position)
    );

    if (distance > deliveryZone.radius) {
      toast.error('Sorry, this address is outside our delivery zone (15km)');
      return;
    }

    setDeliveryAddress(place.formatted_address || '');
    setSelectedLocation(place.geometry.location);
    const cost = calculateDeliveryCost(distance, totalWeightKg);
    setDeliveryDistance(distance);
    setDeliveryCost(cost);
    setIsAddressConfirmed(true);
    onDeliveryMethodChange('delivery', cost, distance);
    onAddressConfirm(place.formatted_address || '', true);
    toast.success('Delivery address confirmed');

    // Center map on selected location
    if (map) {
      map.panTo(place.geometry.location);
      map.setZoom(15);
    }
  };

  const handleEditAddress = () => {
    setIsAddressConfirmed(false);
    setDeliveryDistance(null);
    setDeliveryCost(null);
    onDeliveryMethodChange('delivery', undefined);
    onAddressConfirm(deliveryAddress, false);
  };

  const calculateDistance = async (address: string): Promise<number | null> => {
    if (!map) {
      toast.error('Map service not initialized');
      return null;
    }

    try {
      const result = await new google.maps.Geocoder().geocode({ address });
      if (result.results[0]) {
        const deliveryPoint = result.results[0].geometry.location;
        const distance = google.maps.geometry.spherical.computeDistanceBetween(
          deliveryPoint,
          new google.maps.LatLng(pickupPoints[0].position)
        );
        
        if (distance > deliveryZone.radius) {
          toast.error('Sorry, this address is outside our delivery zone (15km)');
          return null;
        }

        return distance;
      } else {
        toast.error('Address not found');
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Error calculating delivery distance');
      return null;
    }
  };

  const handleConfirmAddress = async () => {
    if (!deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    try {
      const distance = await calculateDistance(deliveryAddress);
      
      if (distance === null) {
        return; // Error already shown in calculateDistance
      }

      const cost = calculateDeliveryCost(distance, totalWeightKg);
      setDeliveryDistance(distance);
      setDeliveryCost(cost);
      setIsAddressConfirmed(true);
      onDeliveryMethodChange('delivery', cost, distance);
      onAddressConfirm(deliveryAddress, true);
      toast.success('Delivery address confirmed');
    } catch (error) {
      console.error('Error confirming address:', error);
      toast.error('Failed to confirm delivery address');
    }
  };

  const handleDeliveryMethodChange = (method: 'pickup' | 'delivery') => {
    setDeliveryMethod(method);
    setDeliveryAddress('');
    setDeliveryCost(null);
    setIsAddressConfirmed(false);
    onDeliveryMethodChange(method, method === 'pickup' ? 0 : undefined);
  };

  const handleDeliveryCostCalculation = useCallback((distanceInMeters: number) => {
    const cost = calculateDeliveryCost(distanceInMeters, totalWeightKg);
    onDeliveryMethodChange('delivery', cost, distanceInMeters);
  }, [onDeliveryMethodChange, totalWeightKg]);

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      libraries={libraries}
      onError={onLoadError}
      version="weekly"
      loadingElement={
        <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading map...</div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Delivery Method Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Choose Delivery Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pickup Option */}
            <button
              type="button"
              onClick={() => handleDeliveryMethodChange('pickup')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                deliveryMethod === 'pickup'
                  ? 'border-[#8148B5] bg-purple-50'
                  : 'border-gray-200 hover:border-[#8148B5]'
              }`}
            >
              <div className="font-medium text-gray-900">Pickup</div>
              <div className="text-sm text-gray-500 mt-1">
                Pick up your order from our store
              </div>
            </button>

            {/* Delivery Option */}
            <button
              type="button"
              onClick={() => handleDeliveryMethodChange('delivery')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                deliveryMethod === 'delivery'
                  ? 'border-[#8148B5] bg-purple-50'
                  : 'border-gray-200 hover:border-[#8148B5]'
              }`}
            >
              <div className="font-medium text-gray-900">Delivery</div>
              <div className="text-sm text-gray-500 mt-1">
                Get your order delivered to your address
              </div>
            </button>
          </div>
        </div>

        {/* Delivery Address Input */}
        {deliveryMethod === 'delivery' && (
          <div className="w-full max-w-2xl">
            <label htmlFor="delivery-address-input" className="block text-gray-700 font-medium mb-2">
              Delivery Address
            </label>
            <div className="flex gap-2 w-full">
              <StandaloneSearchBox
                onLoad={onSearchBoxLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  ref={searchBoxRef}
                  id="delivery-address-input"
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => {
                    setDeliveryAddress(e.target.value);
                    setIsAddressConfirmed(false);
                    setDeliveryDistance(null);
                    setDeliveryCost(null);
                  }}
                  disabled={isAddressConfirmed}
                  maxLength={500}
                  size={50}
                  placeholder="Start typing your address..."
                  className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#8148B5] focus:border-[#8148B5] ${
                    isAddressConfirmed ? 'bg-gray-50' : ''
                  }`}
                />
              </StandaloneSearchBox>
              {isAddressConfirmed && (
                <button
                  type="button"
                  onClick={handleEditAddress}
                  className="px-4 py-2 rounded-md font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors whitespace-nowrap"
                >
                  Edit
                </button>
              )}
            </div>
            {!isAddressConfirmed && (
              <p className="text-sm text-gray-500 mt-1">
                Start typing and select an address from the dropdown
              </p>
            )}
            {isAddressConfirmed && (
              <p className="text-green-600 text-sm mt-2">✓ Address confirmed</p>
            )}
            {deliveryDistance && deliveryCost && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Distance: {(deliveryDistance / 1000).toFixed(1)} km</p>
                <p>Delivery Cost: &euro;{deliveryCost}</p>
              </div>
            )}
          </div>
        )}

        {/* Map */}
        <div style={{ height: '400px', width: '100%' }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedLocation || (deliveryMethod === 'pickup' ? pickupPoints[0].position : defaultCenter)}
            zoom={selectedLocation ? 15 : (deliveryMethod === 'pickup' ? 14 : 11)}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "all",
                  stylers: [
                    { saturation: -100 },
                    { lightness: 30 }
                  ]
                }
              ],
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
            }}
          >
            {isLoaded && (
              <>
                {/* Pickup points */}
                {pickupPoints.map(point => (
                  <Marker
                    key={point.id}
                    position={point.position}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png',
                      scaledSize: new window.google.maps.Size(32, 32)
                    }}
                  />
                ))}

                {/* Selected delivery location */}
                {selectedLocation && (
                  <Marker
                    position={selectedLocation}
                    icon={{
                      url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                      scaledSize: new window.google.maps.Size(32, 32)
                    }}
                  />
                )}

                {/* Delivery zone circle */}
                <Circle
                  center={deliveryZone.center}
                  radius={deliveryZone.radius}
                  options={{
                    fillColor: '#8148B5',
                    fillOpacity: 0.1,
                    strokeColor: '#8148B5',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              </>
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

export default DeliverySection;
