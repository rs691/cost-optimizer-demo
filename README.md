# 🚀 Cost Optimization Dashboard

> A modern, real-time cost estimation platform built with React and TypeScript

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Overview

This tool is designed to streamline project cost estimation by leveraging pricing catalogs and vendor APIs.

Built using a traditional PHP, JavaScript, and MySQL tech stack, it provides departments like Procurement and Installations with crucial real-time data. This includes part pricing, available quantities, and order fulfillment dates, which assists them in creating comprehensive cost breakdowns and accurately predicting project completion dates.



### 🎯 Key Features

- **Real-Time Search** - Instant filtering across part names, IDs, and categories
- **Dynamic Pricing** - Automatic price adjustments based on regional multipliers
- **Interactive Filters** - Multi-select category filtering with visual feedback
- **Live Calculations** - Immediate cost updates as you modify inputs
- **Glassmorphic UI** - Modern, accessible design with smooth animations
- **Responsive Layout** - Optimized for desktop and mobile devices

---

## 🏗️ Architecture

### Technology Stack

```
Frontend Framework:  React 18+
Language:            TypeScript
Styling:             Tailwind CSS
State Management:    React Hooks (useState, useMemo)
Build Tool:          Modern bundler (Vite/Webpack)
```

### Component Structure

```
App (Main Component)
├── Header Section
├── Filtering Panel
│   ├── Search Input
│   ├── Quantity Input
│   ├── Category Filters
│   ├── Project Options
│   └── Total Cost Display
└── Results Table
    ├── Parts Data Rows
    └── Setup Fee Row (conditional)
```

---

## 🔄 Workflow

### 1. **Data Initialization**

The application starts with pre-loaded catalogs:

- **Parts Catalog** - Hardware components with base prices
- **Pricing Rules** - Regional multipliers per category
- **Setup Fee** - Optional project overhead cost

### 2. **User Input Phase**

Users configure their estimation parameters:

```typescript
Global Quantity → Applied to all parts
Search Term    → Filters visible parts
Categories     → Multi-select filtering
Setup Fee      → Toggle inclusion in total
```

### 3. **Real-Time Processing**

The app uses React's `useMemo` for efficient computation:

**Step A: Filtering**
```
Raw Parts Catalog
    ↓
Category Filter (selected categories)
    ↓
Search Filter (name/ID/category match)
    ↓
Filtered Results
```

**Step B: Cost Calculation**
```
For each filtered part:
    Base Price × Regional Multiplier = Adjusted Price
    Adjusted Price × Global Quantity = Line Cost
```

**Step C: Total Aggregation**
```
Sum of All Line Costs
    +
Setup Fee (if enabled)
    =
Total Project Cost
```

### 4. **Dynamic Display**

Results update instantly when any input changes:

- **Table View** - Detailed breakdown per component
- **Cost Summary** - Prominent total display with gradient styling
- **Empty States** - Helpful messages when no results match

---

## 🎨 Design Philosophy

### Modern Visual Elements

**Glassmorphism**
- Semi-transparent backgrounds with backdrop blur
- Layered depth through shadow and border effects

**Gradient Accents**
- Purple-to-pink gradients for primary actions
- Soft pastel gradients for background ambiance

**Micro-Interactions**
- Smooth hover transitions (200-300ms)
- Scale transforms on the total cost card
- Color shifts on interactive elements

### Accessibility Considerations

- Semantic HTML structure
- High contrast text ratios
- Focus states on all inputs
- Screen reader-friendly labels

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                   USER INPUTS                       │
│  • Search Term  • Quantity  • Categories  • Setup   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              FILTERING LOGIC                        │
│  Step 1: Filter by selected categories             │
│  Step 2: Apply search term matching                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│           COST CALCULATION ENGINE                   │
│  • Lookup regional pricing multiplier              │
│  • Calculate adjusted unit price                   │
│  • Multiply by global quantity                     │
│  • Sum all line costs + setup fee                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│              UI RENDERING                           │
│  • Update table rows                                │
│  • Refresh total cost display                      │
│  • Show/hide empty states                          │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 16.x
npm >= 8.x or yarn >= 1.22
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cost-dashboard.git

# Navigate to project directory
cd cost-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Usage Examples

### Basic Cost Estimation

1. Enter desired **Global Quantity** (e.g., 50 units)
2. View automatically calculated costs in the table
3. Check the **Total Project Cost** in the purple gradient card

### Filtering Components

1. Use the **Search** field to find specific parts
2. Uncheck categories to narrow results
3. Toggle **Setup Fee** to see cost with/without overhead

### Comparing Scenarios

1. Adjust quantity and note the instant cost changes
2. Enable/disable categories to see category-specific totals
3. Use search to isolate specific components

---

## 🧮 Calculation Examples

### Example 1: Single Component

```
Component:      High-Performance Processor (i9)
Base Price:     $450.00
Region:         US-West
Multiplier:     1.05
Global Qty:     50

Calculation:
  $450.00 × 1.05 = $472.50 (Adjusted Price)
  $472.50 × 50   = $23,625.00 (Line Cost)
```

### Example 2: Full Project

```
Filtered Parts: 8 components
Line Costs Sum: $87,350.00
Setup Fee:      $500.00
───────────────────────────
Total Cost:     $87,850.00
```

---

## 🛠️ Customization

### Adding New Parts

Edit the `partsCatalog` array:

```typescript
{
  id: 'YOUR-ID',
  name: 'Component Name',
  category: 'Category',
  basePrice: 99.99
}
```

### Modifying Pricing Rules

Update the `pricingCatalog` object:

```typescript
'YourCategory': {
  region: 'Region-Name',
  multiplier: 1.15  // 15% markup
}
```

### Adjusting Setup Fee

Change the `previousPageValue` constant:

```typescript
const previousPageValue: number = 750.00;
```

---

## 📈 Performance Optimizations

- **useMemo Hooks** - Prevents unnecessary recalculations
- **Efficient Filtering** - Single-pass filter and map operations
- **Debounced Search** - Could be added for very large datasets
- **Virtual Scrolling** - Recommended for 1000+ parts

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration from modern SaaS dashboards
- Tailwind CSS for rapid styling
- React team for excellent documentation
- TypeScript for type safety and developer experience

---

## 📧 Contact

**Project Maintainer:** Your Name

- Email: your.email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

<div align="center">

**Built with ❤️ using React + TypeScript**

[⬆ Back to Top](#-cost-optimization-dashboard)

</div>