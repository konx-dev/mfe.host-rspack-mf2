import React, { useMemo, lazy, Suspense } from 'react';
import { loadRemote } from '@module-federation/enhanced/runtime';
import { ModuleErrorBoundary } from './ModuleErrorBoundary';

interface ModuleLoaderProps {
  name: string;
  fallback?: React.ReactNode;
}

export const ModuleLoader = ({ name, fallback = "Loading module..." }: ModuleLoaderProps) => {
  const LazyComponent = useMemo(() => lazy(async () => {
    const module = await loadRemote<any>(`${name}/Widget`);
    return { default: module.default || module };
  }), [name]);

  return (
    <ModuleErrorBoundary name={name}>
      <Suspense fallback={<div>{fallback}</div>}>
        <LazyComponent />
      </Suspense>
    </ModuleErrorBoundary>
  );
};