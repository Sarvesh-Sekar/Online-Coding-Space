import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSideBar from './AdminSideBar';
import { useNavigate } from 'react-router-dom';
import '../../App.css'

const InfoBoard = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        // Fetch all users when the component mounts
        axios.get('http://localhost:5000/users')
            .then(response => {
                setUsers(response.data);
                setFilteredUsers(response.data); // Initially, filteredUsers should display all users
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    // Handle search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Filter users based on search query
        const filtered = users.filter(user => 
            (user.displayName && user.displayName.toLowerCase().includes(query.toLowerCase())) || // Search by name
            (user.rollNo && user.rollNo.toLowerCase().includes(query.toLowerCase())) || // Search by roll number
            (user.email && user.email.toLowerCase().includes(query.toLowerCase())) // Search by email
        );
        setFilteredUsers(filtered); // Update the filtered users list
    };

    // Handle view button click
    const handleViewDetails = (userId) => {
        // Redirect or display user details
        navigate(`user-info/${userId}`);
    };

    return (
        <div>
            <AdminSideBar></AdminSideBar>
            <h1>InfoBoard</h1>
            <input
                type="text"
                placeholder="Search by name, roll number, or email"
                value={searchQuery}
                onChange={handleSearch}
            />
            <table>
                <thead>
                    <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.rollNo}</td> {/* Ensure 'rollNo' field exists in user object */}
                                <td>{user.displayName}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button onClick={() => handleViewDetails(user._id)}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default InfoBoard;
