// context/AuthContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

type User = { username: string; password: string };
type AuthContextType = {
  user: User | null;
  register: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  register: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const register = (newUser: User) => setUser(newUser);

  return (
    <AuthContext.Provider value={{ user, register }}>
      {children}
    </AuthContext.Provider>
  );
};
