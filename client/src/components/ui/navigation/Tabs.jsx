
const Tabs = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="flex p-1 bg-slate-100 rounded-xl mb-6 w-full md:w-auto">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
            flex-1 md:flex-none px-6 py-2 text-sm font-bold rounded-lg transition-all
            ${activeTab === tab.id
                            ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }
          `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
