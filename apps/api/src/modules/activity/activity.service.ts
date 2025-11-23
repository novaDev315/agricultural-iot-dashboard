import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  type: 'system' | 'user' | 'automation' | 'device';
  userId?: string;
  metadata?: Record<string, unknown>;
  timestamp: Date;
}

export interface FieldNote {
  id: string;
  title: string;
  content: string;
  type: 'observation' | 'treatment' | 'harvest' | 'planting' | 'maintenance' | 'weather' | 'pest' | 'irrigation';
  zone: string;
  authorId: string;
  authorName: string;
  tags: string[];
  images?: string[];
  attachments?: { name: string; size: string; url: string }[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateFieldNoteDto {
  title: string;
  content: string;
  type: FieldNote['type'];
  zone: string;
  tags: string[];
  images?: string[];
  attachments?: { name: string; size: string; url: string }[];
}

@Injectable()
export class ActivityService {
  private readonly logger = new Logger(ActivityService.name);
  private activityLogs: ActivityLog[] = [];
  private fieldNotes: Map<string, FieldNote> = new Map();

  constructor(private readonly eventEmitter: EventEmitter2) {}

  // Activity Logs
  logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const log: ActivityLog = {
      ...activity,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };

    this.activityLogs.unshift(log);

    // Keep only last 1000 logs in memory
    if (this.activityLogs.length > 1000) {
      this.activityLogs = this.activityLogs.slice(0, 1000);
    }

    this.logger.log(`Activity logged: ${activity.action}`);
    return log;
  }

  getActivityLogs(filters?: {
    type?: string;
    userId?: string;
    limit?: number;
    offset?: number;
  }): { logs: ActivityLog[]; total: number } {
    let logs = [...this.activityLogs];

    if (filters?.type) {
      logs = logs.filter((l) => l.type === filters.type);
    }
    if (filters?.userId) {
      logs = logs.filter((l) => l.userId === filters.userId);
    }

    const total = logs.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;

    return {
      logs: logs.slice(offset, offset + limit),
      total,
    };
  }

  // Field Notes
  createFieldNote(dto: CreateFieldNoteDto, authorId: string, authorName: string): FieldNote {
    const note: FieldNote = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...dto,
      authorId,
      authorName,
      createdAt: new Date(),
    };

    this.fieldNotes.set(note.id, note);

    // Log activity
    this.logActivity({
      action: 'Field Note Created',
      description: `Created "${note.title}" for ${note.zone}`,
      type: 'user',
      userId: authorId,
      metadata: { noteId: note.id, noteType: note.type },
    });

    return note;
  }

  getFieldNote(id: string): FieldNote | undefined {
    return this.fieldNotes.get(id);
  }

  getFieldNotes(filters?: {
    type?: string;
    zone?: string;
    authorId?: string;
    tags?: string[];
    search?: string;
    limit?: number;
    offset?: number;
  }): { notes: FieldNote[]; total: number } {
    let notes = Array.from(this.fieldNotes.values());

    // Apply filters
    if (filters?.type) {
      notes = notes.filter((n) => n.type === filters.type);
    }
    if (filters?.zone) {
      notes = notes.filter((n) => n.zone === filters.zone);
    }
    if (filters?.authorId) {
      notes = notes.filter((n) => n.authorId === filters.authorId);
    }
    if (filters?.tags?.length) {
      notes = notes.filter((n) => filters.tags!.some((t) => n.tags.includes(t)));
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          n.tags.some((t) => t.toLowerCase().includes(query)),
      );
    }

    // Sort by date descending
    notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = notes.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;

    return {
      notes: notes.slice(offset, offset + limit),
      total,
    };
  }

  updateFieldNote(id: string, updates: Partial<CreateFieldNoteDto>): FieldNote | undefined {
    const existing = this.fieldNotes.get(id);
    if (!existing) return undefined;

    const updated: FieldNote = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };

    this.fieldNotes.set(id, updated);
    return updated;
  }

  deleteFieldNote(id: string): boolean {
    const note = this.fieldNotes.get(id);
    if (note) {
      this.logActivity({
        action: 'Field Note Deleted',
        description: `Deleted "${note.title}"`,
        type: 'user',
        userId: note.authorId,
      });
    }
    return this.fieldNotes.delete(id);
  }

  // Event handlers to auto-log activities
  @OnEvent('irrigation.started')
  handleIrrigationStarted(event: { zone: string; duration: number }) {
    this.logActivity({
      action: 'Irrigation Started',
      description: `Automated irrigation started for ${event.zone} (${event.duration} min)`,
      type: 'automation',
      metadata: event,
    });
  }

  @OnEvent('irrigation.completed')
  handleIrrigationCompleted(event: { zone: string; waterUsed: number }) {
    this.logActivity({
      action: 'Irrigation Completed',
      description: `Irrigation completed for ${event.zone} (${event.waterUsed}L used)`,
      type: 'automation',
      metadata: event,
    });
  }

  @OnEvent('alert.created')
  handleAlertCreated(event: { alert: { title: string; severity: string } }) {
    this.logActivity({
      action: 'Alert Created',
      description: `${event.alert.severity} alert: ${event.alert.title}`,
      type: 'system',
      metadata: event,
    });
  }

  @OnEvent('device.status_changed')
  handleDeviceStatusChanged(event: { deviceId: string; status: string; name: string }) {
    this.logActivity({
      action: `Device ${event.status === 'online' ? 'Connected' : 'Offline'}`,
      description: `${event.name} (${event.deviceId}) ${event.status === 'online' ? 'came online' : 'went offline'}`,
      type: 'device',
      metadata: event,
    });
  }

  @OnEvent('automation.triggered')
  handleAutomationTriggered(event: { ruleName: string; action: string }) {
    this.logActivity({
      action: 'Automation Rule Triggered',
      description: `Rule "${event.ruleName}" triggered: ${event.action}`,
      type: 'automation',
      metadata: event,
    });
  }
}
