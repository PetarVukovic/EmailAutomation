// src/components/DraftModal.tsx

import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { Draft } from '../types';

interface DraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDraft: Draft | null;
  setSelectedDraft: React.Dispatch<React.SetStateAction<Draft | null>>;
  handleUpdateDraft: (draft: Draft) => void;
}

const DraftModal: React.FC<DraftModalProps> = ({
  isOpen,
  onClose,
  selectedDraft,
  setSelectedDraft,
  handleUpdateDraft,
}) => {
  const handleSave = () => {
    if (selectedDraft) {
      handleUpdateDraft(selectedDraft);
    }
    onClose();
    setSelectedDraft(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedDraft(null);
      }}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Draft</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={selectedDraft?.title || ''}
              onChange={(e) =>
                setSelectedDraft(
                  selectedDraft
                    ? { ...selectedDraft, title: e.target.value }
                    : null
                )
              }
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Recipient</FormLabel>
            <Input
              value={selectedDraft?.recipient || ''}
              onChange={(e) =>
                setSelectedDraft(
                  selectedDraft
                    ? { ...selectedDraft, recipient: e.target.value }
                    : null
                )
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Content</FormLabel>
            <Textarea
              value={selectedDraft?.content || ''}
              onChange={(e) =>
                setSelectedDraft(
                  selectedDraft
                    ? { ...selectedDraft, content: e.target.value }
                    : null
                )
              }
              rows={6}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Update Draft
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setSelectedDraft(null);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DraftModal;
