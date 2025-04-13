import React from "react";
import {StyleSheet} from "react-native";
import MapView, {Marker} from "react-native-maps";
import {Box} from "@/components/ui/box";

type Location = {
  latitude: number;
  longitude: number;
};

type MapDisplayProps = {
  location: Location;
};

export function MapDisplay({location}: MapDisplayProps) {
  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <Box style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
      >
        <Marker coordinate={location}/>
      </MapView>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 410,
  },
  map: {
    flex: 1,
  },
});
