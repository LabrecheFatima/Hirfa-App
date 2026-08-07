
import './App.css'
import { useAuth } from './hooks/useAuth';
import { Role } from './types';

function App() {
  const { 
    authenticated, 
    user, 
    login, 
    logout, 
    hasRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Hirfa Platform</h1>
        
        {authenticated ? (
          <div>
            <p className="text-green-600 font-medium mb-2">Authenticated!</p>
            <p className="text-gray-600 text-sm mb-4">Welcome, {user?.firstName || user?.email}</p>
            
            <div className="space-y-1 text-xs text-gray-500 mb-6 border-t pt-3">
              <p>Is Organiser: {hasRole(Role.ORGANISER) ? 'Yes' : 'No'}</p>
              <p>Is Staff: {hasRole(Role.STAFF) ? 'Yes' : 'No'}</p>
              <p>Is Attendee: {hasRole(Role.ATTENDEE) ? 'Yes' : 'No'}</p>
            </div>

            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-6">You are currently unauthenticated.</p>
            <button
              onClick={login}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Sign In with Keycloak
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
