/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = React.createContext<UserContextInterface | null>(null);

const AuthProvider = ({ children }): JSX.Element => {
  const defaultValue = Cookies.get('monityToken') || '';
  const [token, setToken] = useState(defaultValue);

  const store: UserContextInterface = {
    auth: { token, setToken },
  };

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export interface UserContextInterface {
  auth: {
    token: string;
    setToken: React.Dispatch<string>;
  };
}

interface ProfileType {
  username: string;
}
