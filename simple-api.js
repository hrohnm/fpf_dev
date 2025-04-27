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
      code: '34',
      unitType: 'places',
      parentId: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'Erziehungsbeistand (§ 30 SGB VIII)',
      description: 'Erziehungsbeistand, Betreuungshelfer',
      code: '30',
      unitType: 'hours',
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

// User administration endpoints
app.get('/api/admin/users', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Get query parameters for filtering and pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const role = req.query.role || '';
  const isActive = req.query.isActive !== undefined ?
    req.query.isActive === 'true' : undefined;
  const sortBy = req.query.sortBy || 'createdAt';
  const sortOrder = req.query.sortOrder || 'desc';

  // Filter users
  let filteredUsers = [...db.users];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.email.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower)
    );
  }

  // Apply role filter
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }

  // Apply active status filter
  if (isActive !== undefined) {
    filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
  }

  // Sort users
  filteredUsers.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle dates
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);

  // Get paginated users
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Add carrier information to users
  const usersWithCarriers = paginatedUsers.map(user => {
    const userData = {
      ...user,
      password: undefined // Don't send password hash
    };

    if (user.carrierId) {
      const carrier = db.carriers.find(c => c.id === user.carrierId);
      if (carrier) {
        userData.Carriers = [carrier];
      }
    }

    return userData;
  });

  // Return users with pagination metadata
  res.json({
    data: usersWithCarriers,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  });
});

app.get('/api/admin/users/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Find user by ID
  const user = db.users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post('/api/admin/users', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { email, password, firstName, lastName, role, isActive, carrierId } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Check if email already exists
  if (db.users.some(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Validate carrier if role is carrier
  if (role === 'carrier' && !carrierId) {
    return res.status(400).json({ message: 'Carrier is required for carrier role' });
  }

  // Check if carrier exists
  if (carrierId && !db.carriers.some(c => c.id === carrierId)) {
    return res.status(400).json({ message: 'Carrier not found' });
  }

  // Create new user
  const newUser = {
    id: uuidv4(),
    email,
    password: bcrypt.hashSync(password, 10),
    firstName,
    lastName,
    role,
    isActive: isActive !== undefined ? isActive : true,
    carrierId: role === 'carrier' ? carrierId : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add user to database
  db.users.push(newUser);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;

  // Add carrier information if applicable
  if (userWithoutPassword.carrierId) {
    const carrier = db.carriers.find(c => c.id === userWithoutPassword.carrierId);
    if (carrier) {
      userWithoutPassword.Carriers = [carrier];
    }
  }

  res.status(201).json(userWithoutPassword);
});

app.put('/api/admin/users/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { email, password, firstName, lastName, role, isActive, carrierId } = req.body;

  // Find user by ID
  const userIndex = db.users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check if email already exists (for another user)
  if (email && email !== db.users[userIndex].email &&
      db.users.some(u => u.email === email && u.id !== req.params.id)) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Determine the new role
  const newRole = role || db.users[userIndex].role;

  // Validate carrier if role is carrier
  if (newRole === 'carrier' && !carrierId && !db.users[userIndex].carrierId) {
    return res.status(400).json({ message: 'Carrier is required for carrier role' });
  }

  // Check if carrier exists
  if (carrierId && !db.carriers.some(c => c.id === carrierId)) {
    return res.status(400).json({ message: 'Carrier not found' });
  }

  // Update user
  const updatedUser = {
    ...db.users[userIndex],
    email: email || db.users[userIndex].email,
    firstName: firstName || db.users[userIndex].firstName,
    lastName: lastName || db.users[userIndex].lastName,
    role: newRole,
    isActive: isActive !== undefined ? isActive : db.users[userIndex].isActive,
    carrierId: newRole === 'carrier' ? (carrierId || db.users[userIndex].carrierId) : null,
    updatedAt: new Date()
  };

  // Update password if provided
  if (password) {
    updatedUser.password = bcrypt.hashSync(password, 10);
  }

  // Update user in database
  db.users[userIndex] = updatedUser;

  // Return user without password
  const { password: _, ...userWithoutPassword } = updatedUser;

  // Add carrier information if applicable
  if (userWithoutPassword.carrierId) {
    const carrier = db.carriers.find(c => c.id === userWithoutPassword.carrierId);
    if (carrier) {
      userWithoutPassword.Carriers = [carrier];
    }
  }

  res.json(userWithoutPassword);
});

app.delete('/api/admin/users/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Find user by ID
  const userIndex = db.users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent deleting the last admin user
  if (db.users[userIndex].role === 'admin' &&
      db.users.filter(u => u.role === 'admin').length === 1) {
    return res.status(400).json({ message: 'Cannot delete the last admin user' });
  }

  // Remove user from database
  db.users.splice(userIndex, 1);

  res.status(204).send();
});

// Get all carriers (for dropdowns)
app.get('/api/admin/carriers/all', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Return all active carriers
  const activeCarriers = db.carriers
    .filter(carrier => carrier.isActive)
    .map(carrier => ({
      id: carrier.id,
      name: carrier.name
    }));

  res.json(activeCarriers);
});

