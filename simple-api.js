const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 4000;
const JWT_SECRET = 'your-secret-key';

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// In-memory database
const db = {
  users: [
    {
      id: uuidv4(),
      email: 'admin@example.com',
      password: bcrypt.hashSync('password', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      email: 'carrier@example.com',
      password: bcrypt.hashSync('password', 10),
      firstName: 'Carrier',
      lastName: 'User',
      role: 'carrier',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      email: 'manager@example.com',
      password: bcrypt.hashSync('password', 10),
      firstName: 'Manager',
      lastName: 'User',
      role: 'manager',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      email: 'leadership@example.com',
      password: bcrypt.hashSync('password', 10),
      firstName: 'Leadership',
      lastName: 'User',
      role: 'leadership',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  carriers: [
    {
      id: uuidv4(),
      name: 'Beispielträger 1',
      description: 'Ein Beispielträger für Jugendhilfeeinrichtungen',
      contactPerson: 'Max Mustermann',
      email: 'kontakt@beispieltraeger1.de',
      phone: '030 12345678',
      website: 'https://beispieltraeger1.de',
      address: 'Musterstraße 1, 10115 Berlin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Beispielträger 2',
      description: 'Ein weiterer Beispielträger für Jugendhilfeeinrichtungen',
      contactPerson: 'Erika Musterfrau',
      email: 'kontakt@beispieltraeger2.de',
      phone: '030 87654321',
      website: 'https://beispieltraeger2.de',
      address: 'Beispielweg 2, 10117 Berlin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  facilities: [
    {
      id: uuidv4(),
      carrierId: null, // Will be set after carriers are created
      name: 'Beispieleinrichtung 1',
      description: 'Eine Beispieleinrichtung für Jugendhilfe',
      address: 'Musterstraße 1, 10115 Berlin',
      contactPerson: 'Max Mustermann',
      email: 'kontakt@beispieleinrichtung1.de',
      phone: '030 12345678',
      website: 'https://beispieleinrichtung1.de',
      latitude: 52.52,
      longitude: 13.405,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      carrierId: null, // Will be set after carriers are created
      name: 'Beispieleinrichtung 2',
      description: 'Eine weitere Beispieleinrichtung für Jugendhilfe',
      address: 'Beispielweg 2, 10117 Berlin',
      contactPerson: 'Erika Musterfrau',
      email: 'kontakt@beispieleinrichtung2.de',
      phone: '030 87654321',
      website: 'https://beispieleinrichtung2.de',
      latitude: 52.51,
      longitude: 13.41,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  categories: [
    {
      id: uuidv4(),
      name: 'Heimerziehung (§ 34 SGB VIII)',
      description: 'Heimerziehung, sonstige betreute Wohnform',
      parentId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Erziehungsbeistand (§ 30 SGB VIII)',
      description: 'Erziehungsbeistand, Betreuungshelfer',
      parentId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  availabilities: [],
  favorites: []
};

// Link facilities to carriers
db.facilities[0].carrierId = db.carriers[0].id;
db.facilities[1].carrierId = db.carriers[1].id;

// Create availabilities
for (const facility of db.facilities) {
  for (const category of db.categories) {
    db.availabilities.push({
      id: uuidv4(),
      facilityId: facility.id,
      categoryId: category.id,
      availablePlaces: Math.floor(Math.random() * 5) + 1, // 1-5 places
      totalPlaces: Math.floor(Math.random() * 10) + 5, // 5-14 places
      genderSuitability: ['male', 'female', 'all'][Math.floor(Math.random() * 3)],
      minAge: 6,
      maxAge: 18,
      notes: 'Freie Plätze verfügbar',
      lastUpdated: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    req.user = user;
    next();
  });
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = db.users.find(u => u.email === email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Create JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  // Create refresh token
  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Return user data and tokens
  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    token,
    refreshToken
  });
});

app.post('/api/auth/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    // Find user by ID
    const user = db.users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Create new JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Create new refresh token
    const newRefreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  // Calculate total available places
  const totalAvailablePlaces = db.availabilities.reduce((sum, a) => sum + a.availablePlaces, 0);
  
  // Calculate total capacity
  const totalCapacity = db.availabilities.reduce((sum, a) => sum + a.totalPlaces, 0);
  
  // Calculate occupancy rate
  const occupancyRate = totalCapacity ? 
    parseFloat((100 - (totalAvailablePlaces / totalCapacity * 100)).toFixed(1)) : 
    0;
  
  // Get recent updates
  const recentUpdates = db.availabilities
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map(update => {
      const facility = db.facilities.find(f => f.id === update.facilityId);
      const category = db.categories.find(c => c.id === update.categoryId);
      
      return {
        facilityId: facility.id,
        facilityName: facility.name,
        categoryId: category.id,
        categoryName: category.name,
        availablePlaces: update.availablePlaces,
        lastUpdated: update.updatedAt
      };
    });
  
  res.json({
    totalFacilities: db.facilities.length,
    totalCarriers: db.carriers.length,
    totalAvailablePlaces,
    occupancyRate,
    recentUpdates
  });
});

// Carrier dashboard endpoint
app.get('/api/carrier/dashboard', authenticateToken, (req, res) => {
  // Check if user is carrier
  if (req.user.role !== 'carrier') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  // Get facilities for this carrier (in a real app, this would be based on the user's carrier association)
  const facilities = db.facilities;
  
  // Get availabilities for these facilities
  const availabilities = db.availabilities.filter(a => 
    facilities.some(f => f.id === a.facilityId)
  );
  
  // Calculate total available places
  const totalAvailablePlaces = availabilities.reduce((sum, a) => sum + a.availablePlaces, 0);
  
  // Calculate total capacity
  const totalCapacity = availabilities.reduce((sum, a) => sum + a.totalPlaces, 0);
  
  // Calculate occupancy rate
  const occupancyRate = totalCapacity ? 
    parseFloat((100 - (totalAvailablePlaces / totalCapacity * 100)).toFixed(1)) : 
    0;
  
  // Get recent updates
  const recentUpdates = availabilities
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map(update => {
      const facility = db.facilities.find(f => f.id === update.facilityId);
      const category = db.categories.find(c => c.id === update.categoryId);
      
      return {
        facilityId: facility.id,
        facilityName: facility.name,
        categoryId: category.id,
        categoryName: category.name,
        availablePlaces: update.availablePlaces,
        lastUpdated: update.updatedAt
      };
    });
  
  res.json({
    totalFacilities: facilities.length,
    totalAvailablePlaces,
    occupancyRate,
    recentUpdates
  });
});

// Manager dashboard endpoint
app.get('/api/manager/dashboard', authenticateToken, (req, res) => {
  // Check if user is manager
  if (req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  // Calculate total available places
  const totalAvailablePlaces = db.availabilities.reduce((sum, a) => sum + a.availablePlaces, 0);
  
  // Get favorites (in a real app, this would be based on the user's favorites)
  const favorites = db.facilities.slice(0, 2).map(facility => {
    const carrier = db.carriers.find(c => c.id === facility.carrierId);
    
    return {
      facilityId: facility.id,
      facilityName: facility.name,
      carrierId: carrier.id,
      carrierName: carrier.name
    };
  });
  
  // Get recent updates
  const recentUpdates = db.availabilities
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map(update => {
      const facility = db.facilities.find(f => f.id === update.facilityId);
      const category = db.categories.find(c => c.id === update.categoryId);
      
      return {
        facilityId: facility.id,
        facilityName: facility.name,
        categoryId: category.id,
        categoryName: category.name,
        availablePlaces: update.availablePlaces,
        lastUpdated: update.updatedAt
      };
    });
  
  res.json({
    totalFacilities: db.facilities.length,
    totalCarriers: db.carriers.length,
    totalAvailablePlaces,
    favorites,
    recentUpdates
  });
});

// Leadership dashboard endpoint
app.get('/api/leadership/dashboard', authenticateToken, (req, res) => {
  // Check if user is leadership
  if (req.user.role !== 'leadership') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  // Calculate total available places
  const totalAvailablePlaces = db.availabilities.reduce((sum, a) => sum + a.availablePlaces, 0);
  
  // Calculate total capacity
  const totalCapacity = db.availabilities.reduce((sum, a) => sum + a.totalPlaces, 0);
  
  // Calculate occupancy rate
  const occupancyRate = totalCapacity ? 
    parseFloat((100 - (totalAvailablePlaces / totalCapacity * 100)).toFixed(1)) : 
    0;
  
  // Get users by role
  const usersByRole = [
    { role: 'admin', count: db.users.filter(u => u.role === 'admin').length },
    { role: 'carrier', count: db.users.filter(u => u.role === 'carrier').length },
    { role: 'manager', count: db.users.filter(u => u.role === 'manager').length },
    { role: 'leadership', count: db.users.filter(u => u.role === 'leadership').length }
  ];
  
  // Get category distribution
  const categoryDistribution = db.categories.map(category => {
    const categoryAvailabilities = db.availabilities.filter(a => a.categoryId === category.id);
    const availablePlaces = categoryAvailabilities.reduce((sum, a) => sum + a.availablePlaces, 0);
    const totalPlaces = categoryAvailabilities.reduce((sum, a) => sum + a.totalPlaces, 0);
    const categoryOccupancyRate = totalPlaces ? 
      parseFloat((100 - (availablePlaces / totalPlaces * 100)).toFixed(1)) : 
      0;
    
    return {
      categoryId: category.id,
      categoryName: category.name,
      availablePlaces,
      totalPlaces,
      occupancyRate: categoryOccupancyRate
    };
  });
  
  // Get recent updates
  const recentUpdates = db.availabilities
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
    .map(update => {
      const facility = db.facilities.find(f => f.id === update.facilityId);
      const category = db.categories.find(c => c.id === update.categoryId);
      
      return {
        facilityId: facility.id,
        facilityName: facility.name,
        categoryId: category.id,
        categoryName: category.name,
        availablePlaces: update.availablePlaces,
        lastUpdated: update.updatedAt
      };
    });
  
  res.json({
    totalFacilities: db.facilities.length,
    totalCarriers: db.carriers.length,
    totalAvailablePlaces,
    occupancyRate,
    usersByRole,
    categoryDistribution,
    recentUpdates
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
