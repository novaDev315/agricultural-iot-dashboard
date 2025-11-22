import { Module, forwardRef } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { DevicesModule } from '../devices/devices.module';
import { SensorsModule } from '../sensors/sensors.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    DevicesModule,
    SensorsModule,
    forwardRef(() => WebsocketModule),
  ],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
