import { Bell, Calendar, Megaphone, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { notificationsAPI } from '../data/api';

const notifications = [
  { title: 'Water Supply Notice', message: 'Due to pipeline repair work, water supply may be disrupted. Please store water accordingly.', type: 'notice', date: '2025-06-20', icon: '💧' },
  { title: 'Gram Sabha Meeting', message: 'Monthly Gram Sabha meeting scheduled at Village Panchayat Office. All residents are requested to attend.', type: 'event', date: '2025-06-25', icon: '🏛️' },
  { title: 'Health Camp', message: 'Free health check-up camp organized by District Hospital. Eye check-up, sugar, BP testing available.', type: 'event', date: '2025-06-28', icon: '🏥' },
  { title: 'Vaccination Drive', message: 'Polio vaccination drive for children below 5 years. Anganwadi centers will serve as vaccination points.', type: 'notice', date: '2025-07-01', icon: '💉' },
  { title: 'PM Kisan Registration', message: 'Last date for PM Kisan new registration is July 15. Contact Panchayat Secretary with Aadhaar and bank details.', type: 'notice', date: '2025-07-15', icon: '🌾' },
  { title: 'Independence Day', message: 'Independence Day celebrations at Government School ground. Flag hoisting at 8 AM followed by cultural program.', type: 'event', date: '2025-08-15', icon: '🇮🇳' },
  { title: 'Village Festival', message: 'Annual Seetharampuram village festival celebrations. All community members invited for pooja and cultural events.', type: 'event', date: '2025-09-10', icon: '🎉' },
  { title: 'Power Shutdown Notice', message: 'Scheduled power shutdown for maintenance from 9 AM to 5 PM.', type: 'notice', date: '2025-07-05', icon: '⚡' },
];

const defaultIcons = {
  notice: '📢',
  event: '📅'
};

function getNoticeIcon(n) {
  if (n.icon) return n.icon;
  const title = (n.title || '').toLowerCase();
  if (title.includes('water')) return '💧';
  if (title.includes('meeting') || title.includes('sabha')) return '🏛️';
  if (title.includes('health')) return '🏥';
  if (title.includes('vaccination') || title.includes('polio')) return '💉';
  if (title.includes('kisan') || title.includes('farmer')) return '🌾';
  if (title.includes('independence')) return '🇮🇳';
  if (title.includes('festival') || title.includes('pooja')) return '🎉';
  if (title.includes('power') || title.includes('electricity') || title.includes('shutdown')) return '⚡';
  return defaultIcons[n.type] || '🔔';
}

export default function Notifications() {
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationsAPI.getAll();
        setNotificationsList(data.length > 0 ? data : notifications);
      } catch (err) {
        console.warn('Failed to load notifications from API, falling back to static:', err);
        setNotificationsList(notifications);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const notices = notificationsList.filter(n => n.type === 'notice');
  const events = notificationsList.filter(n => n.type === 'event');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="text-gradient">Notifications & Events</h1>
        <p>Village announcements, notices, and upcoming events</p>
      </div>

      <div className="grid-2">
        {/* Notices */}
        <div className="section">
          <h2 className="section-title"><Megaphone size={22} className="icon" />Notices</h2>
          <div className="flex-col gap-md">
            {notices.map((n, i) => {
              const icon = getNoticeIcon(n);
              const date = n.event_date || n.date || 'N/A';
              return (
                <div className="card" key={i} style={{ borderLeft: '4px solid var(--warning)' }}>
                  <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{icon}</span> {n.title}
                    </h4>
                    <span className="badge warning">{date}</span>
                  </div>
                  <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>{n.message}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events */}
        <div className="section">
          <h2 className="section-title"><Calendar size={22} className="icon" />Upcoming Events</h2>
          <div className="flex-col gap-md">
            {events.map((e, i) => {
              const icon = getNoticeIcon(e);
              const date = e.event_date || e.date || 'N/A';
              return (
                <div className="card" key={i} style={{ borderLeft: '4px solid var(--primary)' }}>
                  <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{icon}</span> {e.title}
                    </h4>
                    <span className="badge primary">{date}</span>
                  </div>
                  <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>{e.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
