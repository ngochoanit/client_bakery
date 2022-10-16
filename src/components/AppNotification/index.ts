import { ReactNode } from 'react';
import { notification } from 'antd';
import './index.less';
import { NotificationPlacement } from 'antd/lib/notification';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const openNotificationWithIcon = (
  type: NotificationType,
  message: ReactNode,
  description: ReactNode,
  placement: NotificationPlacement = 'top',
  duration = 3,
) => {
  notification[type]({
    message,
    description,
    duration,
    placement,
    className: `app-notification-${type}`,
  });
};
