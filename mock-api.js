const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mock auth endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Determine user role based on email
  let role = 'manager';
  if (email.includes('admin')) {
    role = 'admin';
  } else if (email.includes('carrier')) {
    role = 'carrier';
  } else if (email.includes('leadership')) {
    role = 'leadership';
  }
  
  // Return mock user data
  res.json({
    user: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email,
      firstName: 'Test',
      lastName: 'User',
      role,
      isActive: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: 'mock-jwt-token',
    refreshToken: 'mock-refresh-token',
  });
});

// Mock refresh token endpoint
app.post('/api/auth/refresh-token', (req, res) => {
  res.json({
    token: 'new-mock-jwt-token',
    refreshToken: 'new-mock-refresh-token',
  });
});

// Mock dashboard data endpoint for admin
app.get('/api/admin/dashboard', (req, res) => {
  res.status(200).json({
    totalFacilities: 25,
    totalCarriers: 8,
    totalAvailablePlaces: 47,
    occupancyRate: 78.5,
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// Mock dashboard data endpoint for carrier
app.get('/api/carrier/dashboard', (req, res) => {
  res.status(200).json({
    totalFacilities: 5,
    totalAvailablePlaces: 12,
    occupancyRate: 65.7,
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// Mock dashboard data endpoint for manager
app.get('/api/manager/dashboard', (req, res) => {
  res.status(200).json({
    totalFacilities: 25,
    totalCarriers: 8,
    totalAvailablePlaces: 47,
    favorites: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        carrierId: '123e4567-e89b-12d3-a456-426614174010',
        carrierName: 'Beispielträger'
      }
    ],
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// Mock dashboard data endpoint for leadership
app.get('/api/leadership/dashboard', (req, res) => {
  res.status(200).json({
    totalFacilities: 25,
    totalCarriers: 8,
    totalAvailablePlaces: 47,
    occupancyRate: 78.5,
    usersByRole: [
      { role: 'admin', count: 2 },
      { role: 'carrier', count: 15 },
      { role: 'manager', count: 30 },
      { role: 'leadership', count: 5 }
    ],
    categoryDistribution: [
      {
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 20,
        totalPlaces: 100,
        occupancyRate: 80.0
      },
      {
        categoryId: '123e4567-e89b-12d3-a456-426614174051',
        categoryName: 'Erziehungsbeistand (§ 30 SGB VIII)',
        availablePlaces: 15,
        totalPlaces: 50,
        occupancyRate: 70.0
      }
    ],
    recentUpdates: [
      {
        facilityId: '123e4567-e89b-12d3-a456-426614174020',
        facilityName: 'Beispieleinrichtung',
        categoryId: '123e4567-e89b-12d3-a456-426614174050',
        categoryName: 'Heimerziehung (§ 34 SGB VIII)',
        availablePlaces: 3,
        lastUpdated: new Date().toISOString()
      }
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
