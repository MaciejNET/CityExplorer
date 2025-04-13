import {Box} from "@/components/ui/box";
import {Text} from "@/components/ui/text";
import {Controller, useForm} from "react-hook-form";
import {Place, PlaceSchema} from "@/schemas/place";
import {zodResolver} from "@hookform/resolvers/zod/src";
import {useLocalSearchParams, useRouter} from "expo-router";
import {Input, InputField} from "@/components/ui/input";
import {Textarea, TextareaInput} from "@/components/ui/textarea";
import {Button, ButtonText} from "@/components/ui/button";
import {uuid} from "expo-modules-core";
import {BackButton} from "@/components/back-button";
import {usePlacesStore} from "@/stores/places-store";
import {MapPicker} from "@/components/map-peaker";
import {Keyboard, ScrollView, TouchableWithoutFeedback} from "react-native";

export default function AddEdit() {
  const router = useRouter();

  const {id} = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";

  const {getPlaceById, addPlace, updatePlace} = usePlacesStore();

  const existingPlace = !isNew ? getPlaceById(id) : undefined;

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
      }
    };

  const {control, handleSubmit, formState: {errors}} = useForm<Place>({
    resolver: zodResolver(PlaceSchema),
    defaultValues,
    mode: "onChange"
  })

  const onSubmit = (place: Place) => {
    if (isNew) {
      addPlace(place);
    } else {
      updatePlace(place);
    }

    router.back();
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

            <Button className="mt-2" onPress={handleSubmit(onSubmit)}>
              <ButtonText>Save</ButtonText>
            </Button>
          </Box>
        </Box>
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}