// Carrier administration endpoints
app.get('/api/admin/carriers', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Get query parameters for filtering and pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const isActive = req.query.isActive !== undefined ?
    req.query.isActive === 'true' : undefined;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';

  // Filter carriers
  let filteredCarriers = [...db.carriers];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCarriers = filteredCarriers.filter(carrier =>
      carrier.name.toLowerCase().includes(searchLower) ||
      carrier.description.toLowerCase().includes(searchLower) ||
      carrier.contactPerson.toLowerCase().includes(searchLower) ||
      carrier.email.toLowerCase().includes(searchLower)
    );
  }

  // Apply active status filter
  if (isActive !== undefined) {
    filteredCarriers = filteredCarriers.filter(carrier => carrier.isActive === isActive);
  }

  // Sort carriers
  filteredCarriers.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle dates
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = filteredCarriers.length;
  const totalPages = Math.ceil(total / limit);

  // Get paginated carriers
  const paginatedCarriers = filteredCarriers.slice(startIndex, endIndex);

  // Add facilities count to each carrier
  const carriersWithFacilities = paginatedCarriers.map(carrier => {
    const facilities = db.facilities.filter(f => f.carrierId === carrier.id);
    return {
      ...carrier,
      facilities
    };
  });

  // Return carriers with pagination metadata
  res.json({
    data: carriersWithFacilities,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  });
});

app.get('/api/admin/carriers/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Find carrier by ID
  const carrier = db.carriers.find(c => c.id === req.params.id);

  if (!carrier) {
    return res.status(404).json({ message: 'Carrier not found' });
  }

  // Get facilities for this carrier
  const facilities = db.facilities.filter(f => f.carrierId === carrier.id);

  // Return carrier with facilities
  res.json({
    ...carrier,
    facilities
  });
});

app.post('/api/admin/carriers', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { name, description, contactPerson, email, phone, website, address, isActive } = req.body;

  // Validate required fields
  if (!name || !contactPerson || !email || !phone || !address) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Create new carrier
  const newCarrier = {
    id: uuidv4(),
    name,
    description: description || '',
    contactPerson,
    email,
    phone,
    website: website || '',
    address,
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add carrier to database
  db.carriers.push(newCarrier);

  res.status(201).json(newCarrier);
});

app.put('/api/admin/carriers/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { name, description, contactPerson, email, phone, website, address, isActive } = req.body;

  // Find carrier by ID
  const carrierIndex = db.carriers.findIndex(c => c.id === req.params.id);

  if (carrierIndex === -1) {
    return res.status(404).json({ message: 'Carrier not found' });
  }

  // Update carrier
  const updatedCarrier = {
    ...db.carriers[carrierIndex],
    name: name || db.carriers[carrierIndex].name,
    description: description !== undefined ? description : db.carriers[carrierIndex].description,
    contactPerson: contactPerson || db.carriers[carrierIndex].contactPerson,
    email: email || db.carriers[carrierIndex].email,
    phone: phone || db.carriers[carrierIndex].phone,
    website: website !== undefined ? website : db.carriers[carrierIndex].website,
    address: address || db.carriers[carrierIndex].address,
    isActive: isActive !== undefined ? isActive : db.carriers[carrierIndex].isActive,
    updatedAt: new Date()
  };

  // Update carrier in database
  db.carriers[carrierIndex] = updatedCarrier;

  res.json(updatedCarrier);
});

app.delete('/api/admin/carriers/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Find carrier by ID
  const carrierIndex = db.carriers.findIndex(c => c.id === req.params.id);

  if (carrierIndex === -1) {
    return res.status(404).json({ message: 'Carrier not found' });
  }

  // Check if carrier has facilities
  const hasFacilities = db.facilities.some(f => f.carrierId === req.params.id);

  if (hasFacilities) {
    return res.status(400).json({ message: 'Cannot delete carrier with facilities' });
  }

  // Remove carrier from database
  db.carriers.splice(carrierIndex, 1);

  res.status(204).send();
});

