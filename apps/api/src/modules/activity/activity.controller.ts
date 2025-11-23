import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ActivityService, CreateFieldNoteDto } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  // Activity Logs
  @Get('logs')
  getActivityLogs(
    @Query('type') type?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.activityService.getActivityLogs({
      type,
      userId,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  // Field Notes
  @Get('notes')
  getFieldNotes(
    @Query('type') type?: string,
    @Query('zone') zone?: string,
    @Query('authorId') authorId?: string,
    @Query('tags') tags?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.activityService.getFieldNotes({
      type,
      zone,
      authorId,
      tags: tags ? tags.split(',') : undefined,
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });
  }

  @Get('notes/:id')
  getFieldNote(@Param('id') id: string) {
    const note = this.activityService.getFieldNote(id);
    if (!note) {
      return { error: 'Note not found' };
    }
    return note;
  }

  @Post('notes')
  createFieldNote(@Body() dto: CreateFieldNoteDto) {
    // In production, get user from auth context
    const authorId = 'user-1';
    const authorName = 'John Farmer';
    return this.activityService.createFieldNote(dto, authorId, authorName);
  }

  @Put('notes/:id')
  updateFieldNote(@Param('id') id: string, @Body() dto: Partial<CreateFieldNoteDto>) {
    const updated = this.activityService.updateFieldNote(id, dto);
    if (!updated) {
      return { error: 'Note not found' };
    }
    return updated;
  }

  @Delete('notes/:id')
  deleteFieldNote(@Param('id') id: string) {
    return { success: this.activityService.deleteFieldNote(id) };
  }

  // Get unique zones and tags for filtering
  @Get('notes/meta/zones')
  getZones() {
    const { notes } = this.activityService.getFieldNotes({ limit: 1000 });
    const zones = [...new Set(notes.map((n) => n.zone))];
    return zones;
  }

  @Get('notes/meta/tags')
  getTags() {
    const { notes } = this.activityService.getFieldNotes({ limit: 1000 });
    const tags = [...new Set(notes.flatMap((n) => n.tags))];
    return tags;
  }
}
