import { useState } from 'react';
import TodoList from './components/TodoList';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTodoCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-4xl mx-auto">
        <TodoList />
      </div>
    </div>
  );
}

export default App;
