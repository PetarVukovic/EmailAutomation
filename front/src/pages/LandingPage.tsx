// src/pages/LandingPage.tsx

import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';
import { Mail, MessageSquare, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

// Simulated user database
const users: User[] = [
  { email: 'test7@gmail.com', password: 'test', name: 'Test User' },
  { email: 'user@example.com', password: 'password', name: 'Example User' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoginForm) {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      if (user) {
        onLogin(user);
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      // For simplicity, just add the new user to the array
      const newUser: User = { email, password, name };
      users.push(newUser);
      toast({
        title: 'Registration successful',
        description: 'You can now log in with your new account',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsLoginForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            AI Email Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Simplify your email communication with AI
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Mail className="w-8 h-8 text-blue-500" />
            <MessageSquare className="w-8 h-8 text-purple-500" />
            <UserIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <Tabs
          isFitted
          variant="enclosed"
          index={isLoginForm ? 0 : 1}
          onChange={(index) => setIsLoginForm(index === 0)}
        >
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </FormControl>
                <FormControl mb={6}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </FormControl>
                <Button colorScheme="blue" width="full" type="submit">
                  Login
                </Button>
              </form>
            </TabPanel>
            <TabPanel>
              <form onSubmit={handleSubmit}>
                <FormControl mb={4}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </FormControl>
                <FormControl mb={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </FormControl>
                <FormControl mb={6}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </FormControl>
                <Button colorScheme="purple" width="full" type="submit">
                  Register
                </Button>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
};

export default LandingPage;