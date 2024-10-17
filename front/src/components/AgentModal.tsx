// src/components/AgentModal.tsx

import React, { useState, useEffect } from 'react';
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Agent } from '../types';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgent: Agent | null;
  setSelectedAgent: React.Dispatch<React.SetStateAction<Agent | null>>;
  handleCreateAgent: (agent: Agent) => void;
  handleUpdateAgent: (agent: Agent) => void;
}

const AgentModal: React.FC<AgentModalProps> = ({
  isOpen,
  onClose,
  selectedAgent,
  setSelectedAgent,
  handleCreateAgent,
  handleUpdateAgent,
}) => {
  const [agentName, setAgentName] = useState<string>('');
  const [agentPrompt, setAgentPrompt] = useState<string>('');
  const [agentPdf, setAgentPdf] = useState<File | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (selectedAgent) {
      setAgentName(selectedAgent.name);
      setAgentPrompt(selectedAgent.prompt || '');
    } else {
      setAgentName('');
      setAgentPrompt('');
    }
    setAgentPdf(null);
  }, [selectedAgent]);

  const handleSave = () => {
    if (!agentName.trim()) {
      toast({
        title: 'Greška',
        description: 'Molimo unesite ime agenta.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (selectedAgent) {
      // Ažuriraj postojećeg agenta
      const updatedAgent: Agent = {
        ...selectedAgent,
        name: agentName,
        prompt: agentPrompt,
        pdfs: agentPdf
          ? [...selectedAgent.pdfs, agentPdf.name]
          : selectedAgent.pdfs,
      };
      handleUpdateAgent(updatedAgent);
      setSelectedAgent(null);
      toast({
        title: 'Agent ažuriran',
        description: `${agentName} je uspješno ažuriran.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Kreiraj novog agenta
      const newAgent: Agent = {
        id: Date.now(),
        name: agentName,
        prompt: agentPrompt,
        pdfs: agentPdf ? [agentPdf.name] : [],
      };
      handleCreateAgent(newAgent);
      toast({
        title: 'Agent kreiran',
        description: `${agentName} je uspješno kreiran.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setSelectedAgent(null);
      }}
      size="lg"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {selectedAgent ? 'Uredi agenta' : 'Kreiraj novog agenta'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Ime agenta</FormLabel>
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Unesite ime agenta"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Prompt</FormLabel>
              <Textarea
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Unesite prompt agenta"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Učitaj PDF</FormLabel>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setAgentPdf(e.target.files[0]);
                  }
                }}
              />
            </FormControl>
            {agentPdf && (
              <text>
                {agentPdf.name} odabran.
              </text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            {selectedAgent ? 'Ažuriraj agenta' : 'Kreiraj agenta'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setSelectedAgent(null);
            }}
          >
            Odustani
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AgentModal;
