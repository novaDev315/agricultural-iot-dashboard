import { Controller, Get, Post, Delete, Body, Param, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService, GenerateReportDto } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('templates')
  getTemplates() {
    return this.reportsService.getTemplates();
  }

  @Get('templates/:id')
  getTemplate(@Param('id') id: string) {
    return this.reportsService.getTemplate(id);
  }

  @Post('generate')
  async generateReport(@Body() dto: GenerateReportDto) {
    // In production, get userId from auth context
    const userId = 'user-1';
    return this.reportsService.generateReport(dto, userId);
  }

  @Get()
  getReports(@Query('userId') userId: string) {
    return this.reportsService.getReportsByUser(userId || 'user-1');
  }

  @Get(':id')
  getReport(@Param('id') id: string) {
    return this.reportsService.getReport(id);
  }

  @Get(':id/download')
  async downloadReport(@Param('id') id: string, @Res() res: Response) {
    try {
      const { content, filename, contentType } = await this.reportsService.downloadReport(id);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(content);
    } catch (error) {
      res.status(404).json({ error: 'Report not found or not ready' });
    }
  }

  // Scheduled Reports
  @Get('scheduled')
  getScheduledReports() {
    return this.reportsService.getScheduledReports();
  }

  @Post('scheduled')
  createScheduledReport(
    @Body() dto: {
      name: string;
      templateId: string;
      frequency: 'daily' | 'weekly' | 'monthly';
      format: 'pdf' | 'csv';
      recipients: string[];
    },
  ) {
    const nextRun = new Date();
    if (dto.frequency === 'daily') {
      nextRun.setDate(nextRun.getDate() + 1);
    } else if (dto.frequency === 'weekly') {
      nextRun.setDate(nextRun.getDate() + 7);
    } else {
      nextRun.setMonth(nextRun.getMonth() + 1);
    }

    return this.reportsService.createScheduledReport({
      ...dto,
      nextRun,
      isActive: true,
    });
  }

  @Delete('scheduled/:id')
  deleteScheduledReport(@Param('id') id: string) {
    return { success: this.reportsService.deleteScheduledReport(id) };
  }
}
