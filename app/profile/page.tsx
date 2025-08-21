export default function ProfilePage() {
  return (
     <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Navigation (formerly sidebar) */}
      <div className="bg-blue-700 text-white rounded-lg shadow p-4 flex gap-6 overflow-x-auto">
        <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Overview</a>
        <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">My Projects</a>
        <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Settings</a>
        <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Notifications</a>
        <a href="#" className="hover:bg-blue-600 px-4 py-2 rounded">Logout</a>
      </div>

      {/* Main Content */}
      <main className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900">👤 Your Profile</h1>
        <p className="mt-2 text-gray-700">This is where user details will go.</p>

        {/* Profile Info Card */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
          <p className="mt-2 text-gray-600">📛 <span className="font-medium">Name:</span> John Doe</p>
          <p className="text-gray-600">📧 <span className="font-medium">Email:</span> johndoe@email.com</p>
          <p className="text-gray-600">📚 <span className="font-medium">Skills:</span> Web Dev, AI, IoT</p>
          <p className="text-gray-600">📅 <span className="font-medium">Year:</span> 3rd Year, CSE</p>
        </div>
      </main>
    </div>
  );
}
