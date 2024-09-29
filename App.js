import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [trains, setTrains] = useState([]);
    const [stations, setStations] = useState([]);
    const [bookedTrainId, setBookedTrainId] = useState('');
    const [userId, setUserId] = useState(1); // Simulated logged-in user
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTrains();
        fetchStations();
        fetchUsers();
    }, []);

    const fetchTrains = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/trains');
            console.log(response.body);
            setTrains(response.body);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/stations');
            setStations(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleBooking = async () => {
        if (!bookedTrainId) {
            alert('Please select a train');
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/bookings', { train_id: bookedTrainId, user_id: userId });
            alert('Booking successful!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleRegister = async () => {
        const userDetails = { username, password, email };
        try {
            await axios.post('http://localhost:8000/api/users', userDetails);
            alert('User registered successfully!');
            fetchUsers(); // Refresh user list
        } catch (error) {
            setError('Error registering user');
            console.error(error);
        }
    };

    return (
        <div className="App">
            <h1>Railway Management System</h1>

            <section>
                <h2>Book a Train</h2>
                <select onChange={e => setBookedTrainId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
                    <option value="">Select a train</option>
                    {trains.map(train => (
                        <option key={train.id} value={train.id}>
                            {train.name} ({train.route})
                        </option>
                    ))}
                </select>
                <button onClick={handleBooking}>Book</button>
            </section>

            <section>
                <h2>Available Stations</h2>
                <ul>
                    {stations.map(station => (
                        <li key={station.id}>{station.name} - {station.location}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Register New User</h2>
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                />
                <button onClick={handleRegister}>Register</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>

            <section>
                <h2>Registered Users</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.username} - {user.email}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default App;
