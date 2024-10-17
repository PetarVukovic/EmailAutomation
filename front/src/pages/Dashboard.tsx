// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AgentModal from '../components/AgentModal';
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
  Stack,
  Select,
  Switch,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  OrderedList,
  ListItem,
  keyframes,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { User, Agent, ItemTypes } from '../types';
import Confetti from 'react-confetti';
import { useDrop } from 'react-dnd';
import DraggableAgent from '../components/DraggableAgent';
import agentImage from '../assets/agent.png';
import gearImage from '../assets/gear.png'; // Importirali smo sliku zupčanika

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'General Assistant', pdfs: ['general_info.pdf'] },
    { id: 2, name: 'Sales Agent', pdfs: ['sales_playbook.pdf'] },
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mainAgent, setMainAgent] = useState<Agent | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [fetchInterval, setFetchInterval] = useState<number>(15);
  const [replyTone, setReplyTone] = useState<string>('Prijateljski');
  const [autoReply, setAutoReply] = useState<boolean>(false);
  const [automationRunning, setAutomationRunning] = useState<boolean>(false); // Novo stanje
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Animacija za sliku agenta
  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  `;

  // Animacija za zupčanike
  const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;

  // Drag and Drop setup
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.AGENT,
    drop: (item: Agent) => {
      setMainAgent(item);
      toast({
        title: 'Agent odabran',
        description: `Odabrali ste ${item.name} kao glavnog agenta.`,
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const handleStartAutomation = () => {
    setShowCelebration(true);
    setAutomationRunning(true); // Postavi da je automatizacija pokrenuta
    setTimeout(() => setShowCelebration(false), 5000);
    toast({
      title: 'Automatizacija pokrenuta',
      description: `Email automatizacija pokrenuta s agentom ${mainAgent?.name}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Funkcija za zaustavljanje automatizacije (opcionalno)
  const handleStopAutomation = () => {
    setAutomationRunning(false);
    toast({
      title: 'Automatizacija zaustavljena',
      description: 'Email automatizacija je zaustavljena.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Funkcija za kreiranje novog agenta
  const handleCreateAgent = (newAgent: Agent) => {
    setAgents([...agents, newAgent]);
    toast({
      title: 'Agent stvoren',
      description: `${newAgent.name} je dodan.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Funkcija za ažuriranje postojećeg agenta
  const handleUpdateAgent = (updatedAgent: Agent) => {
    const updatedAgents = agents.map((agent) =>
      agent.id === updatedAgent.id ? updatedAgent : agent
    );
    setAgents(updatedAgents);
    toast({
      title: 'Agent ažuriran',
      description: `${updatedAgent.name} je ažuriran.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div
      className={`flex h-screen ${colorMode === 'light' ? 'bg-gray-100' : 'bg-gray-900'
        }`}
    >
      <Sidebar
        user={user}
        agents={agents}
        activeView="agents"
        setActiveView={() => { }}
        setSelectedAgent={setSelectedAgent}
        setIsAgentModalOpen={setIsAgentModalOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        unreadDraftsCount={0}
      />
      {/* Glavni sadržaj */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Toggle Color Mode */}
        <Box textAlign="right" mb={4}>
          <IconButton
            aria-label="Promijeni temu"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
        </Box>
        <Stack spacing={8}>
          {/* Sekcija dobrodošlice */}
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
          >
            <Flex
              align="center"
              justify="space-between"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box maxW="600px" mr={{ md: 8 }}>
                <Heading mb={4}>Dobrodošli u AI Email Agent Dashboard</Heading>
                <Text fontSize="lg" mb={6}>
                  Počnite automatizirati svoje emailove uz pomoć naših AI agenata.
                  Agenti automatski stvaraju draftove ili odgovaraju na emailove u
                  skladu s vašim preferencijama.
                </Text>
                {/* 4 koraka za pokretanje automatizacije */}
                <OrderedList spacing={3}>
                  <ListItem>Odaberite agenta iz liste ili stvorite novog.</ListItem>
                  <ListItem>Postavite preferencije automatizacije u nastavku.</ListItem>
                  <ListItem>Kliknite na "Pokreni automatizaciju" za početak.</ListItem>
                  <ListItem>
                    Pratite i upravljajte emailovima kroz dashboard.
                  </ListItem>
                </OrderedList>
              </Box>
              {/* Animirana slika agenta s oblakom */}
              <Box
                position="relative"
                mt={{ base: 8, md: 0 }}
                animation={`${float} 4s ease-in-out infinite`}
              >
                <Image
                  src={agentImage}
                  alt="Agent"
                  boxSize={{ base: '200px', md: '250px' }}
                  mx="auto"
                />
                {/* Oblak s porukom */}
                <Box
                  position="absolute"
                  top="50%"
                  left="100%"
                  transform="translate(-50%, -50%)"
                  bg="blue.100"
                  p={4}
                  borderRadius="md"
                  boxShadow="md"
                  maxW="200px"
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
                  <Text fontSize="md" color="gray.700">
                    Pozdrav! Spreman sam pomoći.
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Box>
          {/* Sekcija agenata */}
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
          >
            <Heading size="lg" mb={4}>
              Vaši agenti
            </Heading>
            <Text mb={4}>
              Ovdje su vaši AI agenti s pripadajućom bazom znanja.
            </Text>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
              {agents.map((agent) => (
                <GridItem key={agent.id}>
                  <Box
                    p={4}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    bg={mainAgent?.id === agent.id ? 'blue.50' : 'white'}
                    _hover={{ shadow: 'md' }}
                    maxW="250px"
                    mx="auto"
                    onClick={() => setMainAgent(agent)}
                    cursor="pointer"
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      <Image
                        src={agentImage}
                        alt="Agent Icon"
                        boxSize="50px"
                        mr={2}
                      />
                      <Heading size="md" isTruncated>
                        {agent.name}
                      </Heading>
                    </Box>
                    <Text fontSize="sm" color="gray.500">
                      Baza znanja:
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
          </Box>
          {/* Sekcija za pokretanje automatizacije */}
          <Box
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg={colorMode === 'light' ? 'white' : 'gray.700'}
          >
            <Flex
              align="center"
              justify="space-between"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box flex="1" mr={{ md: 4 }}>
                <Heading size="lg" mb={4}>
                  Postavke automatizacije
                </Heading>
                <Text mb={4}>
                  Podesite postavke automatizacije prije pokretanja.
                </Text>
                {automationRunning && (
                  <Text fontSize="md" color="green.500" mb={4}>
                    Automatizacija je pokrenuta.
                  </Text>
                )}
                <Box
                  ref={drop}
                  p={6}
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor={isOver ? 'green.500' : 'gray.300'}
                  borderRadius="lg"
                  bg={isOver ? 'green.50' : 'gray.50'}
                >
                  <Stack spacing={4}>
                    <FormControl>
                      <FormLabel>Odabrani agent</FormLabel>
                      {mainAgent ? (
                        <Text fontWeight="bold">{mainAgent.name}</Text>
                      ) : (
                        <Text fontStyle="italic" color="gray.500">
                          Prevucite agenta ovdje ili kliknite na agenta za odabir.
                        </Text>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Učestalost dohvaćanja (u minutama)</FormLabel>
                      <NumberInput
                        min={1}
                        max={60}
                        value={fetchInterval}
                        onChange={(valueString) =>
                          setFetchInterval(Number(valueString))
                        }
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Ton odgovora</FormLabel>
                      <Select
                        value={replyTone}
                        onChange={(e) => setReplyTone(e.target.value)}
                      >
                        <option value="Prijateljski">Prijateljski</option>
                        <option value="Formalni">Formalni</option>
                        <option value="Neformalni">Neformalni</option>
                      </Select>
                    </FormControl>
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="auto-reply" mb="0">
                        Automatski odgovori
                      </FormLabel>
                      <Switch
                        id="auto-reply"
                        isChecked={autoReply}
                        onChange={(e) => setAutoReply(e.target.checked)}
                      />
                    </FormControl>
                    <Button
                      colorScheme="blue"
                      onClick={handleStartAutomation}
                      isDisabled={!mainAgent || automationRunning}
                    >
                      Pokreni automatizaciju
                    </Button>
                    {automationRunning && (
                      <Button
                        colorScheme="red"
                        onClick={handleStopAutomation}
                        mt={2}
                      >
                        Zaustavi automatizaciju
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Box>
              {/* Slika zupčanika */}
              <Box mt={{ base: 8, md: 0 }}>
                <Image
                  src={gearImage}
                  alt="Postavke"
                  boxSize={{ base: '150px', md: '200px' }}
                  animation={
                    automationRunning
                      ? `${spin} 4s linear infinite`
                      : undefined
                  }
                />
              </Box>
            </Flex>
          </Box>
        </Stack>
        {showCelebration && <Confetti />}
      </div>

      {/* Modali */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        handleCreateAgent={handleCreateAgent}
        handleUpdateAgent={handleUpdateAgent}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
