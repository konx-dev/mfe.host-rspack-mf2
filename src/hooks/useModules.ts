import { useState, useEffect } from 'react';
import { registerRemotes } from '@module-federation/enhanced/runtime';
import { getAvailableModules, RemoteModule } from '../services/registry';

export const useModules = () => {
  const [registry, setRegistry] = useState<RemoteModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeRemotes = async () => {
      try {
        const modules = await getAvailableModules();
        
        registerRemotes(
          modules.map((module) => ({
            name: module.name,
            entry: module.entry,
          }))
        );

        setRegistry(modules);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load registry'));
      } finally {
        setIsLoading(false);
      }
    };

    initializeRemotes();
  }, []);

  return { registry, isLoading, error };
};

/*

Tests:

- Simulate a Network/Server Error
- Simulate an Empty/Null Registry
- Simulate malformed Data

*/