// src/Terminal.tsx
import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';
import './Terminal.css';

// Connect to your NestJS backend (adjust the URL/port as needed)
const socket = io('http://localhost:3000');

const Terminal: React.FC = () => {
    const [lines, setLines] = useState<string[]>(['Connected to CLI backend...']);
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);

    // Listen for output events from the backend
    useEffect(() => {
        socket.on('command-output', (data: string) => {
            setLines(prev => [...prev, data]);
        });

        socket.on('command-finished', (data: string) => {
            setLines(prev => [...prev, data]);
        });

        return () => {
            socket.off('command-output');
            socket.off('command-finished');
        };
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (input.trim()) {
            // Display the command in the terminal
            setLines(prev => [...prev, `> ${input}`]);
            // Emit the command to the backend for execution
            socket.emit('run-command', input.trim());
            setInput('');
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // Auto-scroll terminal when new lines are added
    useEffect(() => {
        terminalRef.current?.scrollTo({
            top: terminalRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [lines]);

    return (
        <div className="terminal" ref={terminalRef}>
            {lines.map((line, idx) => (
                <p key={idx}>{line}</p>
            ))}
            <form onSubmit={handleSubmit}>
                <span>&gt; </span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={handleInput}
                    autoComplete="off"
                />
            </form>
        </div>
    );
};

export default Terminal;
