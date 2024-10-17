// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AgentModal from '../components/AgentModal';
import DraftModal from '../components/DraftModal';
import SettingsModal from '../components/SettingsModal';
import {
  Button,
  useToast,
  Heading,
  Text,
  Box,
  Grid,
  GridItem,
  Image,
  useColorMode,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { User, Agent, Draft, ItemTypes } from '../types';
import Confetti from 'react-confetti';
import { useDrop } from 'react-dnd';
import DraggableAgent from '../components/DraggableAgent';
import agentImage from '../assets/agent.png'; // Importirao sliku agenta

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<'agents' | 'drafts'>('agents');
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'General Assistant', pdfs: ['general_info.pdf'] },
    { id: 2, name: 'Sales Agent', pdfs: ['sales_playbook.pdf'] },
  ]);
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: 1,
      title: 'Follow-up Email',
      agent: 'Sales Agent',
      recipient: 'john@example.com',
      content: 'Dear John, I hope this email finds you well...',
      isRead: false,
    },
    {
      id: 2,
      title: 'Meeting Summary',
      agent: 'General Assistant',
      recipient: 'team@company.com',
      content: "Hello team, here's a summary of our recent meeting...",
      isRead: false,
    },
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mainAgent, setMainAgent] = useState<Agent | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleCreateAgent = (newAgent: Agent) => {
    setAgents([...agents, newAgent]);
    toast({
      title: 'Agent Created',
      description: `${newAgent.name} has been added.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateAgent = (updatedAgent: Agent) => {
    const updatedAgents = agents.map((agent) =>
      agent.id === updatedAgent.id ? updatedAgent : agent
    );
    setAgents(updatedAgents);
    toast({
      title: 'Agent Updated',
      description: `${updatedAgent.name} has been updated.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateDraft = (updatedDraft: Draft) => {
    const updatedDrafts = drafts.map((draft) =>
      draft.id === updatedDraft.id ? updatedDraft : draft
    );
    setDrafts(updatedDrafts);
  };

  const unreadDraftsCount = drafts.filter((draft) => !draft.isRead).length;

  // Drag and Drop setup
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.AGENT,
    drop: (item: Agent) => {
      setMainAgent(item);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
      toast({
        title: 'Automation Started',
        description: `Email automation started with ${item.name}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const renderMainContent = () => {
    switch (activeView) {
      case 'agents':
        return (
          <Box p={6}>
            {/* Hero Section with Agent Image and Speech Bubble */}
            <Flex
              align="center"
              justify="center"
              mb={8}
              position="relative"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Image
                src={agentImage}
                alt="Agent"
                boxSize={{ base: '150px', md: '200px' }}
                mr={{ base: 0, md: 4 }}
                mb={{ base: 4, md: 0 }}
              />
              {/* Speech Bubble */}
              <Box
                bg="blue.100"
                p={4}
                borderRadius="md"
                position="relative"
                _after={{
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '-10px',
                  transform: 'translateY(-50%)',
                  borderWidth: '10px',
                  borderStyle: 'solid',
                  borderColor: 'transparent blue.100 transparent transparent',
                }}
              >
                <Text fontSize="lg" color="gray.700">
                  Dobrodošli na AI Email Agent Dashboard!
                </Text>
              </Box>
            </Flex>
            {/* Toggle Color Mode */}
            <Box textAlign="right" mb={4}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </Box>
            {/* Agents Section */}
            <Heading size="lg" mb={4}>
              Agenti
            </Heading>
            <Grid
              templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
              gap={6}
            >
              {agents.map((agent) => (
                <GridItem key={agent.id}>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    bg={mainAgent?.id === agent.id ? 'blue.50' : 'white'}
                    _hover={{ shadow: 'md' }}
                    maxW="250px" // Ograničena širina kartice
                    mx="auto"
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Image
                        src={agentImage}
                        alt="Agent Icon"
                        boxSize="40px"
                        mr={2}
                      />
                      <Heading size="md" isTruncated>
                        {agent.name}
                      </Heading>
                    </Box>
                    <Text fontSize="sm" color="gray.500">
                      PDFs:
                    </Text>
                    {agent.pdfs.map((pdf, index) => (
                      <Text key={index} fontSize="sm" color="gray.600">
                        {pdf}
                      </Text>
                    ))}
                    {/* Draggable agent */}
                    <Box mt={4}>
                      <DraggableAgent agent={agent} />
                    </Box>
                  </Box>
                </GridItem>
              ))}
            </Grid>
            {/* Drop area for automation */}
            <Box
              ref={drop}
              w="100%"
              h="200px"
              mt={8}
              p={4}
              borderWidth="2px"
              borderStyle="dashed"
              borderColor={isOver ? 'green.500' : 'gray.300'}
              borderRadius="lg"
              bg={isOver ? 'green.50' : 'gray.50'}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="lg" color="gray.700" mb={2}>
                Prevucite agenta ovdje za pokretanje automatizacije
              </Text>
              {mainAgent && (
                <Box textAlign="center">
                  <Heading size="md">
                    Trenutni glavni agent: {mainAgent.name}
                  </Heading>
                  <Button
                    colorScheme="blue"
                    mt={2}
                    onClick={() => {
                      setShowCelebration(true);
                      setTimeout(() => setShowCelebration(false), 5000);
                      toast({
                        title: 'Automatizacija pokrenuta',
                        description: `Email automatizacija pokrenuta s agentom ${mainAgent.name}.`,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    Pokreni automatizaciju
                  </Button>
                </Box>
              )}
            </Box>
            {showCelebration && <Confetti />}
          </Box>
        );
      case 'drafts':
        return (
          <Box p={6}>
            <Heading size="lg" mb={4}>
              Draftovi
            </Heading>
            <Grid
              templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
              gap={6}
            >
              {drafts.map((draft) => (
                <GridItem key={draft.id}>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    bg={draft.isRead ? 'white' : 'yellow.50'}
                    cursor="pointer"
                    _hover={{ shadow: 'md' }}
                    onClick={() => {
                      setSelectedDraft(draft);
                      setIsDraftModalOpen(true);
                      if (!draft.isRead) {
                        const updatedDraft = { ...draft, isRead: true };
                        handleUpdateDraft(updatedDraft);
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Image
                        src="/draft-icon.png"
                        alt="Draft Icon"
                        boxSize="40px"
                        mr={2}
                      />
                      <Heading size="md" isTruncated>
                        {draft.title}
                      </Heading>
                    </Box>
                    <Text fontSize="sm" color="gray.500">
                      Kreirano od: {draft.agent}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Za: {draft.recipient}
                    </Text>
                    {!draft.isRead && (
                      <Text fontSize="xs" color="red.500">
                        Novo
                      </Text>
                    )}
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      display="flex"
      h="100vh"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.900'}
    >
      <Sidebar
        user={user}
        agents={agents}
        activeView={activeView}
        setActiveView={setActiveView}
        setSelectedAgent={setSelectedAgent}
        setIsAgentModalOpen={setIsAgentModalOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        unreadDraftsCount={unreadDraftsCount}
      />
      {/* Main content */}
      <Box flex="1" overflowY="auto">
        {renderMainContent()}
      </Box>

      {/* Modals */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        handleCreateAgent={handleCreateAgent}
        handleUpdateAgent={handleUpdateAgent}
      />
      <DraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        selectedDraft={selectedDraft}
        setSelectedDraft={setSelectedDraft}
        handleUpdateDraft={handleUpdateDraft}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Box>
  );
};

export default Dashboard;
