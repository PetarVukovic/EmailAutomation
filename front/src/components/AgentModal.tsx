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
    if (selectedAgent) {
      // Update existing agent
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
    } else {
      // Create new agent
      const newAgent: Agent = {
        id: Date.now(),
        name: agentName,
        prompt: agentPrompt,
        pdfs: agentPdf ? [agentPdf.name] : [],
      };
      handleCreateAgent(newAgent);
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
          {selectedAgent ? 'Edit Agent' : 'Create New Agent'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="space-y-4">
            <FormControl>
              <FormLabel>Agent Name</FormLabel>
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Prompt</FormLabel>
              <Textarea
                value={agentPrompt}
                onChange={(e) => setAgentPrompt(e.target.value)}
                placeholder="Enter agent prompt"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Upload PDF</FormLabel>
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
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            {selectedAgent ? 'Update Agent' : 'Create Agent'}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onClose();
              setSelectedAgent(null);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AgentModal;