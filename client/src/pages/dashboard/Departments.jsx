
export default function Departments() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <span className="text-2xl">🏛️</span>
                        </div>
                        Akademik Yapı Yönetimi
                    </h1>
                    <p className="text-gray-500 mt-1 ml-12">
                        Üniversite akademik birimlerini ve hiyerarşisini düzenleyin.
                    </p>
                </div>
            </div>

            <DepartmentTree />
        </div>
    );
}
