// Mocked remote registry

export interface RemoteModule {
  name: string;
  entry: string;
}

export const getAvailableModules = async (): Promise<RemoteModule[]> => {
  // Simulated network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simulated network failure
  //throw new Error("Failed to fetch registry: Internal Server Error (500)");

  const allModules: RemoteModule[] = [
    { 
      name: 'weather_v1', 
      entry: 'http://localhost:3010/remoteEntry.js' 
    },
    {
      name: 'broken_v1', 
      entry: 'http://localhost:3099/remoteEntry.js' 
    }
  ];

  return allModules;
};