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
  Textarea,
  useColorModeValue,
  Box,
  Text,
  Stack,
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
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const labelColor = useColorModeValue('gray.500', 'gray.400');

  const handleSend = () => {
    if (selectedDraft) {
      handleUpdateDraft(selectedDraft);
    }
    onClose();
    setSelectedDraft(null);
  };

  if (!selectedDraft) {
    return null;
  }

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
      <ModalContent bg={bgColor}>
        <ModalHeader>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Email Draft
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <Box>
              <Text fontSize="sm" color={labelColor}>
                From:
              </Text>
              <Text fontSize="md" color={textColor}>
                {selectedDraft.sender}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color={labelColor}>
                To:
              </Text>
              <Text fontSize="md" color={textColor}>
                {selectedDraft.recipient}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color={labelColor}>
                Subject:
              </Text>
              <Text fontSize="md" color={textColor}>
                {selectedDraft.subject}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color={labelColor}>
                Content:
              </Text>
              <Textarea
                value={selectedDraft.content}
                onChange={(e) =>
                  setSelectedDraft(
                    selectedDraft
                      ? { ...selectedDraft, content: e.target.value }
                      : null
                  )
                }
                rows={10}
                color={textColor}
              />
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSend}>
            Send Email
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setSelectedDraft(null);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DraftModal;
