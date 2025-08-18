import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { eventAPI } from '../../services/api';
import { toast } from 'sonner';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getAll();
      setEvents(response.data || []);
      setError(null);
    } catch (err) {
      setError('Events fetch karne mein error: ' + err.message);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      await eventAPI.delete(eventId);
      toast.success('Event deleted successfully!');
      fetchEvents(); // Refresh the list
    } catch (err) {
      toast.error('Error deleting event: ' + err.message);
      console.error('Error deleting event:', err);
    }
  };

  const handleEdit = (event) => {
    // Navigate to EventsForm with event data
    window.location.href = `/admin/events-form?edit=true&id=${event._id}`;
  };

  const handleAddNew = () => {
    window.location.href = '/admin/events-form';
  };

  // Filter and search events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'upcoming' && new Date(event.eventDate) > new Date()) ||
                         (filterStatus === 'past' && new Date(event.eventDate) <= new Date());
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (hours, minutes, period) => {
    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const eventDateObj = new Date(eventDate);
    return eventDateObj > now ? 'upcoming' : 'past';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Events load ho rahe hain...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-blue-600" />
              Events Management
            </h1>
            <p className="text-gray-600 mt-2">Manage all your events here</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add New Event
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search events by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new event.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <div className="mt-6">
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Add New Event
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className={`bg-white rounded-lg shadow-sm border-l-4 ${
                getEventStatus(event.eventDate) === 'upcoming' 
                  ? 'border-green-500' 
                  : 'border-gray-400'
              } hover:shadow-md transition-shadow`}
            >
              <div className="p-6">
                {/* Event Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getEventStatus(event.eventDate) === 'upcoming'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {getEventStatus(event.eventDate) === 'upcoming' ? 'Upcoming' : 'Past'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Duration: {event.durationHours} hours
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.eventTitle}
                </h3>

                {/* Event Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🕒</span>
                    <span>
                      {formatTime(event.eventTimeHours, event.eventTimeMinutes, event.eventTimePeriod)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="Edit Event"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    title="Delete Event"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredEvents.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredEvents.length} of {events.length} events
            </span>
            <span>
              {filteredEvents.filter(e => getEventStatus(e.eventDate) === 'upcoming').length} upcoming,{' '}
              {filteredEvents.filter(e => getEventStatus(e.eventDate) === 'past').length} past
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;
