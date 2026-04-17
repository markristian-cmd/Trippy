import { useMemo, useState } from 'react';

type TripItem = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string;
};

function formatDate(iso: string) {
  return new Date(iso + 'T00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function getDuration(start: string, end: string) {
  const days = Math.round(
    (new Date(end + 'T00:00').getTime() - new Date(start + 'T00:00').getTime()) / 86_400_000
  ) + 1;
  return days === 1 ? '1 day' : `${days} days`;
}

function App() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [trips, setTrips] = useState<TripItem[]>([]);

  const canAdd = destination.trim() !== '' && startDate !== '' && endDate !== '';

  const upcomingTrips = trips.filter((t) => new Date(t.startDate) >= new Date()).length;

  const addTrip = () => {
    if (!canAdd) return;
    setTrips((current) => [
      { id: crypto.randomUUID(), destination: destination.trim(), startDate, endDate, notes: notes.trim() },
      ...current,
    ]);
    setDestination('');
    setStartDate('');
    setEndDate('');
    setNotes('');
  };

  const removeTrip = (id: string) => {
    setTrips((current) => current.filter((t) => t.id !== id));
  };

  const summary = useMemo(() => {
    if (trips.length === 0) return 'Where will you go next?';
    const upcoming = trips
      .filter((t) => new Date(t.startDate) >= new Date())
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
    if (upcoming.length === 0) return 'All trips are in the past — time to plan a new one.';
    return `Next: ${upcoming[0].destination}, departing ${formatDate(upcoming[0].startDate)}`;
  }, [trips]);

  return (
    <div className="app-shell">
      <header>
        <h1>Trip <span>Planner</span></h1>
        <div className="header-rule"><div className="header-rule-diamond" /></div>
        <p>Plan trips, track dates, and save notes for every getaway.</p>
      </header>

      <section className="planner-card">
        <div className="planner-summary">
          <p>{summary}</p>
          <div className="stats-row">
            <span><strong>{trips.length}</strong> total</span>
            <span><strong>{upcomingTrips}</strong> upcoming</span>
          </div>
        </div>

        <p className="section-label">New destination</p>
        <div className="planner-form">
          <label>
            Destination
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="City, country or region"
            />
          </label>
          <label>
            Start date
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End date
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <label>
            Notes
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Packing list, reservations, reminders…"
            />
          </label>
          <button type="button" className="add-button" disabled={!canAdd} onClick={addTrip}>
            Add trip
          </button>
        </div>
      </section>

      <section className="trip-list">
        <div className="trip-list-header">
          <h2>Your trips</h2>
          {trips.length > 0 && (
            <span className="trip-count-badge">{trips.length} saved</span>
          )}
        </div>

        {trips.length === 0 ? (
          <p className="empty-state">No trips saved yet.</p>
        ) : (
          <div className="trip-grid">
            {trips.map((trip, i) => (
              <article
                className="trip-card"
                key={trip.id}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="trip-card-header">
                  <div>
                    <h3>{trip.destination}</h3>
                    <p className="trip-dates">
                      {formatDate(trip.startDate)}
                      <span className="arrow">▶</span>
                      {formatDate(trip.endDate)}
                      <span className="trip-duration">{getDuration(trip.startDate, trip.endDate)}</span>
                    </p>
                  </div>
                  <button className="remove-button" onClick={() => removeTrip(trip.id)}>
                    Remove
                  </button>
                </div>
                {trip.notes && <p className="trip-notes">{trip.notes}</p>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
