// src/components/SettingsModal.tsx

import React, { useState } from 'react';
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
  Switch,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [automationEnabled, setAutomationEnabled] = useState<boolean>(false);
  const [googleDriveEnabled, setGoogleDriveEnabled] = useState<boolean>(false);
  const [googleSheetsEnabled, setGoogleSheetsEnabled] = useState<boolean>(false);
  const toast = useToast();

  const handleSave = () => {
    // Save settings logic here
    onClose();
    toast({
      title: 'Settings Saved',
      description: 'Your settings have been updated.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="space-y-4">
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel mb="0">Enable AI Automation Workflow</FormLabel>
              <Switch
                isChecked={automationEnabled}
                onChange={(e) => setAutomationEnabled(e.target.checked)}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel mb="0">Upload files to Google Drive</FormLabel>
              <Switch
                isChecked={googleDriveEnabled}
                onChange={(e) => setGoogleDriveEnabled(e.target.checked)}
              />
            </FormControl>
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <FormLabel mb="0">Create Google Sheets from PDFs</FormLabel>
              <Switch
                isChecked={googleSheetsEnabled}
                onChange={(e) => setGoogleSheetsEnabled(e.target.checked)}
              />
            </FormControl>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save Settings
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;