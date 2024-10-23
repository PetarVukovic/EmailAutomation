// Sidebar.tsx

import React from 'react';
import {
  Box,
  IconButton,
  Text,
  Badge,
  useColorModeValue,
  Flex,
  VStack,
  Divider,
  Button,
} from '@chakra-ui/react';
import {
  User as UserIcon,
  Plus,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  File,
} from 'lucide-react';
import { User, Agent } from '../types';

interface SidebarProps {
  user: User;
  agents: Agent[];
  activeView: 'agents' | 'drafts';
  setActiveView: React.Dispatch<React.SetStateAction<'agents' | 'drafts'>>;
  setSelectedAgent: React.Dispatch<React.SetStateAction<Agent | null>>;
  setIsAgentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  unreadDraftsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  user,
  agents,
  activeView,
  setActiveView,
  setSelectedAgent,
  setIsAgentModalOpen,
  setIsSettingsOpen,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  unreadDraftsCount,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBgColor = useColorModeValue('gray.200', 'gray.600');
  const borderColor = useColorModeValue('orange.300', 'orange.600'); // Light orange color
  const borderRadius = 'lg';
  const sidebarWidth = sidebarOpen ? '300px' : '100px'; // Increased width
  const fontSize = 'lg'; // Increased font size

  return (
    <Box
      width={sidebarWidth}
      bg={bgColor}
      borderWidth="2px"
      borderColor={borderColor}
      borderRadius={borderRadius}
      transition="width 0.3s"
      overflow="hidden"
      m={4} // Margins around the sidebar
    >
      <Flex
        align="center"
        justify="space-between"
        p={4}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        {sidebarOpen && (
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              AI Email Assistant
            </Text>
            <Text fontSize="lg" color={textColor}>
              Welcome, {user.name || user.email}
            </Text>
          </Box>
        )}
        <IconButton
          aria-label="Toggle sidebar"
          icon={sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="ghost"
          size="lg"
        />
      </Flex>
      <VStack align="stretch" spacing={1}>
        <Button
          variant="ghost"
          justifyContent={sidebarOpen ? 'flex-start' : 'center'}
          leftIcon={<UserIcon size={24} />}
          onClick={() => setActiveView('agents')}
          fontWeight={activeView === 'agents' ? 'bold' : 'normal'}
          bg={activeView === 'agents' ? activeBgColor : 'transparent'}
          _hover={{ bg: hoverBgColor }}
          pl={sidebarOpen ? 4 : 0}
          fontSize={fontSize}
          height="60px"
        >
          {sidebarOpen && 'Agents'}
        </Button>
        {sidebarOpen && (
          <Box pl={4} pt={2} pb={2}>
            <Text fontSize="md" color={textColor} textTransform="uppercase">
              Your Agents
            </Text>
          </Box>
        )}
        {agents.map((agent) => (
          <Button
            key={agent.id}
            variant="ghost"
            justifyContent={sidebarOpen ? 'flex-start' : 'center'}
            leftIcon={<File size={20} />}
            onClick={() => {
              setSelectedAgent(agent);
              setIsAgentModalOpen(true);
            }}
            pl={sidebarOpen ? 8 : 0}
            _hover={{ bg: hoverBgColor }}
            fontSize={fontSize}
            height="50px"
          >
            {sidebarOpen && agent.name}
          </Button>
        ))}
        <Button
          variant="ghost"
          justifyContent={sidebarOpen ? 'flex-start' : 'center'}
          leftIcon={<Plus size={20} />}
          onClick={() => {
            setSelectedAgent(null);
            setIsAgentModalOpen(true);
          }}
          pl={sidebarOpen ? 8 : 0}
          colorScheme="blue"
          _hover={{ bg: hoverBgColor }}
          fontSize={fontSize}
          height="50px"
        >
          {sidebarOpen && 'New Agent'}
        </Button>
        <Divider my={4} borderColor={borderColor} />
        <Button
          variant="ghost"
          justifyContent={sidebarOpen ? 'flex-start' : 'center'}
          leftIcon={
            <Box position="relative">
              <FileText size={24} />
              {unreadDraftsCount > 0 && (
                <Badge
                  colorScheme="red"
                  variant="solid"
                  position="absolute"
                  top="-1"
                  right="-1"
                  borderRadius="full"
                >
                  {unreadDraftsCount}
                </Badge>
              )}
            </Box>
          }
          onClick={() => setActiveView('drafts')}
          fontWeight={activeView === 'drafts' ? 'bold' : 'normal'}
          bg={activeView === 'drafts' ? activeBgColor : 'transparent'}
          _hover={{ bg: hoverBgColor }}
          pl={sidebarOpen ? 4 : 0}
          fontSize={fontSize}
          height="60px"
        >
          {sidebarOpen && 'Drafts'}
        </Button>
        <Divider my={4} borderColor={borderColor} />
        <Button
          variant="ghost"
          justifyContent={sidebarOpen ? 'flex-start' : 'center'}
          leftIcon={<Settings size={24} />}
          onClick={() => setIsSettingsOpen(true)}
          _hover={{ bg: hoverBgColor }}
          pl={sidebarOpen ? 4 : 0}
          fontSize={fontSize}
          height="60px"
        >
          {sidebarOpen && 'Settings'}
        </Button>
        <Button
          variant="ghost"
          justifyContent={sidebarOpen ? 'flex-start' : 'center'}
          leftIcon={<LogOut size={24} />}
          onClick={onLogout}
          _hover={{ bg: hoverBgColor }}
          pl={sidebarOpen ? 4 : 0}
          fontSize={fontSize}
          height="60px"
        >
          {sidebarOpen && 'Logout'}
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
