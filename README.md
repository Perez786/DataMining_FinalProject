# Miami-Dade Purchase Orders Analysis Dashboard 📊

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://miami-dade-po-viewer.windsurf.build)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/MUI-5.15.10-purple.svg)](https://mui.com/)

## 🎯 Overview

An interactive web application for analyzing Miami-Dade County's purchase orders using RFM (Recency, Frequency, Monetary) analysis. This tool helps in understanding supplier relationships and spending patterns through data visualization and analysis.

![Dashboard Preview](https://raw.githubusercontent.com/Perez786/DataMining_FinalProject/main/dashboard-preview.png)

## ✨ Features

- **RFM Analysis**: Analyze suppliers based on:
  - **Recency**: Days since last purchase order
  - **Frequency**: Average orders per month
  - **Monetary**: Total and average order values

- **Interactive Data Grid**: Browse and filter purchase orders with:
  - Supplier filtering
  - Sortable columns
  - Pagination

- **Real-time Calculations**: Instant metrics updates when selecting different suppliers

## 🚀 Live Demo

Explore the live application at: [https://miami-dade-po-viewer.windsurf.build](https://miami-dade-po-viewer.windsurf.build)

## 🛠️ Technology Stack

- **Frontend**: React.js with Material-UI
- **Data Processing**: PapaParse for CSV handling
- **Data Display**: MUI X-Data-Grid
- **Deployment**: Netlify

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/Perez786/DataMining_FinalProject.git
   cd miami-dade-po-viewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open the application**
   Visit https://miami-dade-po-viewer.windsurf.build/ or [http://localhost:3000](http://localhost:3000) in your browser

## 📈 Data Analysis

The application performs RFM analysis on Miami-Dade County's purchase orders:

- **Recency**: Measures how recently a supplier received a purchase order
- **Frequency**: Calculates the average number of orders per month
- **Monetary**: Analyzes total spending and average order value

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Perez786](https://github.com/Perez786)

## 🙏 Acknowledgments

- Miami-Dade County for providing the purchase order data
- All contributors and maintainers
