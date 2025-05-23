import {Box} from "@/components/ui/box";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Text} from "@/components/ui/text";
import {BackButton} from "@/components/back-button";
import {usePlacesStore} from "@/stores/places-store";
import {Button, ButtonText} from "@/components/ui/button";
import {MapDisplay} from "@/components/map-display";
import {PhotoGallery} from "@/components/photo-gallery";
import React, {useEffect, useState} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {Spinner} from "@/components/ui/spinner";

export default function Details() {
  const router = useRouter();

  const {id} = useLocalSearchParams<{ id: string }>();

  const {getPlaceById} = usePlacesStore();
  const [place, setPlace] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaceDetails = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const placeDetails = await getPlaceById(id);
      setPlace(placeDetails);
    } catch (err) {
      console.error('Failed to fetch place details:', err);
      setError('Failed to fetch place details');
    } finally {
      setIsLoading(false);
    }
  }, [id, getPlaceById]);

  useEffect(() => {
    fetchPlaceDetails();
  }, [fetchPlaceDetails]);

  useFocusEffect(
    React.useCallback(() => {
      fetchPlaceDetails();
      return () => {
      };
    }, [id, fetchPlaceDetails])
  );

  if (isLoading) {
    return (
      <Box className="flex-1 bg-white p-4">
        <Box className="absolute top-0 left-0 p-4 z-10">
          <BackButton/>
        </Box>
        <Box className="flex-1 justify-center items-center">
          <Spinner size="large" text="Loading place details..."/>
        </Box>
      </Box>
    );
  }

  if (error || !place) {
    return (
      <Box className="flex-1 bg-white p-4">
        <Box className="absolute top-0 left-0 p-4 z-10">
          <BackButton/>
        </Box>
        <Box className="flex-1 justify-center items-center">
          <Text size="lg" bold className="text-center">
            Place not found
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="flex-1 ">
      <Box className="absolute top-0 left-0 p-4 z-10">
        <BackButton/>
      </Box>
      <Box className="absolute top-0 right-0 p-4 z-10">
        <Button variant="link" onPress={() => router.push(`/add-edit/${id}`)}>
          <ButtonText>Edit</ButtonText>
        </Button>
      </Box>
      <Box className="flex-1 mt-4 p-4">
        <Box className="p-6 rounded-md shadow-md w-full max-w-lg">
          <Text size="3xl" bold className="mb-2">
            {place.name}
          </Text>
          <Text size="lg" italic className="mb-2">
            {place.city}
          </Text>
          <Text size="md" className="mb-4">
            {place.description}
          </Text>
          <Box className="mb-4">
            <MapDisplay location={place.location}/>
          </Box>
          <Box className="mt-4">
            <PhotoGallery photoIds={place.photoIds || []}/>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
