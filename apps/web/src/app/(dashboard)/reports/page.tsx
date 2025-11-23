'use client';

import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  File,
  Clock,
  CheckCircle,
  Loader2,
  ChevronDown,
  BarChart3,
  Droplets,
  AlertTriangle,
  Thermometer,
  Leaf,
  Plus,
  Trash2,
  Mail,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  category: 'analytics' | 'sensors' | 'irrigation' | 'alerts' | 'custom';
  fields: string[];
}

interface GeneratedReport {
  id: string;
  name: string;
  template: string;
  dateRange: { start: string; end: string };
  format: 'pdf' | 'csv' | 'xlsx';
  status: 'generating' | 'ready' | 'failed';
  createdAt: Date;
  size?: string;
  downloadUrl?: string;
}

interface ScheduledReport {
  id: string;
  name: string;
  template: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'csv';
  recipients: string[];
  nextRun: Date;
  isActive: boolean;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: 'sensor-summary',
    name: 'Sensor Data Summary',
    description: 'Comprehensive overview of all sensor readings with averages and trends',
    icon: Thermometer,
    category: 'sensors',
    fields: ['Temperature', 'Humidity', 'Soil Moisture', 'Light Intensity', 'pH Levels'],
  },
  {
    id: 'irrigation-report',
    name: 'Irrigation Report',
    description: 'Water usage, schedules, and efficiency metrics by zone',
    icon: Droplets,
    category: 'irrigation',
    fields: ['Water Usage', 'Zone Activity', 'Schedule Compliance', 'Efficiency Score'],
  },
  {
    id: 'alerts-report',
    name: 'Alerts & Incidents',
    description: 'Summary of all alerts, response times, and resolutions',
    icon: AlertTriangle,
    category: 'alerts',
    fields: ['Alert Count', 'Severity Distribution', 'Response Times', 'Resolution Status'],
  },
  {
    id: 'resource-analytics',
    name: 'Resource Analytics',
    description: 'Energy, water, and cost analysis with savings calculations',
    icon: BarChart3,
    category: 'analytics',
    fields: ['Water Consumption', 'Energy Usage', 'Cost Analysis', 'Savings'],
  },
  {
    id: 'crop-health',
    name: 'Crop Health Report',
    description: 'Zone-by-zone crop health assessment and recommendations',
    icon: Leaf,
    category: 'analytics',
    fields: ['Health Index', 'Growth Stage', 'Issues Detected', 'Recommendations'],
  },
];

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: '1',
    name: 'Weekly Sensor Summary',
    template: 'sensor-summary',
    dateRange: { start: '2024-11-15', end: '2024-11-22' },
    format: 'pdf',
    status: 'ready',
    createdAt: new Date(Date.now() - 3600000),
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'November Irrigation Report',
    template: 'irrigation-report',
    dateRange: { start: '2024-11-01', end: '2024-11-22' },
    format: 'xlsx',
    status: 'ready',
    createdAt: new Date(Date.now() - 86400000),
    size: '1.8 MB',
  },
  {
    id: '3',
    name: 'Q4 Resource Analytics',
    template: 'resource-analytics',
    dateRange: { start: '2024-10-01', end: '2024-11-22' },
    format: 'pdf',
    status: 'generating',
    createdAt: new Date(),
  },
];

