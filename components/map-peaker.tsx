import React, {useEffect, useState} from "react";
import MapView, {MapPressEvent, Marker} from "react-native-maps";
import {Box} from "@/components/ui/box";
import {StyleSheet, TouchableOpacity} from "react-native";
import * as Location from 'expo-location';
import {Button, ButtonText} from "@/components/ui/button";
import {HStack} from "@/components/ui/hstack";
import {Text} from "@/components/ui/text";

type Location = {
  latitude: number;
  longitude: number;
};

type MapPickerProps = {
  initialLocation?: Location;
  onLocationSelected: (location: Location) => void;
};

export function MapPicker(props: MapPickerProps) {
  const {initialLocation, onLocationSelected} = props;
  const [location, setLocation] = useState<Location | undefined>(initialLocation);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleMapPress = (e: MapPressEvent) => {
    const newLocation = e.nativeEvent.coordinate;
    setLocation(newLocation);
    onLocationSelected(newLocation);
  }

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      // Request permission to access location
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude
      };

      // Update location state and call the callback
      setLocation(newLocation);
      onLocationSelected(newLocation);

      // Animate map to new location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...newLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Failed to get current location');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const mapRef = React.useRef<MapView>(null);

  const region = {
    latitude: location ? location.latitude : 52.2297,
    longitude: location ? location.longitude : 21.0122,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <Box style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={region}
      >
        {location && <Marker coordinate={location}/>}
      </MapView>

      <Box style={styles.buttonContainer}>
        <Button onPress={getCurrentLocation} disabled={isLoadingLocation}>
          <ButtonText>{isLoadingLocation ? 'Getting location...' : 'Use My Location'}</ButtonText>
        </Button>
      </Box>

      {locationError && (
        <Text style={styles.errorText}>{locationError}</Text>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 410,
    marginVertical: 12,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
});
