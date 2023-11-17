import React, { useState, useEffect, useRef } from 'react';

const Chat = () => {
    const [conn, setConn] = useState(null);
    const [log, setLog] = useState([]);
    const msgRef = useRef();

    const appendLog = (message) => {
        setLog((prevLog) => [...prevLog, message]);
    };

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8000/chat");
        
        socket.onopen = () => {
            appendLog({ type: 'status', message: 'Connected to the server.' });
        };

        socket.onclose = () => {
            appendLog({ type: 'status', message: 'Connection closed.' });
        };

        socket.onmessage = (evt) => {
            const message = JSON.parse(evt.data);
            appendLog({ type: 'message', message: message.message });
        };

        setConn(socket);

        // Clean up on component unmount
        return () => {
            socket.close();
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (conn && msgRef.current.value) {
            conn.send(JSON.stringify({ message: msgRef.current.value }));
            msgRef.current.value = "";
        }
    };

    return (
        <div style={{ background: 'gray', height: '100vh', overflow: 'hidden' }}>
            <div id="log" style={{ background: 'white', overflow: 'auto', position: 'absolute', top: '0.5em', bottom: '3em', left: '0.5em', right: '0.5em' }}>
                {log.map((item, index) => (
                    <div key={index}>{item.message}</div>
                ))}
            </div>
            <form id="form" onSubmit={handleSubmit} style={{ position: 'absolute', bottom: '1em', left: '0', width: '100%', overflow: 'hidden' }}>
                <input type="submit" value="Send" />
                <input type="text" ref={msgRef} size="64" autoFocus />
            </form>
        </div>
    );
};

export default Chat;

