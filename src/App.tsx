import React, { ChangeEvent, useMemo, useState } from 'react';

// --- CSS Keyframes for Animation ---
const pulseKeyframes = `
@keyframes pulse-cost {
    0% { transform: scale(1.0); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
    70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(236, 72, 153, 0); }
    100% { transform: scale(1.0); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
}
`;

// --- 1. TypeScript Interfaces ---

interface Part {
    id: string;
    name: string;
    category: string;
    basePrice: number;
}

interface PricingRule {
    region: string;
    multiplier: number;
}

interface CalculatedPart extends Part {
    adjustedPrice: number;
    lineCost: number;
    calculatedQuantity: number;
}

// --- 2. Data Sources (Mocked) ---

const partsCatalog: Part[] = [
    { id: 'CPU-001', name: 'High-Performance Processor (i9)', category: 'Processor', basePrice: 450.00 },
    { id: 'CPU-002', name: 'Mid-Range Processor (i5)', category: 'Processor', basePrice: 210.00 },
    { id: 'MEM-003', name: '32GB DDR5 RAM Module', category: 'Memory', basePrice: 120.50 },
    { id: 'MEM-004', name: '16GB DDR4 RAM Module', category: 'Memory', basePrice: 55.00 },
    { id: 'STR-005', name: '1TB NVMe SSD', category: 'Storage', basePrice: 85.00 },
    { id: 'STR-006', name: '4TB HDD Storage', category: 'Storage', basePrice: 65.00 },
    { id: 'NET-007', name: '10G Ethernet Card', category: 'Network', basePrice: 115.00 },
    { id: 'PWR-008', name: '750W Platinum PSU', category: 'Power Supply', basePrice: 155.00 },
    { id: 'PWR-009', name: '850W Gold PSU', category: 'Power Supply', basePrice: 175.00 },
    { id: 'NET-010', name: '5G WiFi Adapter', category: 'Network', basePrice: 45.00 },
    { id: 'STR-011', name: '512GB SATA SSD', category: 'Storage', basePrice: 60.00 },
];

const pricingCatalog: Record<string, PricingRule> = {
    'Processor': { region: 'US-West', multiplier: 1.05 },
    'Memory': { region: 'EU-Central', multiplier: 0.98 },
    'Storage': { region: 'Asia-Pac', multiplier: 1.10 },
    'Network': { region: 'Global', multiplier: 1.00 },
    'Power Supply': { region: 'Global', multiplier: 1.00 },
};

const previousPageValue: number = 500.00; // Mock Setup Fee

// --- 3. Utility Functions ---

