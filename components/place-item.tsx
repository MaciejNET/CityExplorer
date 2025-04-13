import {Place} from "@/schemas/place";
import {useState} from "react";
import {Link} from "expo-router";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import {Box} from "@/components/ui/box";
import {Pressable} from "react-native";
import {Card} from "@/components/ui/card";
import {Icon, TrashIcon} from "@/components/ui/icon";
import {Text} from "@/components/ui/text";
import {Badge, BadgeText} from "@/components/ui/badge";

export const PlaceItem = ({place, deletePlace}: { place: Place, deletePlace: (id: string) => void }) => {
  const [isSwiped, setIsSwiped] = useState(false);

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
      <Link disabled={isSwiped} key={place.id} href={`/details/${place.id}`} asChild>
        <Pressable disabled={isSwiped}>
          <Card size="md">
            <Text size="md">{place.name}</Text>
            <Badge size="lg" action="info" className="w-auto self-start mt-2">
              <BadgeText>{place.city}</BadgeText>
            </Badge>
          </Card>
        </Pressable>
      </Link>
    </ReanimatedSwipeable>
  );
};