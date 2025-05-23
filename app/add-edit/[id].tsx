import {Box} from "@/components/ui/box";
import {Text} from "@/components/ui/text";
import {Controller, useForm} from "react-hook-form";
import {Place, PlaceSchema} from "@/schemas/place";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Input, InputField} from "@/components/ui/input";
import {Textarea, TextareaInput} from "@/components/ui/textarea";
import {Button, ButtonText} from "@/components/ui/button";
import {uuid} from "expo-modules-core";
import {BackButton} from "@/components/back-button";
import {usePlacesStore} from "@/stores/places-store";
import {MapPicker} from "@/components/map-peaker";
import {Keyboard, ScrollView, TouchableWithoutFeedback} from "react-native";
import {PhotoPicker} from "@/components/photo-picker";
import {useEffect, useState} from "react";
import {Spinner} from "@/components/ui/spinner";

export default function AddEdit() {
  const router = useRouter();

  const {id} = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";

  const {getPlaceById, addPlace, updatePlace, deletePhoto} = usePlacesStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [place, setPlace] = useState<Place | undefined>(undefined);
  const [selectedPhotos, setSelectedPhotos] = useState<{
    existingPhotoIds: string[],
    newPhotos: Blob[],
    photosToDelete: string[]
  }>({
    existingPhotoIds: [],
    newPhotos: [],
    photosToDelete: []
  });

  useEffect(() => {
    if (!isNew) {
      const fetchPlace = async () => {
        setIsLoading(true);
        try {
          const fetchedPlace = await getPlaceById(id);
          setPlace(fetchedPlace);
          if (fetchedPlace) {
            reset(fetchedPlace);
            if (fetchedPlace.photoIds) {
              setSelectedPhotos(prev => ({
                ...prev,
                existingPhotoIds: fetchedPlace.photoIds || []
              }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch place:', err);
          setError('Failed to fetch place');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlace();
    }
  }, [id, isNew, getPlaceById]);

  const existingPlace = place;

  const defaultValues: Place = existingPlace
    ? existingPlace
    : {
      id: uuid.v4(),
      name: "",
      city: "",
      description: "",
      location: {
        latitude: 52.2297,
        longitude: 21.0122
      },
      photoIds: []
    };

  const {control, handleSubmit, formState: {errors}, reset} = useForm({
    resolver: zodResolver(PlaceSchema),
    defaultValues,
    mode: "onChange"
  })

  const onSubmit = async (place: Place) => {
    setIsLoading(true);
    try {
      if (isNew) {
        await addPlace(place, selectedPhotos.newPhotos);
      } else {
        for (const photoId of selectedPhotos.photosToDelete) {
          try {
            await deletePhoto(place.id, photoId);
            console.log(`Photo ${photoId} deleted successfully`);
          } catch (photoError) {
            console.error(`Failed to delete photo ${photoId}:`, photoError);
          }
        }

        await updatePlace(place, selectedPhotos.newPhotos);
      }
      router.back();
    } catch (err) {
      console.error('Failed to save place:', err);
      setError('Failed to save place');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <Box className="p-3">
        <Box className="relative flex items-center justify-center w-full mb-4">
          <Box className="absolute left-0">
            <BackButton/>
          </Box>
          <Box className="flex items-center justify-center">
            <Spinner size="large" text="Loading place data..."/>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!isNew && !existingPlace) {
    return (
      <Box className="p-3">
        <Box className="relative flex items-center justify-center w-full mb-4">
          <Box className="absolute left-0">
            <BackButton/>
          </Box>
          <Text size="xl" bold>
            Place Not Found
          </Text>
        </Box>
      </Box>
    );
  }

  const action = isNew ? "Add" : "Edit";

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <Box className="p-3 flex-col items-center">
          <Box className="relative flex items-center justify-center w-full mb-4">
            <Box className="absolute left-0">
              <BackButton/>
            </Box>
            <Text size="xl" bold>
              {action} Place
            </Text>
          </Box>
          <Box className="w-full max-w-md">
            <Controller
              control={control}
              name="name"
              render={({field: {onChange, onBlur, value}}) => (
                <Input className="my-2">
                  <InputField
                    placeholder="Name"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.name && (
              <Text className="text-red-500 mt-1">{errors.name.message}</Text>
            )}

            <Controller
              control={control}
              name="city"
              render={({field: {onChange, onBlur, value}}) => (
                <Input className="my-2">
                  <InputField
                    placeholder="City"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                </Input>
              )}
            />
            {errors.city && (
              <Text className="text-red-500 mt-1">{errors.city.message}</Text>
            )}

            <Controller
              control={control}
              name="description"
              render={({field: {onChange, onBlur, value}}) => (
                <Textarea className="my-2">
                  <TextareaInput
                    placeholder="Description"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                  />
                </Textarea>
              )}
            />
            {errors.description && (
              <Text className="text-red-500 mt-1">{errors.description.message}</Text>
            )}

            <Controller
              control={control}
              name="location"
              render={({field: {onChange, value}}) => (
                <>
                  <MapPicker initialLocation={value} onLocationSelected={onChange}/>
                  {errors.location && (
                    <Text className="text-red-500 mt-1">{errors.location.message}</Text>
                  )}
                </>
              )}
            />

            <Box className="my-4">
              <PhotoPicker
                existingPhotoIds={existingPlace?.photoIds || []}
                onPhotosSelected={setSelectedPhotos}
              />
            </Box>

            {error && (
              <Text className="text-red-500 mt-1">{error}</Text>
            )}

            <Button className="mt-2" onPress={handleSubmit(onSubmit)} disabled={isLoading}>
              {isLoading ? (
                <Box className="flex-row items-center">
                  <Spinner size="small" color="white"/>
                  <ButtonText className="ml-2">Saving...</ButtonText>
                </Box>
              ) : (
                <ButtonText>Save</ButtonText>
              )}
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}