const formatCurrency = (amount: number): string => 
    `$${(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// --- 4. Main Component (App) ---

const App: React.FC = () => {
    // Determine all unique categories from the data once
    const allCategories: string[] = useMemo(() => {
        return Array.from(new Set(partsCatalog.map(p => p.category)));
    }, []);

    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [globalQuantity, setGlobalQuantity] = useState<number>(50);
    const [usePrevData, setUsePrevData] = useState<boolean>(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategories);
    const [isPulsing, setIsPulsing] = useState<boolean>(false);

    // --- Derived State (useMemo for efficiency) ---

    const categoriesToFilter: string[] = useMemo(() => 
        selectedCategories.length > 0 ? selectedCategories : allCategories, 
    [selectedCategories, allCategories]);

    const globalQty: number = useMemo(() => globalQuantity || 0, [globalQuantity]);

    // Computed Property: Filters the data and performs per-item calculations
    const filteredResults: CalculatedPart[] = useMemo(() => {
        if (globalQty === 0) {
            return [];
        }

        const term = searchTerm.toLowerCase().trim();

        return partsCatalog
            .filter(part => {
                const matchesCategory = categoriesToFilter.includes(part.category);
                let matchesSearch = true;

                // Apply search filter if there's any search term
                if (term.length > 0) {
                    matchesSearch = part.name.toLowerCase().includes(term) || 
                                    part.id.toLowerCase().includes(term) ||
                                    part.category.toLowerCase().includes(term);
                }
                return matchesCategory && matchesSearch;
            })
            .map(part => {
                const pricing = pricingCatalog[part.category] || { multiplier: 1.0 };
                const liveMultiplier = pricing.multiplier;
                
                const adjustedPrice = part.basePrice * liveMultiplier;
                const lineCost = adjustedPrice * globalQty;
                
                return {
                    ...part,
                    adjustedPrice,
                    lineCost,
                    calculatedQuantity: globalQty,
                };
            });
    }, [searchTerm, globalQty, categoriesToFilter]);

    // Computed Property: Calculates the final total project cost
    const totalProjectCost: number = useMemo(() => {
        let newTotalCost = filteredResults.reduce((sum, item) => sum + item.lineCost, 0);
        
        if (usePrevData) {
            newTotalCost += previousPageValue;
        }

        // Trigger pulse animation when cost changes
        if (!isPulsing) {
             setIsPulsing(true);
             setTimeout(() => setIsPulsing(false), 700);
        }
        
        return newTotalCost;
    }, [filteredResults, usePrevData, isPulsing]);

    const getNoResultsText = (): string => {
        if (globalQty === 0) {
            return "Please enter a valid quantity (> 0) to proceed with calculation.";
        }
        return "No parts match your current filter and search settings.";
    };

    // --- Event Handlers ---

    const handleCategoryChange = (category: string) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        );
    };

    const toggleAllCategories = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedCategories(allCategories);
        } else {
            setSelectedCategories([]);
        }
    };
    
    // Icon component (using a simple SVG for aesthetics)
    const IconComponent: React.FC<{ path: string, className?: string }> = ({ path, className = '' }) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d={path} />
        </svg>
    );
    
    // --- UI Structure (JSX) ---
    return (
        // Include custom keyframes in a style block
        <div className="bg-gray-900 min-h-screen p-4 sm:p-8 font-['Inter']">
            <style>{pulseKeyframes}</style>
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-white mb-3">
                        <span className="text-pink-500">PROJECT</span> ESTIMATOR
                    </h1>
                    <p className="text-lg text-gray-400 font-medium">
                        Real-time dynamic cost simulation
                    </p>
                </header>

                {/* Main Grid Layout */}
                <main className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    
                    {/* 1. Filter Panel (LHS) */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Global Quantity & Search Card */}
                        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <IconComponent path="M15 15l6 6" className="w-5 h-5 text-pink-500"/>
                                Controls
                            </h2>
                            
                            {/* Global Quantity Input */}
                            <div>
                                <label htmlFor="globalQuantity" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Required Quantity
                                </label>
                                <input 
                                    type="number" 
                                    id="globalQuantity" 
                                    min="1" 
                                    value={globalQuantity}
                                    onChange={(e) => setGlobalQuantity(parseInt(e.target.value) || 0)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                                />
                            </div>

                            {/* Live Search */}
                            <div>
                                <label htmlFor="liveSearch" className="block text-sm font-semibold text-gray-300 mb-2">
                                    Part Search
                                </label>
                                <input 
                                    type="text" 
                                    id="liveSearch" 
                                    placeholder="Search name, ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                                />
                            </div>
                        </div>

                        {/* Category Filter Card */}
                        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <IconComponent path="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" className="w-5 h-5 text-pink-500"/>
                                Categories
                            </h2>
                            
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {/* Select All */}
                                <div className="flex items-center pb-3 border-b border-gray-700">
                                    <input 
                                        type="checkbox" 
                                        id="selectAll" 
                                        checked={selectedCategories.length === allCategories.length}
                                        onChange={toggleAllCategories}
                                        className="h-5 w-5 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 transition-all duration-200" 
                                    />
                                    <label htmlFor="selectAll" className="ml-3 block text-sm font-bold text-white cursor-pointer">
                                        Select All Components
                                    </label>
                                </div>
                                
                                {/* Individual Categories */}
                                <div className="space-y-2">
                                    {allCategories.map(category => {
                                        const id = `filter-${category.replace(/\s/g, '')}`;
                                        const isChecked = selectedCategories.includes(category);
                                        return (
                                            <div key={id} className="flex items-center group">
                                                <input 
                                                    type="checkbox" 
                                                    id={id} 
                                                    value={category} 
                                                    checked={isChecked}
                                                    onChange={() => handleCategoryChange(category)}
                                                    className="h-4 w-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500 transition-all duration-200" 
                                                />
                                                <label 
                                                    htmlFor={id} 
                                                    className={`ml-3 block text-sm transition-all duration-200 cursor-pointer ${isChecked ? 'font-semibold text-pink-400' : 'text-gray-400 group-hover:text-white'}`}
                                                >
                                                    {category}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 2. Main Content (RHS) */}
                    <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                        
                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            
                            {/* Total Cost Metric (Animated) */}
                            <div className={`col-span-1 md:col-span-2 bg-gradient-to-br from-pink-600 to-purple-600 p-6 rounded-2xl text-center shadow-2xl transition-all duration-300 ${isPulsing ? 'animate-pulse-cost' : 'hover:scale-[1.01]'} border-4 border-pink-400/50`}
                                style={{ animation: isPulsing ? 'pulse-cost 0.7s ease-out' : 'none' }}>
                                <p className="text-sm font-bold text-white/90 uppercase mb-2 tracking-wider">Estimated Total Project Cost</p>
                                <p className="text-5xl md:text-6xl font-black text-white" id="totalProjectCostDisplay">
                                    {formatCurrency(totalProjectCost)}
                                </p>
                            </div>
                            
                            {/* Other Metrics */}
                            <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <MetricBox 
                                    label="Included Items" 
                                    value={filteredResults.length.toLocaleString()} 
                                    color="blue"
                                />
                                <MetricBox 
                                    label="Global Qty" 
                                    value={globalQty.toLocaleString()} 
                                    color="green"
                                />
                                <MetricBox 
                                    label="Setup Fee" 
                                    value={usePrevData ? formatCurrency(previousPageValue) : 'Not Applied'} 
                                    color="yellow"
                                />
                                <MetricBox 
                                    label="Catalog Parts" 
                                    value={partsCatalog.length.toLocaleString()} 
                                    color="red"
                                />
                            </div>
                        </div>

                        {/* Results Table Card */}
                        <div className="bg-gray-800 p-0 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
                            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <IconComponent path="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" className="w-5 h-5 text-pink-500"/>
                                    Line Item Breakdown
                                </h3>
                                <div className="flex items-center text-sm text-gray-400">
                                    Showing {filteredResults.length} of {partsCatalog.length} parts
                                </div>
                            </div>

                            <div className="overflow-x-auto max-h-[70vh]">
                                <table className="min-w-full divide-y divide-gray-700 table-fixed">
                                    <thead className="sticky top-0 bg-gray-700/80 backdrop-blur-sm">
                                        <tr>
                                            <th className="w-[30%] px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Part Name</th>
                                            <th className="w-[15%] px-4 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Category</th>
                                            <th className="w-[13%] px-4 py-3 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">Base Price</th>
                                            <th className="w-[13%] px-4 py-3 text-right text-xs font-bold text-teal-400 uppercase tracking-wider">Adj. Price</th>
                                            <th className="w-[10%] px-4 py-3 text-right text-xs font-bold text-gray-300 uppercase tracking-wider">Qty</th>
                                            <th className="w-[19%] px-4 py-3 text-right text-xs font-bold text-pink-400 uppercase tracking-wider">Line Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700" id="resultsTableBody">
                                        {filteredResults.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-700/50 transition-all duration-200">
                                                <td className="px-4 py-3 text-sm font-medium text-white truncate">{item.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-400 truncate">{item.category}</td>
                                                <td className="px-4 py-3 text-sm text-gray-400 text-right">{formatCurrency(item.basePrice)}</td>
                                                <td className="px-4 py-3 text-sm font-semibold text-teal-400 text-right">{formatCurrency(item.adjustedPrice)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-400 text-right">{item.calculatedQuantity.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-sm font-extrabold text-pink-400 text-right">{formatCurrency(item.lineCost)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* No Results Message */}
                            {filteredResults.length === 0 && (
                                <div className="p-8 text-center bg-gray-700/50 rounded-b-xl">
                                    <p className="text-gray-300 font-semibold text-lg">
                                        {getNoResultsText()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Metric Box Component with color customization
const MetricBox: React.FC<{ label: string, value: string, color: 'blue' | 'green' | 'yellow' | 'red' }> = ({ label, value, color }) => {
    
    let baseColor = 'text-blue-400 bg-blue-500/10 border-blue-400';
    let valueColor = 'text-blue-300';
    
    switch (color) {
        case 'green':
            baseColor = 'text-green-400 bg-green-500/10 border-green-400';
            valueColor = 'text-green-300';
            break;
        case 'yellow':
            baseColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-400';
            valueColor = 'text-yellow-300';
            break;
        case 'red':
            baseColor = 'text-red-400 bg-red-500/10 border-red-400';
            valueColor = 'text-red-300';
            break;
    }

    return (
        <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${baseColor}`}>
            <p className="text-xs font-bold uppercase mb-1 tracking-wider">{label}</p>
            <p className={`text-xl font-extrabold ${valueColor}`}>{value}</p>
        </div>
    );
};

export default App;
