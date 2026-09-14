import { prisma } from '../../config/database.js';

export class NotificationService {
  async sendTokenSms(mobile: string, token: string, roomNo: string) {
    const message = `Namaste. Your MediKiosk OPD Token is ${token}. Assigned to ${roomNo}. Please wait for your turn.`;

    await prisma.notification.create({
      data: {
        type: 'SMS_TOKEN',
        title: 'OPD Token Issued',
        message,
        priority: 'NORMAL',
        recipientRole: 'PATIENT',
      },
    });

    return {
      sent: true,
      mobile,
      provider: 'NIC_GATEWAY_SIMULATOR',
      message,
      timestamp: new Date().toISOString(),
    };
  }

  async dispatchStaffEmergencyAlert(alertId: string, kioskId: string, notes?: string) {
    await prisma.notification.create({
      data: {
        type: 'STAFF_DISPATCH',
        title: 'Emergency Triage Dispatch',
        message: notes || `Red flag alert ${alertId} dispatched from kiosk ${kioskId}.`,
        priority: 'URGENT',
        recipientRole: 'STAFF',
      },
    });

    return {
      dispatched: true,
      alertId,
      kioskId,
      broadcastChannel: 'OPD_TRIAGE_EMERGENCY_DESK',
      timestamp: new Date().toISOString(),
    };
  }
}

export const notificationService = new NotificationService();
