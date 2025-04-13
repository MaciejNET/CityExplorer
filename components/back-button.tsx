import {useRouter} from "expo-router";
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import {ChevronLeftIcon} from "@/components/ui/icon";

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="link" onPress={() => router.back()}>
      <ButtonIcon as={ChevronLeftIcon}/>
      <ButtonText>Back</ButtonText>
    </Button>
  )
}