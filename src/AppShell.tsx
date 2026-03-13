import { useModules } from './hooks/useModules';
import { ModuleLoader } from './components/ModuleLoader';

export const AppShell = () => {
  const { registry, isLoading, error } = useModules();

  // Handle Global Loading State
  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Connecting to Registry Service...</p>
      </div>
    );
  }

  // Handle Global Registry Error (API is down)
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>System Initialization Failed</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  // Render the Shell and iterate through discovered modules
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ borderBottom: '1px solid #eee', marginBottom: '20px' }}>
        <h1>Module Federation 2.0 Shell</h1>
        <nav>Status: Connected to {registry.length} module(s)</nav>
      </header>

      <main style={{ display: 'grid', gap: '20px' }}>
        {registry.length === 0 ? (
          <p>No modules available for your account.</p>
        ) : (
          registry.map((mod) => (
            <section key={mod.name}>
              {/* Each ModuleLoader is isolated. 
                If one fails, the others (and the Shell) stay up. 
              */}
              <ModuleLoader 
                name={mod.name} 
                fallback={<div>Booting {mod.name}...</div>} 
              />
            </section>
          ))
        )}
      </main>
    </div>
  );
};