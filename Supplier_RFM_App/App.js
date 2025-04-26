import { useState, useEffect, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Container, Typography, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Grid } from '@mui/material';
import Papa from 'papaparse';

const RFMCard = ({ title, value, description }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color="primary">
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [rfmAnalysis, setRfmAnalysis] = useState(null);

  // Define columns for the data grid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'SUPPLIER_NAME', headerName: 'Supplier Name', width: 300 },
    { field: 'PO_DATE', headerName: 'PO Date', width: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'PO_NUMBER', headerName: 'PO Number', width: 130 },
    { field: 'PO_AMOUNT', headerName: 'PO Amount', width: 130,
      valueFormatter: (params) => `$${parseFloat(params.value).toLocaleString()}` },
    { field: 'ITEM_DESCRIPTION', headerName: 'Item Description', width: 400 }
  ];

  // Get unique suppliers from data
  const suppliers = useMemo(() => {
    console.log('Computing suppliers from data:', data.length, 'records');
    const uniqueSuppliers = [...new Set(data.map(item => item.SUPPLIER_NAME))];
    console.log('Found unique suppliers:', uniqueSuppliers.length);
    const result = ['all', ...uniqueSuppliers.sort()];
    console.log('Final supplier list:', result);
    return result;
  }, [data]);

  // Effect to fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting data fetch...');
        Papa.parse('https://raw.githubusercontent.com/Perez786/DataMining_FinalProject/main/MiamiDade_PurchaseOrders_2024.csv', {
          download: true,
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            console.log('Raw data rows:', results.data.length);
            const validRows = results.data.filter(row => {
              if (!row || !row.PO_DATE || !row.PO_AMOUNT || !row.SUPPLIER_NAME) {
                console.log('Skipping row with missing data');
                return false;
              }
              
              const date = new Date(row.PO_DATE);
              if (isNaN(date.getTime())) {
                console.log('Skipping row with invalid date:', row.PO_DATE);
                return false;
              }
              
              const amount = parseFloat(row.PO_AMOUNT);
              if (isNaN(amount)) {
                console.log('Skipping row with invalid amount:', row.PO_AMOUNT);
                return false;
              }
              
              return true;
            });
            
            console.log('Valid rows:', validRows.length);
            setData(validRows);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect for RFM analysis
  useEffect(() => {
    const calculateRFM = () => {
      try {
        if (!selectedSupplier || selectedSupplier === 'all' || !data.length) {
          setRfmAnalysis(null);
          return;
        }

        const orders = data.filter(item => item.SUPPLIER_NAME === selectedSupplier);
        if (!orders.length) {
          setRfmAnalysis(null);
          return;
        }

        const orderDates = orders.map(order => new Date(order.PO_DATE));
        const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.PO_AMOUNT), 0);
        const lastOrderDate = new Date(Math.max(...orderDates));
        const firstOrderDate = new Date(Math.min(...orderDates));
        const daysSinceLastOrder = Math.round((new Date() - lastOrderDate) / (1000 * 60 * 60 * 24));
        const monthsBetweenOrders = (lastOrderDate - firstOrderDate) / (1000 * 60 * 60 * 24 * 30.44);
        const ordersPerMonth = orders.length / (monthsBetweenOrders || 1);

        setRfmAnalysis({
          recency: daysSinceLastOrder,
          frequency: ordersPerMonth.toFixed(2),
          monetary: {
            total: `$${totalAmount.toLocaleString()}`,
            average: `$${(totalAmount / orders.length).toLocaleString()}`
          },
          orderCount: orders.length,
          firstOrder: firstOrderDate.toLocaleDateString(),
          lastOrder: lastOrderDate.toLocaleDateString()
        });
      } catch (error) {
        console.error('Error calculating RFM metrics:', error);
        setRfmAnalysis(null);
      }
    };

    calculateRFM();
  }, [data, selectedSupplier]);

  return (
    <Container maxWidth="xl">
      <Box sx={{ height: '100vh', width: '100%', pt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Miami-Dade Purchase Orders 2024
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel id="supplier-select-label">Filter by Supplier</InputLabel>
                <Select
                  labelId="supplier-select-label"
                  value={selectedSupplier}
                  label="Filter by Supplier"
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  {suppliers.map((supplier) => (
                    <MenuItem key={supplier} value={supplier}>
                      {supplier === 'all' ? 'All Suppliers' : supplier}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {selectedSupplier !== 'all' && rfmAnalysis && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  RFM Analysis for {selectedSupplier}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <RFMCard
                      title="Recency"
                      value={`${rfmAnalysis.recency} days`}
                      description="Days since last purchase order"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RFMCard
                      title="Frequency"
                      value={`${rfmAnalysis.frequency} orders`}
                      description="Average orders per month"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <RFMCard
                      title="Monetary"
                      value={rfmAnalysis.monetary.total}
                      description={`Average order value: ${rfmAnalysis.monetary.average}`}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Order History:
                    <br />
                    First Order: {rfmAnalysis.firstOrder}
                    <br />
                    Last Order: {rfmAnalysis.lastOrder}
                    <br />
                    Total Orders: {rfmAnalysis.orderCount}
                  </Typography>
                </Box>
              </Box>
            )}
            <Box sx={{ height: 600, width: '100%' }}>
              <DataGrid
                rows={data.map((row, index) => ({ ...row, id: index }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
              />
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
