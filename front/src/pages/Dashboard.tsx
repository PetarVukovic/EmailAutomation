// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AgentModal from '../components/AgentModal';
import DraftModal from '../components/DraftModal';
import SettingsModal from '../components/SettingsModal';
import { useToast } from '@chakra-ui/react';
import { User, Agent, Draft } from '../types';
import Confetti from 'react-confetti';

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
    // toast notification can be omitted if not necessary
  };

  const unreadDraftsCount = drafts.filter((draft) => !draft.isRead).length;

  const renderMainContent = () => {
    switch (activeView) {
      case 'agents':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow ${
                    mainAgent?.id === agent.id ? 'border-2 border-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedAgent(agent);
                    // setIsAgentModalOpen(true);
                  }}
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
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMainAgent(agent);
                        toast({
                          title: 'Main Agent Set',
                          description: `${agent.name} is now your main agent.`,
                          status: 'info',
                          duration: 3000,
                          isClosable: true,
                        });
                      }}
                    >
                      Set as Main
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCelebration(true);
                        setTimeout(() => setShowCelebration(false), 5000);
                        toast({
                          title: 'Automation Started',
                          description: `Email automation started with ${agent.name}.`,
                          status: 'success',
                          duration: 3000,
                          isClosable: true,
                        });
                      }}
                    >
                      Run Email Automation
                    </Button>
                  </div>
                </div>
              ))}
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