import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { eventAPI } from '../../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventAPI.getAll();
            setEvents(response.records || []);
        } catch (err) {
            toast.error('Events fetch karne mein error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await eventAPI.delete(eventId);
                toast.success('Event deleted successfully!');
                fetchEvents();
            } catch (err) {
                toast.error('Error deleting event: ' + err.message);
            }
        }
    };

    const handleEdit = (eventId) => {
        navigate(`/admin/events-form?edit=true&id=${eventId}`);
    };

    const handleAddNew = () => {
        navigate('/admin/events-form');
    };
    
    const getEventStatus = (eventDateTime) => {
        const now = new Date();
        const eventDateObj = new Date(eventDateTime);
        return eventDateObj > now ? 'upcoming' : 'past';
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              event.location?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterStatus === 'all' || getEventStatus(event.eventDateTime) === filterStatus;
        
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        if(!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        return new Date(dateString).toLocaleString('en-IN', options);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Events Management</h1>
                <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center">
                    <Plus className="mr-2 h-5 w-5" /> Add New Event
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
                <input
                    type="text" placeholder="Search by title or location..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
                <select
                    value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    className="p-2 border rounded-lg"
                >
                    <option value="all">All Events</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{event.eventTitle}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(event.eventDateTime)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            getEventStatus(event.eventDateTime) === 'upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {getEventStatus(event.eventDateTime)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(event.id)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="text-center py-10">No events found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsManagement;
