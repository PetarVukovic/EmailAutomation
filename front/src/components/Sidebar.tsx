// src/components/Sidebar.tsx

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
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-white shadow-md transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {sidebarOpen && (
          <div>
            <h1 className="text-xl font-bold">AI Email Assistant</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user.name || user.email}
            </p>
          </div>
        )}
        <button
          className="p-2 rounded hover:bg-gray-200 transition"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="mt-4">
        <button
          className={`flex items-center ${
            sidebarOpen ? 'space-x-2' : 'justify-center'
          } w-full px-4 py-2 text-left hover:bg-gray-200 transition ${
            activeView === 'agents' ? 'bg-gray-200 font-semibold' : ''
          }`}
          onClick={() => setActiveView('agents')}
        >
          <UserIcon className="w-5 h-5" />
          {sidebarOpen && <span>Agents</span>}
        </button>
        {sidebarOpen && (
          <div className="px-4 py-2">
            <p className="text-xs text-gray-500 uppercase">Your Agents</p>
          </div>
        )}
        {agents.map((agent) => (
          <button
            key={agent.id}
            className={`flex items-center ${
              sidebarOpen ? 'space-x-2' : 'justify-center'
            } w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-200 transition`}
            onClick={() => {
              setSelectedAgent(agent);
              setIsAgentModalOpen(true);
            }}
          >
            <File className="w-4 h-4" />
            {sidebarOpen && <span>{agent.name}</span>}
          </button>
        ))}
        <button
          className={`flex items-center ${
            sidebarOpen ? 'space-x-2' : 'justify-center'
          } w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 transition`}
          onClick={() => {
            setSelectedAgent(null);
            setIsAgentModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          {sidebarOpen && <span>New Agent</span>}
        </button>
        <Divider my={4} />
        <button
          className={`flex items-center ${
            sidebarOpen ? 'space-x-2' : 'justify-center'
          } w-full px-4 py-2 text-left hover:bg-gray-200 transition ${
            activeView === 'drafts' ? 'bg-gray-200 font-semibold' : ''
          }`}
          onClick={() => setActiveView('drafts')}
        >
          <div className="relative">
            <FileText className="w-5 h-5" />
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
          {sidebarOpen && <span>Drafts</span>}
        </button>
        <Divider my={4} />
        <button
          className={`flex items-center ${
            sidebarOpen ? 'space-x-2' : 'justify-center'
          } w-full px-4 py-2 text-left hover:bg-gray-200 transition`}
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span>Settings</span>}
        </button>
        <button
          className={`flex items-center ${
            sidebarOpen ? 'space-x-2' : 'justify-center'
          } w-full px-4 py-2 text-left hover:bg-gray-200 transition`}
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;