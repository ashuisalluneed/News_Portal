import Layout from '@/components/Layout';

export default function SettingsPage() {
    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

                <div className="bg-white shadow rounded-lg p-6 space-y-6">
                    <div className="border-b pb-4">
                        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Dark Mode</p>
                                <p className="text-sm text-gray-500">Toggle dark theme</p>
                            </div>
                            <button className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                Coming Soon
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email Alerts</p>
                                <p className="text-sm text-gray-500">Get daily news digest</p>
                            </div>
                            <button className="bg-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
