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

    useEffect(() => {
        if (isEditMode && eventId) {
            loadEventData();
        }
    }, [isEditMode, eventId]);

    const loadEventData = async () => {
        try {
            setLoading(true);
            const event = await eventAPI.getById(eventId);
            
            const eventDateTime = new Date(event.event_datetime);
            const hours24 = eventDateTime.getHours();
            const minutes = eventDateTime.getMinutes();
            const period = hours24 >= 12 ? 'PM' : 'AM';
            let hours12 = hours24 % 12;
            hours12 = hours12 ? hours12 : 12;

            setFormData({
                eventTitle: event.event_title || '',
                description: event.description || '',
                eventDate: eventDateTime.toISOString().split('T')[0],
                eventTimeHours: hours12.toString(),
                eventTimeMinutes: minutes.toString().padStart(2, '0'),
                eventTimePeriod: period,
                location: event.location || '',
                durationHours: event.duration_hours?.toString() || ''
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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) { setErrors(prev => ({ ...prev, [name]: '' })); }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.eventTitle.trim()) newErrors.eventTitle = 'Event title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
        if (!formData.eventTimeHours) newErrors.eventTimeHours = 'Hours are required';
        if (!formData.eventTimeMinutes) newErrors.eventTimeMinutes = 'Minutes are required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                setLoading(true);
                
                const dataToSend = { ...formData };
                if (isEditMode) {
                    dataToSend.id = eventId;
                    await eventAPI.update(eventId, dataToSend);
                    toast.success('Event updated successfully!');
                } else {
                    await eventAPI.create(dataToSend);
                    toast.success('Event created successfully!');
                }
                
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
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-8">
                 <div className="mb-6">
                     <button onClick={() => navigate('/admin/events-management')} className="flex items-center text-blue-600 mb-4">
                         <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
                     </button>
                     <h1 className="text-3xl font-bold text-gray-800">
                         {isEditMode ? 'Edit Event' : 'Add New Event'}
                     </h1>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 mr-2" /> Event Title *
                        </label>
                        <input
                            type="text" name="eventTitle" value={formData.eventTitle}
                            onChange={handleInputChange} placeholder="Enter event title"
                            className={`w-full px-3 py-2 border rounded-lg ${errors.eventTitle ? 'border-red-500' : 'border-gray-300'}`}
                        />
                         {errors.eventTitle && <p className="text-red-500 text-sm mt-1">{errors.eventTitle}</p>}
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <FileText className="w-4 h-4 mr-2" /> Description *
                        </label>
                        <textarea
                            name="description" value={formData.description}
                            onChange={handleInputChange} rows="4"
                            className={`w-full px-3 py-2 border rounded-lg ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter event description"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 mr-2" /> Event Date *
                            </label>
                            <input
                                type="date" name="eventDate" value={formData.eventDate}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.eventDate ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 mr-2" /> Event Time *
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number" name="eventTimeHours" value={formData.eventTimeHours}
                                    onChange={handleInputChange} min="1" max="12"
                                    className={`flex-1 px-3 py-2 border rounded-lg ${errors.eventTimeHours ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="12"
                                />
                                <span className="flex items-center text-gray-500">:</span>
                                <input
                                    type="number" name="eventTimeMinutes" value={formData.eventTimeMinutes}
                                    onChange={handleInputChange} min="0" max="59"
                                    className={`flex-1 px-3 py-2 border rounded-lg ${errors.eventTimeMinutes ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="00"
                                />
                                <select
                                    name="eventTimePeriod" value={formData.eventTimePeriod}
                                    onChange={handleInputChange}
                                    className={`px-3 py-2 border rounded-lg ${errors.eventTimePeriod ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 mr-2" /> Location *
                            </label>
                            <input
                                type="text" name="location" value={formData.location}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter event location"
                            />
                            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <Clock className="w-4 h-4 mr-2" /> Duration (hours) *
                        </label>
                        <input
                            type="number" name="durationHours" value={formData.durationHours}
                            onChange={handleInputChange} min="0.5" step="0.5"
                            className={`w-full px-3 py-2 border rounded-lg ${errors.durationHours ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter duration in hours (e.g., 2.5)"
                        />
                        {errors.durationHours && <p className="text-red-500 text-sm mt-1">{errors.durationHours}</p>}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={loading} className="bg-blue-600 text-white font-medium py-3 px-8 rounded-lg flex items-center">
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {isEditMode ? 'Update Event' : 'Add Event'}
                        </button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default EventsForm;
