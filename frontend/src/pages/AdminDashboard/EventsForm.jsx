import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, FileText, Plus, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { eventAPI } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EventsForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isEditMode = searchParams.get('edit') === 'true';
  const eventId = searchParams.get('id');
  const [formData, setFormData] = useState({
    eventTitle: '',
    description: '',
    eventDate: '',
    eventTimeHours: '',
    eventTimeMinutes: '',
    eventTimePeriod: 'AM',
    location: '',
    durationHours: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load event data if in edit mode
  useEffect(() => {
    if (isEditMode && eventId) {
      loadEventData();
    }
  }, [isEditMode, eventId]);

  const loadEventData = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getById(eventId);
      const event = response.data;
      
      // Format date for input field (YYYY-MM-DD)
      const eventDate = new Date(event.eventDate).toISOString().split('T')[0];
      
      setFormData({
        eventTitle: event.eventTitle || '',
        description: event.description || '',
        eventDate: eventDate,
        eventTimeHours: event.eventTimeHours?.toString() || '',
        eventTimeMinutes: event.eventTimeMinutes?.toString() || '',
        eventTimePeriod: event.eventTimePeriod || 'AM',
        location: event.location || '',
        durationHours: event.durationHours?.toString() || ''
      });
    } catch (error) {
      console.error('Error loading event data:', error);
      toast.error('Error loading event data: ' + error.message);
      navigate('/admin/events-management');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.eventTitle.trim()) newErrors.eventTitle = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventTimeHours) newErrors.eventTimeHours = 'Event time hours is required';
    if (!formData.eventTimeMinutes) newErrors.eventTimeMinutes = 'Event time minutes is required';
    if (!formData.eventTimePeriod) newErrors.eventTimePeriod = 'Time period is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.durationHours) newErrors.durationHours = 'Duration is required';
    
    // Validate duration is a positive number
    if (formData.durationHours && (isNaN(formData.durationHours) || parseFloat(formData.durationHours) <= 0)) {
      newErrors.durationHours = 'Duration must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        
        // Prepare data for API
        const eventData = {
          ...formData,
          eventDate: new Date(formData.eventDate).toISOString(),
          eventTimeHours: parseInt(formData.eventTimeHours),
          eventTimeMinutes: parseInt(formData.eventTimeMinutes),
          durationHours: parseFloat(formData.durationHours)
        };

        let response;
        if (isEditMode && eventId) {
          // Update existing event
          response = await eventAPI.update(eventId, eventData);
          console.log('Event updated successfully:', response);
          toast.success('Event updated successfully!');
        } else {
          // Create new event
          response = await eventAPI.create(eventData);
          console.log('Event created successfully:', response);
          toast.success('Event data submitted successfully!');
        }
        
        // Navigate back to events management
        navigate('/admin/events-management');
      } catch (error) {
        console.error('Error saving event:', error);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Event data load ho raha hai...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
        {/* Header with back button */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/admin/events-management')}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </button>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            {isEditMode ? 'Edit Event' : 'Add New Event'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update the event details below' : 'Fill in the event details below'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Event Title *
            </label>
            <input
              type="text"
              name="eventTitle"
              value={formData.eventTitle}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.eventTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event title"
            />
            {errors.eventTitle && <p className="text-red-500 text-sm mt-1">{errors.eventTitle}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter event description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Date, Time and Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.eventDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
            </div>

                         <div>
               <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                 <Clock className="w-4 h-4 mr-2" />
                 Event Time *
               </label>
                               <div className="flex gap-2">
                  <input
                    type="number"
                    name="eventTimeHours"
                    value={formData.eventTimeHours}
                    onChange={handleInputChange}
                    min="1"
                    max="12"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.eventTimeHours ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="12"
                  />
                  <span className="flex items-center text-gray-500">:</span>
                  <input
                    type="number"
                    name="eventTimeMinutes"
                    value={formData.eventTimeMinutes}
                    onChange={handleInputChange}
                    min="0"
                    max="59"
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.eventTimeMinutes ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="00"
                  />
                  <select
                    name="eventTimePeriod"
                    value={formData.eventTimePeriod}
                    onChange={handleInputChange}
                    className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.eventTimePeriod ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                {errors.eventTimeHours && <p className="text-red-500 text-sm mt-1">{errors.eventTimeHours}</p>}
                {errors.eventTimeMinutes && <p className="text-red-500 text-sm mt-1">{errors.eventTimeMinutes}</p>}
                {errors.eventTimePeriod && <p className="text-red-500 text-sm mt-1">{errors.eventTimePeriod}</p>}
             </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter event location"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 mr-2" />
              Duration (hours) *
            </label>
            <input
              type="number"
              name="durationHours"
              value={formData.durationHours}
              onChange={handleInputChange}
              min="0.5"
              step="0.5"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.durationHours ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter duration in hours (e.g., 2.5)"
            />
            {errors.durationHours && <p className="text-red-500 text-sm mt-1">{errors.durationHours}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  {isEditMode ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {isEditMode ? 'Update Event' : 'Add Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventsForm;
