import { createRoot } from 'react-dom/client';

const App = () => (
  <div>
    <h1>Shell Application (Host)</h1>
    <p>This is the main container.</p>
  </div>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);