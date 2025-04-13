import {ScrollView} from "react-native";
import {Text} from "@/components/ui/text";
import {VStack} from "@/components/ui/vstack";
import {useRouter} from "expo-router";
import {Box} from "@/components/ui/box";
import {Button, ButtonText} from "@/components/ui/button";
import {usePlacesStore} from "@/stores/places-store";
import {PlaceItem} from "@/components/place-item";
import DeletePlaceModal from "@/components/delete-place-modal";
import {useState} from "react";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [placeToDeleteId, setPlaceToDeleteId] = useState<string | null>(null);

  const router = useRouter();
  const {places, deletePlace} = usePlacesStore();

  const openDeletePlaceModal = (id: string) => {
    setPlaceToDeleteId(id);
    setIsModalOpen(true);
  }

  const onClose = () => {
    setPlaceToDeleteId(null);
    setIsModalOpen(false);
  }

  const onDelete = () => {
    if (placeToDeleteId) {
      deletePlace(placeToDeleteId);
    } else {
      throw new Error("Unable to delete place");
    }

    onClose();
  }

  return (
    <>
      <ScrollView>
        <Box className="p-3">
          <Text className="text-center my-2" size="5xl">CITY EXPLORER</Text>
          <Button size="md" className="mb-3" onPress={() => router.push("/add-edit/new")}>
            <ButtonText>Add</ButtonText>
          </Button>
          <VStack space="md">
            {places.map((place) => (
              <PlaceItem key={place.id} place={place} deletePlace={openDeletePlaceModal}/>
            ))}
          </VStack>
        </Box>
      </ScrollView>
      <DeletePlaceModal
        isOpen={isModalOpen}
        onCancel={onClose}
        onDelete={onDelete}
      />
    </>
  );
}