// Category administration endpoints
app.get('/api/admin/categories/all', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Return all categories (for dropdowns)
  res.json(db.categories);
});

app.get('/api/admin/categories', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Get query parameters for filtering and pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';
  const isActive = req.query.isActive !== undefined ?
    req.query.isActive === 'true' : undefined;
  const unitType = req.query.unitType || '';
  const parentId = req.query.parentId !== undefined ?
    req.query.parentId === 'null' ? null : req.query.parentId : undefined;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';

  // Filter categories
  let filteredCategories = [...db.categories];

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCategories = filteredCategories.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower) ||
      category.code.toLowerCase().includes(searchLower)
    );
  }

  // Apply active status filter
  if (isActive !== undefined) {
    filteredCategories = filteredCategories.filter(category => category.isActive === isActive);
  }

  // Apply unit type filter
  if (unitType) {
    filteredCategories = filteredCategories.filter(category => category.unitType === unitType);
  }

  // Apply parent ID filter
  if (parentId !== undefined) {
    filteredCategories = filteredCategories.filter(category => category.parentId === parentId);
  }

  // Sort categories
  filteredCategories.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle dates
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle strings
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = filteredCategories.length;
  const totalPages = Math.ceil(total / limit);

  // Get paginated categories
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  // Return categories with pagination metadata
  res.json({
    data: paginatedCategories,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  });
});

app.get('/api/admin/categories/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Find category by ID
  const category = db.categories.find(c => c.id === req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  // Return category
  res.json(category);
});

app.post('/api/admin/categories', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { name, description, code, unitType, parentId, isActive } = req.body;

  // Validate required fields
  if (!name || !code || !unitType) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Validate unit type
  if (unitType !== 'places' && unitType !== 'hours') {
    return res.status(400).json({ message: 'Invalid unit type' });
  }

  // Check if parent category exists
  if (parentId && !db.categories.some(c => c.id === parentId)) {
    return res.status(400).json({ message: 'Parent category not found' });
  }

  // Create new category
  const newCategory = {
    id: uuidv4(),
    name,
    description: description || '',
    code,
    unitType,
    parentId: parentId || null,
    isActive: isActive !== undefined ? isActive : true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Add category to database
  db.categories.push(newCategory);

  res.status(201).json(newCategory);
});

app.put('/api/admin/categories/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { name, description, code, unitType, parentId, isActive } = req.body;

  // Find category by ID
  const categoryIndex = db.categories.findIndex(c => c.id === req.params.id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }

  // Validate unit type
  if (unitType && unitType !== 'places' && unitType !== 'hours') {
    return res.status(400).json({ message: 'Invalid unit type' });
  }

  // Check if parent category exists
  if (parentId && !db.categories.some(c => c.id === parentId)) {
    return res.status(400).json({ message: 'Parent category not found' });
  }

  // Prevent circular references
  if (parentId === req.params.id) {
    return res.status(400).json({ message: 'Category cannot be its own parent' });
  }

  // Update category
  const updatedCategory = {
    ...db.categories[categoryIndex],
    name: name || db.categories[categoryIndex].name,
    description: description !== undefined ? description : db.categories[categoryIndex].description,
    code: code || db.categories[categoryIndex].code,
    unitType: unitType || db.categories[categoryIndex].unitType,
    parentId: parentId !== undefined ? parentId : db.categories[categoryIndex].parentId,
    isActive: isActive !== undefined ? isActive : db.categories[categoryIndex].isActive,
    updatedAt: new Date()
  };

  // Update category in database
  db.categories[categoryIndex] = updatedCategory;

  res.json(updatedCategory);
});

app.delete('/api/admin/categories/:id', authenticateToken, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Find category by ID
  const categoryIndex = db.categories.findIndex(c => c.id === req.params.id);

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }

  // Check if category has children
  const hasChildren = db.categories.some(c => c.parentId === req.params.id);

  if (hasChildren) {
    return res.status(400).json({ message: 'Cannot delete category with children' });
  }

  // Check if category is used in availabilities
  const isUsedInAvailabilities = db.availabilities.some(a => a.categoryId === req.params.id);

  if (isUsedInAvailabilities) {
    return res.status(400).json({ message: 'Cannot delete category used in availabilities' });
  }

  // Remove category from database
  db.categories.splice(categoryIndex, 1);

  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
