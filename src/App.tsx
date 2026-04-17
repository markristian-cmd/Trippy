import { useMemo, useState } from 'react';

type TripItem = {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes: string;
};

type TodoItem = {
  id: string;
  text: string;
  done: boolean;
};

const initialTrips: TripItem[] = [];

function App() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [trips, setTrips] = useState<TripItem[]>(initialTrips);
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const canAdd = destination.trim() !== '' && startDate !== '' && endDate !== '';

  const totalTrips = trips.length;
  const upcomingTrips = trips.filter((trip) => new Date(trip.startDate) >= new Date()).length;

  const addTrip = () => {
    if (!canAdd) return;
    const item: TripItem = {
      id: crypto.randomUUID(),
      destination: destination.trim(),
      startDate,
      endDate,
      notes: notes.trim(),
    };
    setTrips((current) => [item, ...current]);
    setDestination('');
    setStartDate('');
    setEndDate('');
    setNotes('');
  };

  const removeTrip = (id: string) => {
    setTrips((current) => current.filter((trip) => trip.id !== id));
  };

  const addTodo = () => {
    if (!todoText.trim()) return;
    setTodos((current) => [{ id: crypto.randomUUID(), text: todoText.trim(), done: false }, ...current]);
    setTodoText('');
  };

  const toggleTodo = (id: string) => {
    setTodos((current) => current.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTodo = (id: string) => {
    setTodos((current) => current.filter((t) => t.id !== id));
  };

  const summary = useMemo(() => {
    if (trips.length === 0) {
      return 'Add your first trip details to get started.';
    }
    const dates = trips.map((trip) => new Date(trip.startDate));
    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    return `Next trip starts on ${earliest.toLocaleDateString()}.`;
  }, [trips]);

  return (
    <div className="app-shell">
      <header>
        <h1>Trip Planner</h1>
        <p>Plan trips, track dates, and save notes for every getaway.</p>
      </header>

      <section className="planner-card">
        <div className="planner-summary">
          <p>{summary}</p>
          <div className="stats-row">
            <span>Total trips: {totalTrips}</span>
            <span>Upcoming: {upcomingTrips}</span>
          </div>
        </div>

        <div className="planner-form">
          <label>
            Destination
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="City, country or region"
            />
          </label>
          <label>
            Start date
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </label>
          <label>
            End date
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </label>
          <label>
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Packing, reservations, reminders" />
          </label>
          <button type="button" disabled={!canAdd} onClick={addTrip}>
            Add trip
          </button>
        </div>
      </section>

      <section className="trip-list">
        <h2>Your trips</h2>
        {trips.length === 0 ? (
          <p className="empty-state">No trips saved yet.</p>
        ) : (
          <div className="trip-grid">
            {trips.map((trip) => (
              <article className="trip-card" key={trip.id}>
                <div className="trip-card-header">
                  <div>
                    <h3>{trip.destination}</h3>
                    <p>{trip.startDate} → {trip.endDate}</p>
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
      <section className="todo-list">
        <h2>To-do</h2>
        <div className="todo-form">
          <input
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a task..."
          />
          <button type="button" disabled={!todoText.trim()} onClick={addTodo}>Add</button>
        </div>
        {todos.length === 0 ? (
          <p className="empty-state">No tasks yet.</p>
        ) : (
          <>
            <p className="todo-count">{todos.filter((t) => t.done).length} / {todos.length} completed</p>
            <ul className="todo-items">
              {todos.map((todo) => (
                <li key={todo.id} className={`todo-item${todo.done ? ' done' : ''}`}>
                  <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} />
                  <span>{todo.text}</span>
                  <button className="remove-button" onClick={() => removeTodo(todo.id)}>Remove</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

export default App;
