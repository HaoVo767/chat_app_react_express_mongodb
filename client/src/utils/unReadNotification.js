export const unReadNotificationsFunc = (notifications) => {
  return notifications.filter((noti) => noti?.isRead === false);
};
