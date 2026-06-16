import { Bell, Calendar, Megaphone, AlertCircle } from 'lucide-react';

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

export default function Notifications() {
  const notices = notifications.filter(n => n.type === 'notice');
  const events = notifications.filter(n => n.type === 'event');

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
            {notices.map((n, i) => (
              <div className="card" key={i} style={{ borderLeft: '4px solid var(--warning)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{n.icon}</span> {n.title}
                  </h4>
                  <span className="badge warning">{n.date}</span>
                </div>
                <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>{n.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div className="section">
          <h2 className="section-title"><Calendar size={22} className="icon" />Upcoming Events</h2>
          <div className="flex-col gap-md">
            {events.map((e, i) => (
              <div className="card" key={i} style={{ borderLeft: '4px solid var(--primary)' }}>
                <div className="flex-between" style={{ marginBottom: 'var(--space-sm)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{e.icon}</span> {e.title}
                  </h4>
                  <span className="badge primary">{e.date}</span>
                </div>
                <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>{e.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
