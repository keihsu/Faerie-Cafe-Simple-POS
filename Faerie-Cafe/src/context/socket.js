import React from 'react';
import io from "socket.io-client";
import API_URL from "../config/config";

export const socket = io.connect(API_URL);
export const SocketContext = React.createContext();
