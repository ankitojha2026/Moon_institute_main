import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Mail, 
  Phone, 
  User, 
  BookOpen, 
  Calendar,
  Eye,
  Loader2,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Trash2
} from 'lucide-react';
import { contactAPI } from '../../services/api'; // Make sure api.js is updated
import { toast } from 'sonner';

const StudentEnrolled = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [stats, setStats] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Use a single useEffect to fetch data based on dependencies
    useEffect(() => {
        fetchData();
    }, [searchTerm, statusFilter]);

    const fetchData = () => {
        // Fetch both contacts and stats in parallel for efficiency
        setLoading(true);
        Promise.all([
            contactAPI.getAll({ search: searchTerm, status: statusFilter }),
            contactAPI.getStats()
        ]).then(([contactsResponse, statsResponse]) => {
            // PHP API returns data in 'records' property
            setContacts(contactsResponse.records || []);
            // PHP stats API returns the object directly
            setStats(statsResponse);
            setError(null);
        }).catch(err => {
            console.error('Error fetching data:', err);
            setError('Failed to load data. Please try again.');
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleStatusUpdate = async (contactId, newStatus) => {
        try {
            await contactAPI.update(contactId, { status: newStatus });
            toast.success('Status updated successfully');
            fetchData(); // Refresh both contacts and stats
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact?')) return;
        try {
            await contactAPI.delete(contactId);
            toast.success('Contact deleted successfully');
            fetchData(); // Refresh both contacts and stats
        } catch (err) {
            toast.error('Failed to delete contact');
        }
    };
    
    // This component remains the same
    const getStatusBadge = (status) => {
        const statusConfig = {
            new: { color: 'bg-blue-100 text-blue-800', icon: Clock },
            contacted: { color: 'bg-yellow-100 text-yellow-800', icon: Phone },
            enrolled: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
        };
        const config = statusConfig[status] || statusConfig.new;
        const Icon = config.icon;
        return (
            <Badge className={config.color}>
                <Icon className="w-3 h-3 mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading && contacts.length === 0) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Enquiries</h1>
            
            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 my-8">
                    <Card><CardContent className="p-4 flex items-center"><Users className="w-6 h-6 text-blue-600 mr-4"/><div className="flex-1"><p className="text-sm text-gray-600">Total</p><p className="text-2xl font-bold">{stats.total}</p></div></CardContent></Card>
                    <Card><CardContent className="p-4 flex items-center"><Clock className="w-6 h-6 text-blue-600 mr-4"/><div className="flex-1"><p className="text-sm text-gray-600">New</p><p className="text-2xl font-bold">{stats.new}</p></div></CardContent></Card>
                    <Card><CardContent className="p-4 flex items-center"><Phone className="w-6 h-6 text-yellow-600 mr-4"/><div className="flex-1"><p className="text-sm text-gray-600">Contacted</p><p className="text-2xl font-bold">{stats.contacted}</p></div></CardContent></Card>
                    <Card><CardContent className="p-4 flex items-center"><CheckCircle className="w-6 h-6 text-green-600 mr-4"/><div className="flex-1"><p className="text-sm text-gray-600">Enrolled</p><p className="text-2xl font-bold">{stats.enrolled}</p></div></CardContent></Card>
                    <Card><CardContent className="p-4 flex items-center"><XCircle className="w-6 h-6 text-red-600 mr-4"/><div className="flex-1"><p className="text-sm text-gray-600">Rejected</p><p className="text-2xl font-bold">{stats.rejected}</p></div></CardContent></Card>
                </div>
            )}

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-md">
                    <option value="">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Contacts List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {contacts.map((contact) => (
                    <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg">{contact.first_name} {contact.last_name}</CardTitle>
                                {getStatusBadge(contact.status)}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-gray-600 flex items-center"><Mail className="w-4 h-4 mr-2" />{contact.email}</p>
                            <p className="text-sm text-gray-600 flex items-center"><Phone className="w-4 h-4 mr-2" />{contact.phone_number}</p>
                            <p className="text-sm text-gray-600 flex items-center"><BookOpen className="w-4 h-4 mr-2" />{contact.course_interest}</p>
                            <p className="text-sm text-gray-600 flex items-center"><Calendar className="w-4 h-4 mr-2" />{formatDate(contact.created_at)}</p>
                            <div className="flex justify-between items-center pt-3 border-t">
                                <select value={contact.status} onChange={(e) => handleStatusUpdate(contact.id, e.target.value)} className="text-xs border rounded p-1">
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="enrolled">Enrolled</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => { setSelectedContact(contact); setShowModal(true); }}><Eye className="w-4 h-4" /></Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDelete(contact.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {contacts.length === 0 && !loading && <div className="text-center py-12"><p>No contacts found.</p></div>}

            {/* Contact Detail Modal */}
            {showModal && selectedContact && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {selectedContact.first_name} {selectedContact.last_name}</p>
                            <p><strong>Email:</strong> {selectedContact.email}</p>
                            <p><strong>Phone:</strong> {selectedContact.phone_number}</p>
                            <p><strong>Course:</strong> {selectedContact.course_interest}</p>
                            <p><strong>Status:</strong> <span className="capitalize">{selectedContact.status}</span></p>
                            <p><strong>Submitted:</strong> {formatDate(selectedContact.created_at)}</p>
                            <p className="whitespace-pre-wrap"><strong>Message:</strong> {selectedContact.message}</p>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentEnrolled;
