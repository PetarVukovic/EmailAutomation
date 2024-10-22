// Dashboard.tsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import AgentModal from '../components/AgentModal';
import SettingsModal from '../components/SettingsModal';
import Lottie from 'lottie-react';
import agentAnimationData from '../animations/agent.json';
import spinner from '../animations/spinner2.json';
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
  Icon,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { User, Agent, ItemTypes, Draft } from '../types';
import { useDrop } from 'react-dnd';
import DraggableAgent from '../components/DraggableAgent';
import agentImage from '../assets/agent.png';
import RocketAnimation from '../components/RocketAnimation';
import GearAnimation from '../components/GearAnimation';
import { FaRobot, FaCogs, FaPlay, FaEnvelope, FaVideo } from 'react-icons/fa';
import DraftModal from '../components/DraftModal';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [agents, setAgents] = useState<Agent[]>([
    { id: 1, name: 'General Assistant', pdfs: ['general_info.pdf'] },
    { id: 2, name: 'Sales Agent', pdfs: ['sales_playbook.pdf'] },
  ]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mainAgent, setMainAgent] = useState<Agent | null>(null);
  const [fetchInterval, setFetchInterval] = useState<number>(15);
  const [replyTone, setReplyTone] = useState<string>('Friendly');
  const [autoReply, setAutoReply] = useState<boolean>(false);
  const [automationRunning, setAutomationRunning] = useState<boolean>(false);
  const [showRocket, setShowRocket] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'agents' | 'drafts'>('agents');

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Define color values using useColorModeValue
  const bgColor = useColorModeValue('white', 'gray.800'); // White background
  const headingColor = useColorModeValue('orange.600', 'orange.300'); // Orange headings
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const subTextColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('orange.300', 'orange.600'); // Orange border
  const agentBgColor = useColorModeValue('white', 'gray.800');
  const agentSelectedBgColor = useColorModeValue('orange.50', 'orange.900'); // Light orange selection
  const dropZoneBgColor = useColorModeValue('gray.50', 'gray.800');
  const pageBgColor = useColorModeValue('gray.100', 'gray.900');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const borderRadius = 'lg';

  // Dummy data for drafts
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: 1,
      sender: 'aiassistant@example.com',
      recipient: 'john.doe@example.com',
      subject: 'Re: Meeting Agenda',
      content:
        'Dear John,\n\nPlease find attached the agenda for our upcoming meeting. Let me know if you have any questions.\n\nBest regards,\nAI Assistant',
      unread: true,
    },
    {
      id: 2,
      sender: 'aiassistant@example.com',
      recipient: 'jane.smith@example.com',
      subject: 'Re: Project Update',
      content:
        'Hello Jane,\n\nHere is the latest update on the project. We have made significant progress this week.\n\nKind regards,\nAI Assistant',
      unread: false,
    },
  ]);
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);

  // Video Modal
  const { isOpen: isVideoOpen, onOpen: onVideoOpen, onClose: onVideoClose } =
    useDisclosure();

  // Animations
  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  `;

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Function to handle updating a draft
  const handleUpdateDraft = (updatedDraft: Draft) => {
    const updatedDrafts = drafts.map((draft) =>
      draft.id === updatedDraft.id ? updatedDraft : draft
    );
    setDrafts(updatedDrafts);
    toast({
      title: 'Email Sent',
      description: `Your email to ${updatedDraft.recipient} has been sent.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Drag and Drop setup
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.AGENT,
    drop: (item: Agent) => {
      setMainAgent(item);
      toast({
        title: 'Agent Selected',
        description: `You have selected ${item.name} as the main agent.`,
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
      title: 'Automation Started',
      description: `Email automation started with agent ${mainAgent?.name}.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleStopAutomation = () => {
    setAutomationRunning(false);
    toast({
      title: 'Automation Stopped',
      description: 'Email automation has been stopped.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // Function to create a new agent
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

  // Function to update an existing agent
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

  if (loading) {
    // Show spinner while loading
    return (
      <Flex justify="center" align="center" height="100vh" bg={bgColor}>
        <Box w="200px" h="200px">
          <Lottie
            animationData={spinner}
            loop={true}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="row" h="100vh" bg={pageBgColor} position="relative">
      {showRocket && (
        <Flex
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          bg="rgba(0, 0, 0, 0.5)"
          zIndex={10}
        >
          <RocketAnimation
            onAnimationComplete={() => setShowRocket(false)}
            size={400} // Ovdje možete prilagoditi veličinu rakete
          />
        </Flex>
      )}
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
        unreadDraftsCount={drafts.filter((draft) => draft.unread).length}
      />
      {/* Glavni sadržaj */}
      <Box
        flex="1"
        overflowY="auto"
        p={6}
        m={4} // Margine oko glavnog prozora
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="lg"
        bg={bgColor}
      >
        {/* Gornja navigacija */}
        <Flex justify="space-between" align="center" mb={4}>
          <Button
            leftIcon={<FaVideo />}
            onClick={onVideoOpen}
            size="lg"
            fontSize="xl"
            variant="link"
            color={headingColor}
          >
            <Text fontSize="xl" fontWeight="bold">
              Pogledaj kako se aplikacija koristi
            </Text>
          </Button>
          <IconButton
            aria-label="Toggle theme"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="lg"
          />
        </Flex>
        <Stack spacing={8}>
          {activeView === 'agents' && (
            <Box>
              {/* Combined Sections */}
              <Flex direction="column" gap={8}>
                {/* Welcome Section */}
                <Flex
                  align="center"
                  justify="space-between"
                  flexDirection={{ base: 'column', md: 'row' }}
                  gap={4}
                >
                  {/* Left Side */}
                  <Box
                    maxW="600px"
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg={bgColor}
                  >
                    <Heading mb={4} color={headingColor} fontSize="3xl">
                      Welcome to{' '}
                      <Text as="span" fontWeight="bold">
                        AI Email Agent Dashboard
                      </Text>
                    </Heading>
                    <Text fontSize="xl" mb={6} color={textColor}>
                      Start automating your emails with the help of our AI agents.
                      Agents automatically create drafts or respond to emails in
                      accordance with{' '}
                      <Text as="span" fontWeight="bold">
                        your preferences
                      </Text>
                      .
                    </Text>

                    <Text
                      fontSize="lg"
                      color={headingColor}
                      fontWeight="bold"
                      mb={4}
                    >
                      4 simple steps to start automation:
                    </Text>

                    <OrderedList spacing={4} color={textColor} fontSize="xl">
                      <ListItem display="flex" alignItems="center">
                        <Icon
                          as={FaRobot}
                          color="blue.500"
                          boxSize={7}
                          mr={2}
                        />
                        <Text as="span" fontWeight="bold">
                          Select an agent
                        </Text>{' '}
                        from the list or create a new one.
                      </ListItem>
                      <ListItem display="flex" alignItems="center">
                        <Icon
                          as={FaCogs}
                          color="green.500"
                          boxSize={7}
                          mr={2}
                        />
                        <Text as="span" fontWeight="bold">
                          Set automation preferences
                        </Text>{' '}
                        below.
                      </ListItem>
                      <ListItem display="flex" alignItems="center">
                        <Icon
                          as={FaPlay}
                          color="orange.500"
                          boxSize={7}
                          mr={2}
                        />
                        Click on{' '}
                        <Text as="span" fontWeight="bold">
                          "Start Automation"
                        </Text>{' '}
                        to begin.
                      </ListItem>
                      <ListItem display="flex" alignItems="center">
                        <Icon
                          as={FaEnvelope}
                          color="red.500"
                          boxSize={7}
                          mr={2}
                        />
                        <Text as="span" fontWeight="bold">
                          Monitor and manage emails
                        </Text>{' '}
                        through the dashboard.
                      </ListItem>
                    </OrderedList>
                  </Box>
                  {/* Right Side - Agent Animation */}
                  <Box
                    position="relative"
                    animation={`${float} 4s ease-in-out infinite`}
                    flex="1"
                    maxW="500px"
                  >
                    <Box mx="auto" boxSize={{ base: '350px', md: '450px' }}>
                      <Lottie
                        animationData={agentAnimationData}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                  </Box>
                </Flex>
                {/* Agents Section */}
                <Box>
                  <Heading
                    size="lg"
                    mb={4}
                    color={headingColor}
                    fontSize="2xl"
                  >
                    Your Agents
                  </Heading>
                  <Text mb={4} color={textColor} fontSize="lg">
                    Here are your AI agents with their associated knowledge base.
                  </Text>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
                    gap={6}
                  >
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
                          maxW="300px"
                          mx="auto"
                          onClick={() => setMainAgent(agent)}
                          cursor="pointer"
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <Image
                              src={agentImage}
                              alt="Agent Icon"
                              boxSize="70px"
                              mr={4}
                            />
                            <Heading
                              size="md"
                              isTruncated
                              color={headingColor}
                              fontSize="xl"
                            >
                              {agent.name}
                            </Heading>
                          </Box>
                          <Text fontSize="md" color={subTextColor}>
                            Knowledge Base:
                          </Text>
                          {agent.pdfs.map((pdf, index) => (
                            <Text key={index} fontSize="md" color={textColor}>
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
                {/* Automation Settings Section */}
                <Flex
                  align="center"
                  justify="space-between"
                  flexDirection={{ base: 'column', md: 'row' }}
                  gap={4}
                >
                  <Box flex="1" mr={{ md: 4 }}>
                    <Heading
                      size="lg"
                      mb={4}
                      color={headingColor}
                      fontSize="2xl"
                    >
                      Automation Settings
                    </Heading>
                    <Text mb={4} color={textColor} fontSize="lg">
                      Set automation settings before starting.
                    </Text>
                    {automationRunning && (
                      <Text fontSize="lg" color="green.500" mb={4}>
                        Automation is running.
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
                          <FormLabel fontSize="lg">Selected Agent</FormLabel>
                          {mainAgent ? (
                            <Text fontWeight="bold" fontSize="lg">
                              {mainAgent.name}
                            </Text>
                          ) : (
                            <Text
                              fontStyle="italic"
                              color={subTextColor}
                              fontSize="lg"
                            >
                              Drag an agent here or click on an agent to select.
                            </Text>
                          )}
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="lg">
                            Fetch Interval (in minutes)
                          </FormLabel>
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
                          <FormLabel fontSize="lg">Reply Tone</FormLabel>
                          <Select
                            value={replyTone}
                            onChange={(e) => setReplyTone(e.target.value)}
                            fontSize="lg"
                          >
                            <option value="Friendly">Friendly</option>
                            <option value="Formal">Formal</option>
                            <option value="Informal">Informal</option>
                            <option value="Automatic">
                              Automatic Tone Selection
                            </option>
                          </Select>
                        </FormControl>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="auto-reply" mb="0" fontSize="lg">
                            Automatic Replies
                          </FormLabel>
                          <Switch
                            id="auto-reply"
                            isChecked={autoReply}
                            onChange={(e) => setAutoReply(e.target.checked)}
                            size="lg"
                          />
                        </FormControl>
                        <Button
                          colorScheme="blue"
                          onClick={handleStartAutomation}
                          isDisabled={!mainAgent || automationRunning}
                          size="lg"
                        >
                          Start Automation
                        </Button>
                        {automationRunning && (
                          <Button
                            colorScheme="red"
                            onClick={handleStopAutomation}
                            mt={2}
                            size="lg"
                          >
                            Stop Automation
                          </Button>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                  {/* Gear Animation */}
                  <Box mt={{ base: 8, md: 0 }}>
                    <GearAnimation
                      isSpinning={automationRunning}
                      size={250} // Increased size
                    />
                  </Box>
                </Flex>
              </Flex>
            </Box>
          )}
          {activeView === 'drafts' && (
            <Box>
              <Heading
                size="lg"
                mb={4}
                color={headingColor}
                fontSize="2xl"
              >
                Drafts
              </Heading>
              <Text mb={4} color={textColor} fontSize="lg">
                Here are your email drafts.
              </Text>
              <Stack spacing={4}>
                {drafts.map((draft) => (
                  <Box
                    key={draft.id}
                    p={4}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="md"
                    bg={draft.unread ? 'blue.50' : bgColor}
                    _hover={{ bg: hoverBgColor, cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedDraft({ ...draft, unread: false });
                      setIsDraftModalOpen(true);
                      // Mark draft as read
                      const updatedDrafts = drafts.map((d) =>
                        d.id === draft.id ? { ...d, unread: false } : d
                      );
                      setDrafts(updatedDrafts);
                    }}
                  >
                    <Flex align="center" justify="space-between">
                      <Box>
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={textColor}
                        >
                          {draft.subject}
                        </Text>
                        <Text fontSize="md" color={subTextColor}>
                          To: {draft.recipient}
                        </Text>
                      </Box>
                      {draft.unread && (
                        <Badge
                          colorScheme="blue"
                          variant="solid"
                          fontSize="md"
                        >
                          New
                        </Badge>
                      )}
                    </Flex>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Video Modal */}
      <Modal isOpen={isVideoOpen} onClose={onVideoClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={0}>
            {/* Ovdje možeš dodati svoj video sadržaj */}
            <Box width="100%" height="500px" bg="black">
              {/* Prazan video prostor */}
              <Text
                color="white"
                textAlign="center"
                mt={200}
                fontSize="2xl"
                fontWeight="bold"
              >
                Video Tutorial Placeholder
              </Text>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modali */}
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
    </Flex>
  );
};

export default Dashboard;
