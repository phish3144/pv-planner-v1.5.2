const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data directory
const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'database.json');

// Ensure data directory exists
fs.ensureDirSync(dataDir);

// Initialize database if it doesn't exist
if (!fs.existsSync(dbFile)) {
    const initialData = {
        appointments: [],
        staff: [
            { id: '1', name: 'Max Mustermann', position: 'Monteur', email: 'max@example.com', phone: '0123456789', color: '#4285F4', team_ids: [] },
            { id: '2', name: 'Anna Schmidt', position: 'Monteur', email: 'anna@example.com', phone: '0123456788', color: '#EA4335', team_ids: [] },
            { id: '3', name: 'Thomas Weber', position: 'Monteur', email: 'thomas@example.com', phone: '0123456787', color: '#FBBC05', team_ids: [] }
        ],
        teams: [
            { id: '1', name: 'Team Nord', color: '#34A853', member_ids: ['1', '2'] },
            { id: '2', name: 'Team Süd', color: '#9C27B0', member_ids: ['3'] }
        ]
    };
    
    // Update staff with team assignments
    initialData.staff[0].team_ids = ['1'];
    initialData.staff[1].team_ids = ['1'];
    initialData.staff[2].team_ids = ['2'];
    
    // Add sample appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    initialData.appointments = [
        {
            id: '1',
            title: 'PV-Anlage Installation',
            location: 'Musterstraße 1, 12345 Musterstadt',
            description: 'Installation einer 10kW Anlage',
            start: new Date(today.setHours(8, 0, 0, 0)).toISOString(),
            end: new Date(today.setHours(16, 0, 0, 0)).toISOString(),
            staff_ids: ['1', '2'],
            team_ids: ['1'],
            status: 'geplant'
        },
        {
            id: '2',
            title: 'Wartung',
            location: 'Beispielweg 42, 54321 Beispielstadt',
            description: 'Jährliche Wartung der PV-Anlage',
            start: new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString(),
            end: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString(),
            staff_ids: ['3'],
            team_ids: ['2'],
            status: 'geplant'
        }
    ];
    
    fs.writeJsonSync(dbFile, initialData);
}

// API Routes
// Get all data
app.get('/api/data', (req, res) => {
    try {
        const data = fs.readJsonSync(dbFile);
        res.json(data);
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Update data
app.post('/api/data', (req, res) => {
    try {
        fs.writeJsonSync(dbFile, req.body);
        res.json({ success: true });
    } catch (error) {
        console.error('Error writing data:', error);
        res.status(500).json({ error: 'Failed to write data' });
    }
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`PV-Planer läuft auf Port ${PORT}`);
    console.log(`Öffnen Sie http://localhost:${PORT} in Ihrem Browser`);
});