'use client';

import { useState } from 'react';
import {
  Activity,
  Plus,
  Filter,
  Search,
  Calendar,
  MapPin,
  User,
  Tag,
  Image,
  FileText,
  Droplets,
  Bug,
  Leaf,
  Sun,
  CloudRain,
  Tractor,
  Scissors,
  FlaskConical,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  Clock,
  Camera,
  Paperclip
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldNote {
  id: string;
  title: string;
  content: string;
  type: 'observation' | 'treatment' | 'harvest' | 'planting' | 'maintenance' | 'weather' | 'pest' | 'irrigation';
  zone: string;
  author: string;
  tags: string[];
  images?: string[];
  attachments?: { name: string; size: string }[];
  createdAt: Date;
  updatedAt?: Date;
}

interface ActivityLog {
  id: string;
  action: string;
  description: string;
  type: 'system' | 'user' | 'automation' | 'device';
  user?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

const noteTypes = [
  { id: 'observation', label: 'Observation', icon: Eye, color: 'blue' },
  { id: 'treatment', label: 'Treatment', icon: FlaskConical, color: 'purple' },
  { id: 'harvest', label: 'Harvest', icon: Scissors, color: 'green' },
  { id: 'planting', label: 'Planting', icon: Leaf, color: 'emerald' },
  { id: 'maintenance', label: 'Maintenance', icon: Tractor, color: 'orange' },
  { id: 'weather', label: 'Weather', icon: CloudRain, color: 'cyan' },
  { id: 'pest', label: 'Pest/Disease', icon: Bug, color: 'red' },
  { id: 'irrigation', label: 'Irrigation', icon: Droplets, color: 'sky' },
];

const mockFieldNotes: FieldNote[] = [
  {
    id: '1',
    title: 'Tomato plants showing early blight signs',
    content: 'Noticed yellowing leaves with brown spots on lower foliage of tomato plants in rows 3-5. Applied copper fungicide treatment. Will monitor over next 48 hours.',
    type: 'pest',
    zone: 'Greenhouse',
    author: 'John Farmer',
    tags: ['tomatoes', 'disease', 'fungicide'],
    images: ['/placeholder-crop.jpg'],
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    title: 'Corn harvest completed - North Field',
    content: 'Completed corn harvest for North Field. Total yield: 8.2 tons. Quality grade A. Some lodging observed in northeast corner due to last week\'s storm.',
    type: 'harvest',
    zone: 'North Field',
    author: 'John Farmer',
    tags: ['corn', 'harvest', 'yield'],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Irrigation system maintenance',
    content: 'Replaced 3 drip emitters in South Field zone B. Cleaned filters. System pressure normalized to 2.5 bar. Scheduled next maintenance for Dec 15.',
    type: 'maintenance',
    zone: 'South Field',
    author: 'Mike Technician',
    tags: ['irrigation', 'maintenance', 'drip-system'],
    attachments: [{ name: 'maintenance_report.pdf', size: '245 KB' }],
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: '4',
    title: 'Spring planting - Lettuce seedlings',
    content: 'Transplanted 500 lettuce seedlings (Butterhead variety) in East Plot. Soil temp 18°C, moisture optimal at 45%. Applied starter fertilizer.',
    type: 'planting',
    zone: 'East Plot',
    author: 'John Farmer',
    tags: ['lettuce', 'planting', 'seedlings'],
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: '5',
    title: 'Unusual weather observation',
    content: 'Unexpected late frost warning for tonight. Temperature expected to drop to -2°C. Activated frost protection for greenhouse. Covered sensitive crops in East Plot.',
    type: 'weather',
    zone: 'All Zones',
    author: 'John Farmer',
    tags: ['frost', 'weather', 'protection'],
    createdAt: new Date(Date.now() - 345600000),
  },
];

const mockActivityLogs: ActivityLog[] = [
  { id: '1', action: 'Irrigation Started', description: 'Automated irrigation started for North Field (30 min)', type: 'automation', timestamp: new Date(Date.now() - 1800000) },
  { id: '2', action: 'Alert Acknowledged', description: 'Low moisture alert for South Field acknowledged', type: 'user', user: 'John Farmer', timestamp: new Date(Date.now() - 3600000) },
  { id: '3', action: 'Device Connected', description: 'Sensor node SN-008 came online', type: 'device', timestamp: new Date(Date.now() - 7200000) },
  { id: '4', action: 'Report Generated', description: 'Weekly sensor summary report generated', type: 'system', timestamp: new Date(Date.now() - 14400000) },
  { id: '5', action: 'Automation Rule Updated', description: 'Modified "Low Moisture Auto-Irrigation" rule', type: 'user', user: 'John Farmer', timestamp: new Date(Date.now() - 28800000) },
  { id: '6', action: 'Irrigation Completed', description: 'Scheduled irrigation for Greenhouse completed (120L)', type: 'automation', timestamp: new Date(Date.now() - 43200000) },
  { id: '7', action: 'Settings Changed', description: 'Notification preferences updated', type: 'user', user: 'John Farmer', timestamp: new Date(Date.now() - 86400000) },
  { id: '8', action: 'Device Offline', description: 'Sensor node SN-005 went offline', type: 'device', timestamp: new Date(Date.now() - 100800000) },
];

export default function ActivityPage() {
  const [activeTab, setActiveTab] = useState<'notes' | 'logs'>('notes');
  const [fieldNotes, setFieldNotes] = useState<FieldNote[]>(mockFieldNotes);
  const [activityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string | null>(null);

  // New note form state
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'observation' as FieldNote['type'],
    zone: '',
    tags: '',
  });

  const filteredNotes = fieldNotes.filter((note) => {
    if (typeFilter && note.type !== typeFilter) return false;
    if (zoneFilter && note.zone !== zoneFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const zones = [...new Set(fieldNotes.map((n) => n.zone))];

  const handleCreateNote = () => {
    const note: FieldNote = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      type: newNote.type,
      zone: newNote.zone,
      author: 'John Farmer',
      tags: newNote.tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: new Date(),
    };
    setFieldNotes((prev) => [note, ...prev]);
    setShowCreateModal(false);
    setNewNote({ title: '', content: '', type: 'observation', zone: '', tags: '' });
  };

  const deleteNote = (id: string) => {
    setFieldNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const formatTimestamp = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const getTypeConfig = (type: string) => {
    return noteTypes.find((t) => t.id === type) || noteTypes[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Activity & Field Notes</h1>
          <p className="text-secondary-500">Track observations, activities, and system events</p>
        </div>
        {activeTab === 'notes' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('notes')}
            className={cn(
              'pb-3 text-sm font-medium border-b-2 transition-colors flex items-center',
              activeTab === 'notes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            )}
          >
            <FileText className="h-4 w-4 mr-2" />
            Field Notes ({fieldNotes.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={cn(
              'pb-3 text-sm font-medium border-b-2 transition-colors flex items-center',
              activeTab === 'logs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-secondary-500 hover:text-secondary-700'
            )}
          >
            <Activity className="h-4 w-4 mr-2" />
            Activity Log
          </button>
        </div>
      </div>

      {/* Field Notes Tab */}
      {activeTab === 'notes' && (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={typeFilter || ''}
                onChange={(e) => setTypeFilter(e.target.value || null)}
                className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Types</option>
                {noteTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
              <select
                value={zoneFilter || ''}
                onChange={(e) => setZoneFilter(e.target.value || null)}
                className="px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Zones</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const typeConfig = getTypeConfig(note.type);
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={note.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-secondary-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      typeConfig.color === 'blue' && 'bg-blue-100',
                      typeConfig.color === 'purple' && 'bg-purple-100',
                      typeConfig.color === 'green' && 'bg-green-100',
                      typeConfig.color === 'emerald' && 'bg-emerald-100',
                      typeConfig.color === 'orange' && 'bg-orange-100',
                      typeConfig.color === 'cyan' && 'bg-cyan-100',
                      typeConfig.color === 'red' && 'bg-red-100',
                      typeConfig.color === 'sky' && 'bg-sky-100'
                    )}>
                      <TypeIcon className={cn(
                        'h-5 w-5',
                        typeConfig.color === 'blue' && 'text-blue-600',
                        typeConfig.color === 'purple' && 'text-purple-600',
                        typeConfig.color === 'green' && 'text-green-600',
                        typeConfig.color === 'emerald' && 'text-emerald-600',
                        typeConfig.color === 'orange' && 'text-orange-600',
                        typeConfig.color === 'cyan' && 'text-cyan-600',
                        typeConfig.color === 'red' && 'text-red-600',
                        typeConfig.color === 'sky' && 'text-sky-600'
                      )} />
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1.5 rounded hover:bg-secondary-100 text-secondary-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-secondary-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">{note.title}</h3>
                  <p className="text-sm text-secondary-600 mb-3 line-clamp-3">{note.content}</p>

                  {/* Tags */}
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-secondary-100 text-secondary-600 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Attachments */}
                  {(note.images?.length || note.attachments?.length) && (
                    <div className="flex items-center gap-2 mb-3 text-xs text-secondary-500">
                      {note.images?.length && (
                        <span className="flex items-center">
                          <Camera className="h-3 w-3 mr-1" />
                          {note.images.length} photo{note.images.length !== 1 ? 's' : ''}
                        </span>
                      )}
                      {note.attachments?.length && (
                        <span className="flex items-center">
                          <Paperclip className="h-3 w-3 mr-1" />
                          {note.attachments.length} file{note.attachments.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-3 border-t border-secondary-100 text-xs text-secondary-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {note.zone}
                      </span>
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {note.author}
                      </span>
                    </div>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(note.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredNotes.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-xl border border-secondary-100">
                <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                <p className="text-secondary-600">No field notes found</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Create your first note
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Activity Log Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
          <div className="p-4 border-b border-secondary-100 flex items-center justify-between">
            <h2 className="font-semibold text-secondary-900">Recent Activity</h2>
            <select className="px-3 py-1.5 text-sm border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white">
              <option value="all">All Activity</option>
              <option value="user">User Actions</option>
              <option value="automation">Automation</option>
              <option value="device">Device Events</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className="divide-y divide-secondary-100">
            {activityLogs.map((log, index) => (
              <div key={log.id} className="p-4 flex items-start">
                {/* Timeline */}
                <div className="flex flex-col items-center mr-4">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    log.type === 'user' && 'bg-blue-100',
                    log.type === 'automation' && 'bg-purple-100',
                    log.type === 'device' && 'bg-green-100',
                    log.type === 'system' && 'bg-secondary-100'
                  )}>
                    {log.type === 'user' && <User className="h-4 w-4 text-blue-600" />}
                    {log.type === 'automation' && <Activity className="h-4 w-4 text-purple-600" />}
                    {log.type === 'device' && <Activity className="h-4 w-4 text-green-600" />}
                    {log.type === 'system' && <Activity className="h-4 w-4 text-secondary-600" />}
                  </div>
                  {index < activityLogs.length - 1 && (
                    <div className="w-0.5 h-full bg-secondary-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-secondary-900">{log.action}</h3>
                    <span className="text-xs text-secondary-500">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">{log.description}</p>
                  {log.user && (
                    <p className="text-xs text-secondary-400 mt-1">by {log.user}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-secondary-100 text-center">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Load more activity
            </button>
          </div>
        </div>
      )}

      {/* Create Note Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="p-6 border-b border-secondary-100">
              <h2 className="text-lg font-semibold text-secondary-900">Add Field Note</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  placeholder="Brief description of observation..."
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {noteTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setNewNote({ ...newNote, type: type.id as FieldNote['type'] })}
                      className={cn(
                        'p-2 rounded-lg border-2 text-center transition-all',
                        newNote.type === type.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300'
                      )}
                    >
                      <type.icon className={cn(
                        'h-5 w-5 mx-auto mb-1',
                        newNote.type === type.id ? 'text-primary-600' : 'text-secondary-400'
                      )} />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Zone</label>
                <select
                  value={newNote.zone}
                  onChange={(e) => setNewNote({ ...newNote, zone: e.target.value })}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select zone...</option>
                  <option value="North Field">North Field</option>
                  <option value="South Field">South Field</option>
                  <option value="East Plot">East Plot</option>
                  <option value="West Field">West Field</option>
                  <option value="Greenhouse">Greenhouse</option>
                  <option value="All Zones">All Zones</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Details</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Detailed observations, actions taken, recommendations..."
                  rows={4}
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  placeholder="e.g., tomatoes, disease, treatment"
                  className="w-full px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center px-3 py-2 text-sm text-secondary-600 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </button>
                <button className="flex items-center px-3 py-2 text-sm text-secondary-600 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach File
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-secondary-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-white border border-secondary-200 rounded-lg hover:bg-secondary-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newNote.title || !newNote.content || !newNote.zone}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
