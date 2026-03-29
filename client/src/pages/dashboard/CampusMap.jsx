import { useMemo, useState } from 'react';
import { Map } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useCampusData } from '../../hooks/queries/useCampusData';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CampusMap = () => {
    const [view, setView] = useState('campus'); // campus, block, room
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const { data, isLoading: loading } = useCampusData();
    const buildingsRaw = useMemo(() => data?.buildings || [], [data?.buildings]);
    const allRooms = useMemo(() => data?.allRooms || [], [data?.allRooms]);

    const buildings = useMemo(() => {
        // Mock coordinate data for buildings (Florya Campus approx area)
        const buildingCoordinates = {
            A: [40.9922, 28.7963],
            B: [40.9930, 28.7960],
            C: [40.9918, 28.7975],
            D: [40.9925, 28.7980],
            E: [40.9910, 28.7955],
            J: [40.9935, 28.7970]
        };

        const stableOffset = (id, axis = 0) => {
            const source = `${id || 'X'}:${axis}`;
            let hash = 0;
            for (let i = 0; i < source.length; i += 1) {
                hash = ((hash << 5) - hash) + source.charCodeAt(i);
                hash |= 0;
            }
            const normalized = Math.abs(hash % 1000) / 1000;
            return normalized * 0.002;
        };

        const stableOccupancy = (id) => {
            const source = id || 'X';
            let hash = 0;
            for (let i = 0; i < source.length; i += 1) {
                hash = ((hash << 5) - hash) + source.charCodeAt(i);
                hash |= 0;
            }
            return 40 + (Math.abs(hash) % 41);
        };

        return buildingsRaw.map(b => {
            const blockLetter = b.id.split('-')[1];
            return {
                ...b,
                coords: buildingCoordinates[blockLetter] || [40.9922 + stableOffset(b.id, 0), 28.7963 + stableOffset(b.id, 1)],
                occupancy: stableOccupancy(b.id)
            };
        });
    }, [buildingsRaw]);

    // Derived Data
    const blockRooms = selectedBlock ? allRooms.filter(r => r.block === selectedBlock.id) : [];
    const floors = selectedBlock ? [...new Set(blockRooms.map(r => r.floor))].sort() : [];

    // Stats
    const totalCapacity = allRooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
    const totalLabs = allRooms.filter(r => r.type === 'Laboratory').length;
    const totalOffices = allRooms.filter(r => r.type === 'Office').length;

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Kampüs İkizi (Digital Twin)"
                description="Tüm kampüs binaları, katları ve odalarının canlı simülasyonu."
                icon={Map}
                action={view !== 'campus' && (
                    <button
                        onClick={() => {
                            if (view === 'room') setView('block');
                            else setView('campus');
                        }}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft size={16} /> Geri Dön
                    </button>
                )}
            />

            {/* Global Stats */}
            {view === 'campus' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Toplam Bina</p>
                                <h3 className="text-2xl font-bold">{buildings.length}</h3>
                            </div>
                            <Box className="text-blue-500" size={24} />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Toplam Oda</p>
                                <h3 className="text-2xl font-bold">{allRooms.length}</h3>
                            </div>
                            <Layers className="text-purple-500" size={24} />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Toplam Kapasite</p>
                                <h3 className="text-2xl font-bold">{totalCapacity.toLocaleString()}</h3>
                            </div>
                            <Users className="text-green-500" size={24} />
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Lab & Ofis</p>
                                <h3 className="text-2xl font-bold">{totalLabs} / {totalOffices}</h3>
                            </div>
                            <MapPin className="text-orange-500" size={24} />
                        </div>
                    </Card>
                </div>
            )}

            {/* View: Campus Map (Interactive Leaflet Map) */}
            {view === 'campus' && (
                <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                    <MapContainer
                        center={[40.9922, 28.7963]}
                        zoom={17}
                        scrollWheelZoom={true}
                        className="h-full w-full z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />

                        {buildings.map(b => (
                            <Marker
                                key={b.id}
                                position={b.coords}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedBlock(b);
                                        // Not changing view to block immediately, let user see popup first
                                    },
                                }}
                            >
                                <Popup className="rounded-xl">
                                    <div className="p-1 min-w-[200px]">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-slate-800">{b.name}</h3>
                                            <Badge variant={b.type === 'Academic' ? 'primary' : 'secondary'}>{b.type}</Badge>
                                        </div>

                                        <div className="space-y-3 mt-4">
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-500 font-medium">Anlık Yoğunluk</span>
                                                    <span className={`font-bold ${b.occupancy > 75 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        %{b.occupancy}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                                    <div className={`h-1.5 rounded-full ${b.occupancy > 75 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${b.occupancy}%` }}></div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <div className="flex items-center gap-1.5">
                                                    <Layers size={14} className="text-blue-500" />
                                                    <span>{allRooms.filter(r => r.block === b.id).length} Oda</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users size={14} className="text-purple-500" />
                                                    <span>{b.floors} Kat</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => { setSelectedBlock(b); setView('block'); }}
                                                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                                            >
                                                Bina İçine Gir &rarr;
                                            </button>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            )}

            {/* View: Block Detail */}
            {view === 'block' && selectedBlock && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar: Floors */}
                    <div className="lg:col-span-1 space-y-4">
                        <Card className="bg-slate-900 text-white border-0 p-6">
                            <h2 className="text-xl font-bold mb-1">{selectedBlock.name}</h2>
                            <p className="text-slate-400 text-sm mb-6">{selectedBlock.type}</p>
                            <div className="space-y-2">
                                {floors.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setSelectedFloor(f)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${selectedFloor === f
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                    >
                                        <span className="font-medium capitalize">{f.replace('-', ' ')}</span>
                                        <span className="text-xs opacity-70 bg-black/20 px-2 py-1 rounded">
                                            {blockRooms.filter(r => r.floor === f).length} Rooms
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Main Content: Room Grid */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <Layers className="text-blue-600" size={20} />
                                {selectedFloor ? String(selectedFloor).replace('-', ' ').toUpperCase() : 'Select a Floor'}
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Oda ara..."
                                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>
                        </div>

                        {selectedFloor ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {blockRooms.filter(r => r.floor === selectedFloor).map(room => (
                                    <div
                                        key={room.id}
                                        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-400 font-mono">
                                                {room.name.split(' ').pop()}
                                            </span>
                                            <div className={`w-2 h-2 rounded-full ${room.capacity > 40 ? 'bg-green-500' : 'bg-amber-500'}`} />
                                        </div>
                                        <h4 className="font-semibold text-slate-800 text-sm mb-1 truncate" title={room.name}>
                                            {room.subtype || room.type}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Users size={12} />
                                            <span>{room.capacity}</span>
                                            {room.features?.includes("Projector") && <span className="text-blue-600">• Proj.</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
                                <p className="text-slate-400 font-medium">Lütfen sol menüden bir kat seçin.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampusMap;
