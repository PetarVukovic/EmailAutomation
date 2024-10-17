import React from 'react';
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
import { Divider, Badge } from '@chakra-ui/react';
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
  return (
    <div
      className={`${sidebarOpen ? 'w-80' : 'w-28'
        } bg-white shadow-md transition-all duration-300`} // Increased width
    >
      <div className="flex items-center justify-between p-6 border-b">
        {sidebarOpen && (
          <div>
            <h1 className="text-2xl font-bold">AI Email Assistant</h1> {/* Increased font size */}
            <p className="text-lg text-gray-600 mt-1">
              Welcome, {user.name || user.email}
            </p>
          </div>
        )}
        <button
          className="p-3 rounded hover:bg-gray-200 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-6 h-6" />
          ) : (
            <ChevronRight className="w-6 h-6" />
          )}
        </button>
      </div>
      <nav className="mt-6">
        <button
          className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
            } w-full px-6 py-3 text-left hover:bg-gray-200 transition ${activeView === 'agents' ? 'bg-gray-200 font-semibold' : ''
            }`} // Increased padding
          onClick={() => setActiveView('agents')}
        >
          <UserIcon className="w-6 h-6" />  {/* Increased icon size */}
          {sidebarOpen && <span className="text-lg">Agents</span>}  {/* Increased font size */}
        </button>
        {sidebarOpen && (
          <div className="px-6 py-3">
            <p className="text-sm text-gray-500 uppercase">Your Agents</p>
          </div>
        )}
        {agents.map((agent) => (
          <button
            key={agent.id}
            className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
              } w-full px-6 py-3 text-left text-lg text-gray-700 hover:bg-gray-200 transition`} // Increased padding and font size
            onClick={() => {
              setSelectedAgent(agent);
              setIsAgentModalOpen(true);
            }}
          >
            <File className="w-5 h-5" />  {/* Keep icon size consistent */}
            {sidebarOpen && <span>{agent.name}</span>}
          </button>
        ))}
        <button
          className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
            } w-full px-6 py-3 text-left text-lg text-blue-600 hover:bg-blue-50 transition`}  // Increased padding and font size
          onClick={() => {
            setSelectedAgent(null);
            setIsAgentModalOpen(true);
          }}
        >
          <Plus className="w-6 h-6" />  {/* Increased icon size */}
          {sidebarOpen && <span>New Agent</span>}
        </button>
        <Divider my={6} />
        <button
          className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
            } w-full px-6 py-3 text-left hover:bg-gray-200 transition ${activeView === 'drafts' ? 'bg-gray-200 font-semibold' : ''
            }`}  // Increased padding and font size
          onClick={() => setActiveView('drafts')}
        >
          <div className="relative">
            <FileText className="w-6 h-6" />  {/* Increased icon size */}
            {unreadDraftsCount > 0 && (
              <Badge
                colorScheme="red"
                variant="solid"
                className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                borderRadius="full"
              >
                {unreadDraftsCount}
              </Badge>
            )}
          </div>
          {sidebarOpen && <span className="text-lg">Drafts</span>}  {/* Increased font size */}
        </button>
        <Divider my={6} />
        <button
          className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
            } w-full px-6 py-3 text-left hover:bg-gray-200 transition`}  // Increased padding
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="w-6 h-6" />  {/* Increased icon size */}
          {sidebarOpen && <span className="text-lg">Settings</span>}  {/* Increased font size */}
        </button>
        <button
          className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'
            } w-full px-6 py-3 text-left hover:bg-gray-200 transition`}  // Increased padding
          onClick={onLogout}
        >
          <LogOut className="w-6 h-6" />  {/* Increased icon size */}
          {sidebarOpen && <span className="text-lg">Logout</span>}  {/* Increased font size */}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
