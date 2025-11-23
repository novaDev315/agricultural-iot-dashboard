import { Injectable, Logger } from '@nestjs/common';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'analytics' | 'sensors' | 'irrigation' | 'alerts' | 'custom';
  fields: string[];
}

export interface GenerateReportDto {
  templateId: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  format: 'pdf' | 'csv' | 'xlsx';
  options?: Record<string, unknown>;
}

export interface GeneratedReport {
  id: string;
  name: string;
  templateId: string;
  dateRange: { start: Date; end: Date };
  format: 'pdf' | 'csv' | 'xlsx';
  status: 'generating' | 'ready' | 'failed';
  filePath?: string;
  fileSize?: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface ScheduledReport {
  id: string;
  name: string;
  templateId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  format: 'pdf' | 'csv';
  recipients: string[];
  nextRun: Date;
  isActive: boolean;
  createdAt: Date;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private reports: Map<string, GeneratedReport> = new Map();
  private scheduledReports: Map<string, ScheduledReport> = new Map();

  private readonly templates: ReportTemplate[] = [
    {
      id: 'sensor-summary',
      name: 'Sensor Data Summary',
      description: 'Comprehensive overview of all sensor readings',
      category: 'sensors',
      fields: ['Temperature', 'Humidity', 'Soil Moisture', 'Light Intensity', 'pH Levels'],
    },
    {
      id: 'irrigation-report',
      name: 'Irrigation Report',
      description: 'Water usage and efficiency metrics',
      category: 'irrigation',
      fields: ['Water Usage', 'Zone Activity', 'Schedule Compliance', 'Efficiency Score'],
    },
    {
      id: 'alerts-report',
      name: 'Alerts & Incidents',
      description: 'Summary of all alerts and resolutions',
      category: 'alerts',
      fields: ['Alert Count', 'Severity Distribution', 'Response Times', 'Resolution Status'],
    },
    {
      id: 'resource-analytics',
      name: 'Resource Analytics',
      description: 'Energy, water, and cost analysis',
      category: 'analytics',
      fields: ['Water Consumption', 'Energy Usage', 'Cost Analysis', 'Savings'],
    },
  ];

  getTemplates(): ReportTemplate[] {
    return this.templates;
  }

  getTemplate(id: string): ReportTemplate | undefined {
    return this.templates.find((t) => t.id === id);
  }

  async generateReport(dto: GenerateReportDto, userId: string): Promise<GeneratedReport> {
    const template = this.getTemplate(dto.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const report: GeneratedReport = {
      id: Date.now().toString(),
      name: `${template.name} - ${new Date().toLocaleDateString()}`,
      templateId: dto.templateId,
      dateRange: dto.dateRange,
      format: dto.format,
      status: 'generating',
      createdAt: new Date(),
    };

    this.reports.set(report.id, report);
    this.logger.log(`Generating report ${report.id} for user ${userId}`);

    // Simulate async report generation
    this.processReportGeneration(report.id, template, dto);

    return report;
  }

  private async processReportGeneration(
    reportId: string,
    template: ReportTemplate,
    dto: GenerateReportDto,
  ): Promise<void> {
    // Simulate generation time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const report = this.reports.get(reportId);
    if (!report) return;

    try {
      // Generate report content based on template
      const content = this.generateReportContent(template, dto);

      // In production, save to file storage (S3, etc.)
      const fileSize = Buffer.byteLength(content, 'utf8');

      report.status = 'ready';
      report.fileSize = fileSize;
      report.filePath = `/reports/${reportId}.${dto.format}`;
      report.completedAt = new Date();

      this.reports.set(reportId, report);
      this.logger.log(`Report ${reportId} generated successfully`);
    } catch (error) {
      report.status = 'failed';
      report.error = error instanceof Error ? error.message : 'Unknown error';
      this.reports.set(reportId, report);
      this.logger.error(`Report ${reportId} generation failed`, error);
    }
  }

  private generateReportContent(template: ReportTemplate, dto: GenerateReportDto): string {
    // Generate CSV content
    let content = `${template.name}\n`;
    content += `Generated: ${new Date().toISOString()}\n`;
    content += `Date Range: ${dto.dateRange.start} to ${dto.dateRange.end}\n\n`;
    content += template.fields.join(',') + '\n';

    // Generate mock data rows
    for (let i = 0; i < 100; i++) {
      content += template.fields.map(() => Math.round(Math.random() * 100)).join(',') + '\n';
    }

    return content;
  }

  getReport(id: string): GeneratedReport | undefined {
    return this.reports.get(id);
  }

  getReportsByUser(userId: string): GeneratedReport[] {
    // In production, filter by userId
    return Array.from(this.reports.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async downloadReport(id: string): Promise<{ content: string; filename: string; contentType: string }> {
    const report = this.reports.get(id);
    if (!report || report.status !== 'ready') {
      throw new Error('Report not ready');
    }

    const template = this.getTemplate(report.templateId);
    const content = this.generateReportContent(template!, {
      templateId: report.templateId,
      dateRange: report.dateRange,
      format: report.format,
    });

    const contentTypes = {
      csv: 'text/csv',
      pdf: 'application/pdf',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return {
      content,
      filename: `${report.name}.${report.format}`,
      contentType: contentTypes[report.format],
    };
  }

  // Scheduled Reports
  createScheduledReport(data: Omit<ScheduledReport, 'id' | 'createdAt'>): ScheduledReport {
    const scheduled: ScheduledReport = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.scheduledReports.set(scheduled.id, scheduled);
    return scheduled;
  }

  getScheduledReports(): ScheduledReport[] {
    return Array.from(this.scheduledReports.values());
  }

  updateScheduledReport(id: string, updates: Partial<ScheduledReport>): ScheduledReport | undefined {
    const existing = this.scheduledReports.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.scheduledReports.set(id, updated);
    return updated;
  }

  deleteScheduledReport(id: string): boolean {
    return this.scheduledReports.delete(id);
  }
}
