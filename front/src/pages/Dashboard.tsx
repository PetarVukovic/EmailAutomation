// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AgentModal from '../components/AgentModal';
import DraftModal from '../components/DraftModal';
import SettingsModal from '../components/SettingsModal';
import { Button, useToast } from '@chakra-ui/react';
import { User, Agent, Draft, ItemTypes } from '../types';
import Confetti from 'react-confetti';
import { useDrop } from 'react-dnd';
import DraggableAgent from '../components/DraggableAgent';

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
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Agents</h2>
            <div className="flex flex-col md:flex-row">
              {/* Agents List */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow ${
                      mainAgent?.id === agent.id ? 'border-2 border-blue-500' : ''
                    }`}
                  >
                    <h3 className="font-semibold">{agent.name}</h3>
                    <div className="mt-2">
                      {agent.pdfs.map((pdf, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          {pdf}
                        </div>
                      ))}
                    </div>
                    {/* Draggable agent */}
                    <div className="mt-4">
                      <DraggableAgent agent={agent} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Drop area for automation */}
              <div
                ref={drop}
                className={`w-full md:w-1/3 h-64 mt-4 md:mt-0 md:ml-4 p-4 rounded-lg border-2 border-dashed ${
                  isOver ? 'border-green-500 bg-green-50' : 'border-gray-300'
                } flex flex-col items-center justify-center`}
              >
                <p className="text-gray-700 mb-2">
                  Drag and drop an agent here to start automation
                </p>
                {mainAgent && (
                  <div className="text-center">
                    <h3 className="font-semibold">
                      Current Main Agent: {mainAgent.name}
                    </h3>
                    <Button
                      colorScheme="blue"
                      mt={2}
                      onClick={() => {
                        setShowCelebration(true);
                        setTimeout(() => setShowCelebration(false), 5000);
                        toast({
                          title: 'Automation Started',
                          description: `Email automation started with ${mainAgent.name}.`,
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        });
                      }}
                    >
                      Start Automation
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {showCelebration && <Confetti />}
          </div>
        );
      case 'drafts':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Drafts</h2>
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow ${
                    draft.isRead ? '' : 'border-2 border-green-500'
                  }`}
                  onClick={() => {
                    setSelectedDraft(draft);
                    setIsDraftModalOpen(true);
                    if (!draft.isRead) {
                      const updatedDraft = { ...draft, isRead: true };
                      handleUpdateDraft(updatedDraft);
                    }
                  }}
                >
                  <h3 className="font-semibold">{draft.title}</h3>
                  <p className="text-sm text-gray-500">
                    Created by: {draft.agent}
                  </p>
                  <p className="text-sm text-gray-500">
                    To: {draft.recipient}
                  </p>
                  {!draft.isRead && (
                    <span className="text-xs text-red-500">New</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
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
      <div className="flex-1 overflow-y-auto">{renderMainContent()}</div>

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
    </div>
  );
};

export default Dashboard;