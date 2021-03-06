import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'; 

import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

import './Chat.css'; 

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://sales-chat.herokuapp.com/';
    // We wont be needing localhost:5000 again, we will put the URL gotten from the backend server as our ENDPOINT

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);  

        setName(name);
        setRoom(room);
        
        socket.emit('join', { name, room }, () => {

        });

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })

        socket.on('roomData', ({ users }) => {
            setUsers(users);
          })
      
          return () => {
            socket.emit('disconnect');
      
            socket.off();
          }
    }, [messages]);

// FUNCTION FOR SENDING MESSAGES
    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    console.log(message, messages);
    

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                {/* <input 
                    value={message} 
                    onChange={(event) => setMessage(event.target.value)} 
                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null} /> */}
            </div>
            <TextContainer users={users} />
        </div>
    )
};

export default Chat;