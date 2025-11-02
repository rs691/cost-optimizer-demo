import React, { ChangeEvent, useMemo, useState } from 'react';

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

// --- 4. Main Component ---

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
                // Calculation Workflow Steps 1, 2, 3
                const pricing = pricingCatalog[part.category] || { multiplier: 1.0 };
                const liveMultiplier = pricing.multiplier;
                
                // Step 1: Base Cost (not strictly needed, but shown for flow)
                // const baseCost = part.basePrice * globalQty; 
                
                // Step 2 & 3: Dynamic Adjustment and Line Item Cost
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


    // Computed Property: Calculates the final total project cost (Calculation Workflow Step 4)
    const totalProjectCost: number = useMemo(() => {
        // Sum of all line costs
        let newTotalCost = filteredResults.reduce((sum, item) => sum + item.lineCost, 0);
        
        // Add setup fee if enabled
        if (usePrevData) {
            newTotalCost += previousPageValue;
        }
        
        return newTotalCost;
    }, [filteredResults, usePrevData]);


    const showNoResultsMessage: boolean = useMemo(() => 
        filteredResults.length === 0 && globalQty !== 0,
    [filteredResults, globalQty]);


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
    
    // Helper to determine the text for the "No Results" message
    const getNoResultsText = (): string => {
        if (globalQty === 0) {
            return "Please enter a valid quantity (> 0) to proceed with calculation.";
        }
        return "No parts match your selected filters and search term.";
    };


    // --- UI Structure (JSX) ---
    return (
        <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen p-4 sm:p-8 font-['Inter']">
            <div className="max-w-7xl mx-auto">
                
                {/* Header */}
                <header className="text-center mb-10">
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3">
                        Cost Optimization Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 mt-2 font-medium">
                        Dynamic estimation leveraging live pricing and project context
                    </p>
                </header>

                {/* Main Grid Layout */}
                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* 1. Filtering Panel (Inputs & Summary) */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 h-fit transition-all duration-300 hover:shadow-purple-200/50">
                        <h2 className="text-xl font-bold pb-3 mb-4 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">⚙️</span>
                            Project Inputs & Filters
                        </h2>
                        
                        {/* Live Search */}
                        <div className="mb-6">
                            <label htmlFor="liveSearch" className="block text-sm font-semibold text-gray-700 mb-2">
                                🔍 Search
                            </label>
                            <input 
                                type="text" 
                                id="liveSearch" 
                                placeholder="Search part name, ID, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 placeholder-gray-400"
                            />
                        </div>

                        {/* Global Quantity Input */}
                        <div className="mb-6">
                            <label htmlFor="globalQuantity" className="block text-sm font-semibold text-gray-700 mb-2">
                                📦 Global Required Quantity
                            </label>
                            <input 
                                type="number" 
                                id="globalQuantity" 
                                min="1" 
                                value={globalQuantity}
                                onChange={(e) => setGlobalQuantity(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200"
                            />
                        </div>
                        
                        <hr className="my-6 border-gray-300/50" />

                        {/* Category Checkboxes Container */}
                        <div className="space-y-3" id="category-filters">
                            <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="text-lg">🏷️</span>
                                Filter by Category
                            </p>
                            
                            {/* Select All */}
                            <div className="flex items-center pb-3 border-b border-gray-300/50">
                                <input 
                                    type="checkbox" 
                                    id="selectAll" 
                                    checked={selectedCategories.length === allCategories.length}
                                    onChange={toggleAllCategories}
                                    className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-200" 
                                />
                                <label htmlFor="selectAll" className="ml-3 block text-sm font-bold text-gray-900">
                                    Select All Categories
                                </label>
                            </div>
                            
                            {/* Individual Categories */}
                            <div className="space-y-2.5">
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
                                                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded category-checkbox transition-all duration-200" 
                                            />
                                            <label 
                                                htmlFor={id} 
                                                className={`ml-3 block text-sm transition-all duration-200 cursor-pointer ${isChecked ? 'font-semibold text-purple-600' : 'text-gray-600 group-hover:text-gray-900'}`}
                                            >
                                                {category}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <hr className="my-6 border-gray-300/50" />
                        
                        {/* Persisted Data Mimicry */}
                        <div className="space-y-4">
                            <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="text-lg">💼</span>
                                Project Options
                            </p>
                            <div className="flex items-center group">
                                <input 
                                    type="checkbox" 
                                    id="usePrevData" 
                                    checked={usePrevData}
                                    onChange={(e) => setUsePrevData(e.target.checked)}
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-all duration-200"
                                />
                                <label htmlFor="usePrevData" className="ml-3 block text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                                    Apply Setup Fee 
                                    <span className="ml-1 font-mono text-xs text-purple-600 font-bold">{formatCurrency(previousPageValue)}</span>
                                </label>
                            </div>
                        </div>

                        {/* Summary Metric */}
                        <div className="bg-linear-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-center mt-8 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                            <p className="text-xs font-bold text-white/90 uppercase mb-2 tracking-wider">Total Project Cost</p>
                            <p className="text-5xl font-black text-white" id="totalProjectCostDisplay">
                                {formatCurrency(totalProjectCost)}
                            </p>
                        </div>
                    </div>

                    {/* 2. Results Table Panel */}
                    <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-purple-200/50">
                        <h2 className="text-xl font-bold pb-3 mb-4 text-gray-800 flex items-center gap-2">
                            <span className="text-2xl">📊</span>
                            Cost Estimation Details
                        </h2>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300/50 table-fixed">
                                <thead className="bg-linear-to-r from-purple-50 to-pink-50">
                                    <tr>
                                        <th className="w-[30%] px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Part Name</th>
                                        <th className="w-[15%] px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                                        <th className="w-[13%] px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Base Price</th>
                                        <th className="w-[13%] px-4 py-4 text-right text-xs font-bold text-purple-600 uppercase tracking-wider">Adj. Price</th>
                                        <th className="w-[10%] px-4 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Qty</th>
                                        <th className="w-[19%] px-4 py-4 text-right text-xs font-bold text-purple-600 uppercase tracking-wider">Line Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/50 divide-y divide-gray-200/50" id="resultsTableBody">
                                    {filteredResults.map(item => (
                                        <tr key={item.id} className="hover:bg-purple-50/50 transition-all duration-200">
                                            <td className="px-4 py-4 text-sm font-semibold text-gray-900 truncate">{item.name}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 truncate">{item.category}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 text-right">{formatCurrency(item.basePrice)}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-blue-600 text-right">{formatCurrency(item.adjustedPrice)}</td>
                                            <td className="px-4 py-4 text-sm text-gray-600 text-right">{item.calculatedQuantity.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-sm font-bold text-purple-600 text-right">{formatCurrency(item.lineCost)}</td>
                                        </tr>
                                    ))}
                                    
                                    {/* Setup Fee Row */}
                                    {usePrevData && filteredResults.length > 0 && (
                                        <tr className="bg-linear-to-r from-yellow-100 to-orange-100 border-t-2 border-yellow-300">
                                            <td className="px-4 py-4 text-sm font-bold text-yellow-800" colSpan={5}>
                                                <span className="flex items-center gap-2">
                                                    <span className="text-lg">⚡</span>
                                                    Project Setup Fee
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-sm font-bold text-yellow-800 text-right">
                                                {formatCurrency(previousPageValue)}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* No Results Message */}
                        {showNoResultsMessage && (
                            <div className="mt-6 p-6 text-center bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                                <p className="text-gray-600 font-semibold text-lg">
                                    {getNoResultsText()}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;