import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, Target, Loader2 } from "lucide-react";
import { eventAPI } from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color schemes for event cards
  const colorSchemes = [
    { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-500' },
    { bg: 'bg-green-50', text: 'text-green-600', badge: 'bg-green-500' },
    { bg: 'bg-purple-50', text: 'text-purple-600', badge: 'bg-purple-500' },
    { bg: 'bg-orange-50', text: 'text-orange-600', badge: 'bg-orange-500' },
    { bg: 'bg-red-50', text: 'text-red-600', badge: 'bg-red-500' },
    { bg: 'bg-pink-50', text: 'text-pink-600', badge: 'bg-pink-500' },
    { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-500' },
    { bg: 'bg-teal-50', text: 'text-teal-600', badge: 'bg-teal-500' },
    { bg: 'bg-yellow-50', text: 'text-yellow-600', badge: 'bg-yellow-500' },
    { bg: 'bg-cyan-50', text: 'text-cyan-600', badge: 'bg-cyan-500' }
  ];

  // Badge texts for events
  const badgeTexts = ['NEW', 'HOT', 'SPECIAL', 'FEATURED', 'POPULAR', 'TRENDING'];

  // Fetch events from API
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

  // Format date and time for display
  const formatDateTime = (event) => {
    if (!event.eventDate) return 'Date not specified';
    
    const date = new Date(event.eventDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format time from separate fields
    const hours = event.eventTimeHours?.toString().padStart(2, '0') || '00';
    const minutes = event.eventTimeMinutes?.toString().padStart(2, '0') || '00';
    const period = event.eventTimePeriod || 'AM';
    const formattedTime = `${hours}:${minutes} ${period}`;
    
    return `${formattedDate} | ${formattedTime}`;
  };

  // Get random color scheme for each event
  const getRandomColorScheme = (index) => {
    return colorSchemes[index % colorSchemes.length];
  };

  // Get random badge text
  const getRandomBadgeText = (index) => {
    return badgeTexts[index % badgeTexts.length];
  };

  // Check if event is upcoming (within next 7 days)
  const isUpcoming = (event) => {
    if (!event.eventDate) return false;
    
    const eventDate = new Date(event.eventDate);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return eventDate >= today && eventDate <= nextWeek;
  };

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Events & Activities</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Stay Updated with Our Latest Programs and Workshops
            </p>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primary mb-16">
              Upcoming Events
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading events...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Available</h3>
                  <p className="text-gray-600">Check back later for upcoming events and activities.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {events.map((event, index) => {
                                     const colorScheme = getRandomColorScheme(index);
                   const badgeText = getRandomBadgeText(index);
                   const upcoming = isUpcoming(event);
                  
                  return (
                    <Card key={event._id} className="border-0 shadow-lg overflow-hidden relative">
                      {upcoming && (
                        <div className="absolute top-4 right-4">
                          <span className={`${colorScheme.badge} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                            {badgeText}
                          </span>
                        </div>
                      )}
                      
                      <div className={`${colorScheme.bg} p-6`}>
                        <div className={`${colorScheme.text} font-semibold mb-2`}>
                          {formatDateTime(event)}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {event.eventTitle}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-gray-600">{event.location}</span>
                          </div>
                                                     <div className="flex items-center space-x-2">
                             <Clock className="w-4 h-4 text-red-500" />
                             <span className="text-sm text-gray-600">{event.durationHours} Hours</span>
                           </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Regular Activities */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-primary mb-16">
              Regular Activities
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Weekly Schedule */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Weekly Schedule</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">Monday</span>
                      <span className="text-gray-600">Mock Tests (All Courses)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">Tuesday</span>
                      <span className="text-gray-600">Doubt Clearing Sessions</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">Wednesday</span>
                      <span className="text-gray-600">Special Lectures</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">Thursday</span>
                      <span className="text-gray-600">Lab Sessions</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-semibold text-gray-900">Friday</span>
                      <span className="text-gray-600">Test Analysis</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-semibold text-gray-900">Saturday</span>
                      <span className="text-gray-600">Extra Classes & Revision</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Events */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Monthly Events</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Grand Mock Tests</h4>
                        <p className="text-gray-600 text-sm">Full syllabus comprehensive tests</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Parent Meetings</h4>
                        <p className="text-gray-600 text-sm">Progress discussion and feedback</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Guest Lectures</h4>
                        <p className="text-gray-600 text-sm">Industry experts and alumni talks</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Cultural Activities</h4>
                        <p className="text-gray-600 text-sm">Stress relief and personality development</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Events;
