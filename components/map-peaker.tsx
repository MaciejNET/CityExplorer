import {useEffect, useState} from "react";
import MapView, {MapPressEvent, Marker} from "react-native-maps";
import {Box} from "@/components/ui/box";
import {StyleSheet} from "react-native";

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

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleMapPress = (e: MapPressEvent) => {
    const newLocation = e.nativeEvent.coordinate;
    setLocation(newLocation);
    onLocationSelected(newLocation);
  }

  const region = {
    latitude: location ? location.latitude : 52.2297,
    longitude: location ? location.longitude : 21.0122,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <Box style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={region}
      >
        {location && <Marker coordinate={location}/>}
      </MapView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 410,
    marginVertical: 12,
  },
  map: {
    flex: 1,
  },
});