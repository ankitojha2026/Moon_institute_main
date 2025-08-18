import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  User, 
  BookOpen, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { contactAPI } from '../../services/api';
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
  const [editingContact, setEditingContact] = useState(null);

  // Fetch contacts and stats
  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, [searchTerm, statusFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const response = await contactAPI.getAll(params);
      
      if (response.success) {
        setContacts(response.data);
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await contactAPI.getStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      const response = await contactAPI.update(contactId, { status: newStatus });
      
      if (response.success) {
        toast.success('Status updated successfully');
        fetchContacts(); // Refresh the list
        fetchStats(); // Refresh stats
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await contactAPI.delete(contactId);
      
      if (response.success) {
        toast.success('Contact deleted successfully');
        fetchContacts();
        fetchStats();
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      toast.error('Failed to delete contact');
    }
  };

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

  const getCourseDisplayName = (courseInterest) => {
    const courseMap = {
      'upboard': 'UP Board (Class 9-12)',
      'cbse': 'CBSE (Class 9-12)',
      'spoken': 'Spoken English',
      'jee-neet': 'IIT-JEE & NEET'
    };
    return courseMap[courseInterest] || courseInterest;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchContacts} className="bg-red-600 hover:bg-red-700">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Enquiries</h1>
        <p className="text-gray-600">Manage contact form submissions and track student interest</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Phone className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contacted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.enrolled}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <Card key={contact._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <CardTitle className="text-lg">
                    {contact.firstName} {contact.lastName}
                  </CardTitle>
                </div>
                {getStatusBadge(contact.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{contact.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{contact.phoneNumber}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>{getCourseDisplayName(contact.courseInterest)}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(contact.createdAt)}</span>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {contact.message}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusUpdate(contact._id, e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="enrolled">Enrolled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(contact._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600">No contact submissions match your search criteria.</p>
        </div>
      )}

      {/* Contact Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Contact Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Name</label>
                  <p className="text-gray-900">{selectedContact.firstName} {selectedContact.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{selectedContact.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{selectedContact.phoneNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Course Interest</label>
                  <p className="text-gray-900">{getCourseDisplayName(selectedContact.courseInterest)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Submitted</label>
                  <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Message</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>
              
              {selectedContact.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Admin Notes</label>
                  <p className="text-gray-900 mt-1">{selectedContact.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEnrolled;
