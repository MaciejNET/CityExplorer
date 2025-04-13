import {Place} from "@/schemas/place";
import {useState} from "react";
import {useRouter} from "expo-router";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {Box} from "@/components/ui/box";
import {Pressable} from "react-native";
import {Card} from "@/components/ui/card";
import {Icon, TrashIcon} from "@/components/ui/icon";
import {Text} from "@/components/ui/text";
import {Badge, BadgeText} from "@/components/ui/badge";

type PlaceItemProps = {
  place: Place;
  deletePlace: (id: string) => void;
}

export function PlaceItem(props: PlaceItemProps): JSX.Element {
  const {place, deletePlace} = props;
  const [isSwiped, setIsSwiped] = useState(false);
  const router = useRouter();

  const handlePress = () => {
    if (!isSwiped) {
      router.push(`/details/${place.id}`);
    }
  };

  return (
    <ReanimatedSwipeable
      key={place.id}
      onSwipeableWillOpen={() => setIsSwiped(true)}
      onSwipeableWillClose={() => setIsSwiped(false)}
      renderRightActions={(progress, dragAnimatedValue, swipeable) => (
        <Box className="items-center justify-center m-2">
          <Pressable
            onPress={() => {
              swipeable.close();
              deletePlace(place.id);
            }}
          >
            <Card size="md" className="bg-red-500">
              <Icon as={TrashIcon}/>
            </Card>
          </Pressable>
        </Box>
      )}
    >
      <Pressable disabled={isSwiped} onPress={handlePress}>
        <Card size="md">
          <Text size="md">{place.name}</Text>
          <Badge size="lg" action="info" className="w-auto self-start mt-2">
            <BadgeText>{place.city}</BadgeText>
          </Badge>
        </Card>
      </Pressable>
    </ReanimatedSwipeable>
  );
}