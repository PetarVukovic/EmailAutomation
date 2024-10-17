// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AgentModal from '../components/AgentModal';
import SettingsModal from '../components/SettingsModal';
import Lottie from 'lottie-react';
import agentAnimationData from '../animations/agent.json';
import spinner from '../animations/spinner2.json'
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
  useColorModeValue,
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
  ScaleFade,
  Icon,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { User, Agent, ItemTypes } from '../types';
import { useDrop } from 'react-dnd';
import DraggableAgent from '../components/DraggableAgent';
import agentImage from '../assets/agent.png';
import RocketAnimation from '../components/RocketAnimation';
import GearAnimation from '../components/GearAnimation';
import { FaRobot, FaCogs, FaPlay, FaEnvelope } from 'react-icons/fa';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'General Assistant', pdfs: ['general_info.pdf'] },
    { id: 2, name: 'Sales Agent', pdfs: ['sales_playbook.pdf'] },
  ]);
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mainAgent, setMainAgent] = useState<Agent | null>(null);
  const [fetchInterval, setFetchInterval] = useState<number>(15);
  const [replyTone, setReplyTone] = useState<string>('Prijateljski');
  const [autoReply, setAutoReply] = useState<boolean>(false);
  const [automationRunning, setAutomationRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showRocket, setShowRocket] = useState<boolean>(false);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Define color values using useColorModeValue at the top level
  const bgColor = useColorModeValue('white', 'gray.700');
  const headingColor = useColorModeValue('blue.600', 'blue.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = 'blue.300'; // Assuming this doesn't change with color mode
  const agentBgColor = useColorModeValue('white', 'gray.800');
  const agentSelectedBgColor = useColorModeValue('blue.50', 'blue.900');
  const dropZoneBgColor = useColorModeValue('gray.50', 'gray.800');
  const pageBgColor = useColorModeValue('gray.100', 'gray.900');

  // Animations
  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  `;


  // Prikaz sekcija jedna po jedna
  useEffect(() => {
    if (currentStep < 3) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);



  // Simulate data loading for 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);


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
    setAutomationRunning(true);
    setShowRocket(true);
    toast({
      title: 'Automatizacija pokrenuta',
      description: `Email automatizacija pokrenuta s agentom ${mainAgent?.name}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

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

  if (loading) {
    // Show spinner while loading
    return (
      <Flex justify="center" align="center" height="100vh" bg={bgColor}>
        <Box w="200px" h="200px">
          <Lottie
            animationData={spinner} // Your Lottie spinner animation data
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      </Flex>
    );
  };


  return (
    <Flex
      direction="row"
      h="100vh"
      bg={pageBgColor}
      position="relative"
    >
      {showRocket && (
        <RocketAnimation onAnimationComplete={() => setShowRocket(false)} />
      )}
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
      <Box flex="1" overflowY="auto" p={6}>
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
          {currentStep >= 1 && (
            <ScaleFade initialScale={0.9} in={currentStep >= 1}>
              <Box
                p={6}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="md"
                bg={bgColor}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                  <Box
                    maxW="600px"
                    mr={{ md: 8 }}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg={bgColor}
                  >
                    <Heading mb={4} color={headingColor} fontSize="2xl">
                      Dobrodošli u{' '}
                      <Text as="span" fontWeight="bold">
                        AI Email Agent Dashboard
                      </Text>
                    </Heading>
                    <Text fontSize="lg" mb={6} color={textColor}>
                      Počnite automatizirati svoje emailove uz pomoć naših AI agenata. Agenti
                      automatski stvaraju draftove ili odgovaraju na emailove u skladu s{' '}
                      <Text as="span" fontWeight="bold">
                        vašim preferencijama
                      </Text>
                      .
                    </Text>

                    <Text
                      fontSize="md"
                      color={headingColor}
                      fontWeight="bold"
                      mb={4}
                    >
                      4 jednostavna koraka za pokretanje automatizacije:
                    </Text>

                    <OrderedList spacing={4} color={textColor} fontSize="lg">
                      <ListItem display="flex" alignItems="center">
                        <Icon as={FaRobot} color="blue.500" boxSize={5} mr={2} />
                        <Text as="span" fontWeight="bold">
                          Odaberite agenta
                        </Text>{' '}
                        iz liste ili stvorite novog.
                      </ListItem>
                      <ListItem display="flex" alignItems="center">
                        <Icon as={FaCogs} color="green.500" boxSize={5} mr={2} />
                        <Text as="span" fontWeight="bold">
                          Postavite preferencije
                        </Text>{' '}
                        automatizacije u nastavku.
                      </ListItem>
                      <ListItem display="flex" alignItems="center">
                        <Icon as={FaPlay} color="orange.500" boxSize={5} mr={2} />
                        Kliknite na{' '}
                        <Text as="span" fontWeight="bold">
                          "Pokreni automatizaciju"
                        </Text>{' '}
                        za početak.
                      </ListItem>
                      <ListItem display="flex" alignItems="center">
                        <Icon as={FaEnvelope} color="red.500" boxSize={5} mr={2} />
                        <Text as="span" fontWeight="bold">
                          Pratite i upravljajte emailovima
                        </Text>{' '}
                        kroz dashboard.
                      </ListItem>
                    </OrderedList>
                  </Box>
                  {/* Animirana slika agenta s oblakom */}
                  <Box
                    position="relative"
                    mt={{ base: 8, md: 0 }}
                    animation={`${float} 4s ease-in-out infinite`}
                  >
                    <Box mx="auto" boxSize={{ base: '290px', md: '350px' }}>
                      <Lottie
                        animationData={agentAnimationData}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </ScaleFade>
          )}
          {/* Sekcija agenata */}
          {currentStep >= 2 && (
            <ScaleFade initialScale={0.9} in={currentStep >= 2}>
              <Box
                p={6}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="md"
                bg={bgColor}
              >
                <Heading size="lg" mb={4} color={headingColor}>
                  Vaši agenti
                </Heading>
                <Text mb={4} color={textColor}>
                  Ovdje su vaši AI agenti s pripadajućom bazom znanja.
                </Text>
                <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6}>
                  {agents.map((agent) => (
                    <GridItem key={agent.id}>
                      <Box
                        p={4}
                        borderWidth="2px"
                        borderColor={borderColor}
                        borderRadius="lg"
                        overflow="hidden"
                        bg={
                          mainAgent?.id === agent.id
                            ? agentSelectedBgColor
                            : agentBgColor
                        }
                        _hover={{ shadow: 'md' }}
                        maxW="250px"
                        mx="auto"
                        onClick={() => setMainAgent(agent)}
                        cursor="pointer"
                      >
                        <Box display="flex" alignItems="center" mb={2}>
                          <Image src={agentImage} alt="Agent Icon" boxSize="50px" mr={2} />
                          <Heading size="md" isTruncated color={headingColor}>
                            {agent.name}
                          </Heading>
                        </Box>
                        <Text fontSize="sm" color={subTextColor}>
                          Baza znanja:
                        </Text>
                        {agent.pdfs.map((pdf, index) => (
                          <Text key={index} fontSize="sm" color={textColor}>
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
            </ScaleFade>
          )}
          {/* Sekcija za pokretanje automatizacije */}
          {currentStep >= 3 && (
            <ScaleFade initialScale={0.9} in={currentStep >= 3}>
              <Box
                p={6}
                borderWidth="2px"
                borderColor={borderColor}
                borderRadius="lg"
                boxShadow="md"
                bg={bgColor}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  flexDirection={{ base: 'column', md: 'row' }}
                >
                  <Box flex="1" mr={{ md: 4 }}>
                    <Heading size="lg" mb={4} color={headingColor}>
                      Postavke automatizacije
                    </Heading>
                    <Text mb={4} color={textColor}>
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
                      borderColor={isOver ? 'green.500' : borderColor}
                      borderRadius="lg"
                      bg={isOver ? 'green.50' : dropZoneBgColor}
                      maxW="600px"
                    >
                      <Stack spacing={4}>
                        <FormControl>
                          <FormLabel>Odabrani agent</FormLabel>
                          {mainAgent ? (
                            <Text fontWeight="bold">{mainAgent.name}</Text>
                          ) : (
                            <Text fontStyle="italic" color={subTextColor}>
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
                            <option value="Automatski">Automatski odabir tona</option>
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
                  {/* Animacija zupčanika */}
                  <Box mt={{ base: 8, md: 0 }}>
                    <GearAnimation isSpinning={automationRunning} />
                  </Box>
                </Flex>
              </Box>
            </ScaleFade>
          )}
        </Stack>
      </Box>

      {/* Modali */}
      <AgentModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        handleCreateAgent={handleCreateAgent}
        handleUpdateAgent={handleUpdateAgent}
      />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </Flex>
  );
};

export default Dashboard;
