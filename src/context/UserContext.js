import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem('loggedUser'));
    if (userFromStorage) {
      setCurrentUser(userFromStorage);
    }
  }, []);

  const logIn = (user) => {
    sessionStorage.setItem('loggedUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logOut = () => {
    sessionStorage.removeItem('loggedUser');
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, logIn, logOut }}>
      {children}
    </UserContext.Provider>
  );
};