const mockScheduledReports: ScheduledReport[] = [
  {
    id: '1',
    name: 'Daily Sensor Summary',
    template: 'sensor-summary',
    frequency: 'daily',
    format: 'pdf',
    recipients: ['john@farm.com'],
    nextRun: new Date(Date.now() + 43200000),
    isActive: true,
  },
  {
    id: '2',
    name: 'Weekly Irrigation Report',
    template: 'irrigation-report',
    frequency: 'weekly',
    format: 'csv',
    recipients: ['john@farm.com', 'manager@farm.com'],
    nextRun: new Date(Date.now() + 259200000),
    isActive: true,
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'history' | 'scheduled'>('generate');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(mockGeneratedReports);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(mockScheduledReports);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedTemplate || !dateRange.start || !dateRange.end) return;

    setIsGenerating(true);
    const template = reportTemplates.find((t) => t.id === selectedTemplate);

    const newReport: GeneratedReport = {
      id: Date.now().toString(),
      name: `${template?.name} - ${new Date().toLocaleDateString()}`,
      template: selectedTemplate,
      dateRange,
      format: exportFormat,
      status: 'generating',
      createdAt: new Date(),
    };

    setGeneratedReports((prev) => [newReport, ...prev]);
    setActiveTab('history');

    // Simulate report generation
    setTimeout(() => {
      setGeneratedReports((prev) =>
        prev.map((r) =>
          r.id === newReport.id
            ? { ...r, status: 'ready' as const, size: '2.1 MB' }
            : r
        )
      );
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = (report: GeneratedReport) => {
    // In production, this would trigger actual file download
    const content = generateReportContent(report);
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name}.${report.format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateReportContent = (report: GeneratedReport): string => {
    // Generate CSV content based on template
    const template = reportTemplates.find((t) => t.id === report.template);
    let csv = `${template?.name}\nGenerated: ${report.createdAt.toLocaleString()}\nDate Range: ${report.dateRange.start} to ${report.dateRange.end}\n\n`;
    csv += template?.fields.join(',') + '\n';

    // Add mock data rows
    for (let i = 0; i < 10; i++) {
      csv += template?.fields.map(() => Math.round(Math.random() * 100)).join(',') + '\n';
    }
    return csv;
  };

  const formatFileSize = (size?: string) => size || 'Calculating...';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'generating':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Reports & Export</h1>
          <p className="text-secondary-500">Generate and download reports for your farm data</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <div className="flex space-x-8">
          {[
            { id: 'generate', label: 'Generate Report' },
            { id: 'history', label: 'Report History' },
            { id: 'scheduled', label: 'Scheduled Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'pb-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-secondary-500 hover:text-secondary-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Report Tab */}
      {activeTab === 'generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-secondary-900">Select Report Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all',
                    selectedTemplate === template.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300 bg-white'
                  )}
                >
                  <div className="flex items-start">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center mr-3',
                        selectedTemplate === template.id ? 'bg-primary-100' : 'bg-secondary-100'
                      )}
                    >
                      <template.icon
                        className={cn(
                          'h-5 w-5',
                          selectedTemplate === template.id ? 'text-primary-600' : 'text-secondary-500'
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-secondary-900">{template.name}</h3>
                      <p className="text-sm text-secondary-500 mt-1">{template.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.fields.slice(0, 3).map((field) => (
                          <span
                            key={field}
                            className="px-2 py-0.5 text-xs bg-secondary-100 text-secondary-600 rounded"
                          >
                            {field}
                          </span>
                        ))}
                        {template.fields.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-secondary-100 text-secondary-600 rounded">
                            +{template.fields.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Report Options */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-100">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Report Options</h2>

              {/* Date Range */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      className="px-3 py-2 border border-secondary-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Quick Date Selection */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Last 7 days', days: 7 },
                    { label: 'Last 30 days', days: 30 },
                    { label: 'This month', days: 0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        if (preset.days > 0) {
                          start.setDate(start.getDate() - preset.days);
                        } else {
                          start.setDate(1);
                        }
                        setDateRange({
                          start: start.toISOString().split('T')[0],
                          end: end.toISOString().split('T')[0],
                        });
                      }}
                      className="px-3 py-1 text-xs font-medium text-secondary-600 bg-secondary-100 rounded-full hover:bg-secondary-200"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Export Format */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">Export Format</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'pdf', label: 'PDF', icon: File },
                      { id: 'csv', label: 'CSV', icon: FileText },
                      { id: 'xlsx', label: 'Excel', icon: FileSpreadsheet },
                    ].map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setExportFormat(format.id as typeof exportFormat)}
                        className={cn(
                          'flex-1 flex items-center justify-center px-3 py-2 rounded-lg border-2 transition-all',
                          exportFormat === format.id
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-secondary-200 text-secondary-600 hover:border-secondary-300'
                        )}
                      >
                        <format.icon className="h-4 w-4 mr-1" />
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateReport}
                  disabled={!selectedTemplate || !dateRange.start || !dateRange.end || isGenerating}
                  className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowScheduleModal(true)}
                  disabled={!selectedTemplate}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 disabled:opacity-50"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule This Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
          <div className="p-4 border-b border-secondary-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-secondary-900">Generated Reports</h2>
              <span className="text-sm text-secondary-500">{generatedReports.length} reports</span>
            </div>
          </div>
          <div className="divide-y divide-secondary-100">
            {generatedReports.map((report) => {
              const template = reportTemplates.find((t) => t.id === report.template);
              const TemplateIcon = template?.icon || FileText;

              return (
                <div key={report.id} className="p-4 flex items-center justify-between hover:bg-secondary-50">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center mr-4">
                      <TemplateIcon className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-900">{report.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-secondary-500 mt-1">
                        <span>{report.dateRange.start} - {report.dateRange.end}</span>
                        <span>•</span>
                        <span className="uppercase">{report.format}</span>
                        <span>•</span>
                        <span>{formatFileSize(report.size)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      {getStatusIcon(report.status)}
                      <span className={cn(
                        'ml-2 text-sm capitalize',
                        report.status === 'ready' && 'text-green-600',
                        report.status === 'generating' && 'text-blue-600',
                        report.status === 'failed' && 'text-red-600'
                      )}>
                        {report.status}
                      </span>
                    </div>
                    {report.status === 'ready' && (
                      <button
                        onClick={() => handleDownload(report)}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {generatedReports.length === 0 && (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                <p className="text-secondary-600">No reports generated yet</p>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Generate your first report
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Scheduled Reports Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Scheduled Report
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden">
            <div className="divide-y divide-secondary-100">
              {scheduledReports.map((schedule) => {
                const template = reportTemplates.find((t) => t.id === schedule.template);

                return (
                  <div key={schedule.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center mr-4',
                        schedule.isActive ? 'bg-green-100' : 'bg-secondary-100'
                      )}>
                        <Clock className={cn(
                          'h-5 w-5',
                          schedule.isActive ? 'text-green-600' : 'text-secondary-400'
                        )} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-secondary-900">{schedule.name}</h3>
                          <span className={cn(
                            'px-2 py-0.5 text-xs font-medium rounded-full',
                            schedule.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-secondary-100 text-secondary-600'
                          )}>
                            {schedule.isActive ? 'Active' : 'Paused'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-secondary-500 mt-1">
                          <span className="capitalize">{schedule.frequency}</span>
                          <span>•</span>
                          <span className="uppercase">{schedule.format}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {schedule.recipients.length} recipient{schedule.recipients.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-xs text-secondary-400 mt-1">
                          Next run: {schedule.nextRun.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-500">
                        <Settings className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-red-50 text-secondary-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {scheduledReports.length === 0 && (
                <div className="p-12 text-center">
                  <Clock className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
                  <p className="text-secondary-600">No scheduled reports</p>
                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    Create a scheduled report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
