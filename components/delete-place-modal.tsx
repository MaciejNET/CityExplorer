import {Modal, ModalBackdrop, ModalContent, ModalFooter, ModalHeader} from "@/components/ui/modal";
import {Heading} from "@/components/ui/heading";
import {Button, ButtonText} from "@/components/ui/button";

type DeletePlaceModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

export default function DeletePlaceModal(props: DeletePlaceModalProps) {
  const {isOpen, onCancel, onDelete} = props;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="md">
      <ModalBackdrop/>
      <ModalContent>
        <ModalHeader>
          <Heading size="md">
            Are you sure you want to delete this place?
          </Heading>
        </ModalHeader>
        <ModalFooter>
          <Button variant="outline" action="secondary" onPress={onCancel}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button onPress={onDelete}>
            <ButtonText>Delete</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}