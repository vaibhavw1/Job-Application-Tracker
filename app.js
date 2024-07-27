const dotEnv = require('dotenv').config({ path: './.env' });
const Express = require('express');
const path = require('path');
const cors = require('cors');
const upload = require('./middleware/multer'); 

const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const applicationRoutes = require('./routes/application');
const reminderRoutes = require('./routes/reminder');
const companyRoutes = require('./routes/company');

const database = require('./util/database');
const bodyParser = require('body-parser');
const User = require('./models/user');
const Profile = require('./models/profile');
const Application = require('./models/application');
const Reminder = require('./models/reminder');
const Company = require('./models/company');
const CompanyProfiles = require('./models/companyProfile');

const app = Express();

app.use(bodyParser.json());
app.use(cors());

// Route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ filePath: `/upload/${req.file.filename}` });
});

// Serve static files from the 'public/upload' directory
app.use('/upload', Express.static(path.join(__dirname, 'public', 'upload')));

// Routes
app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
app.use('/application', applicationRoutes);
app.use('/reminder', reminderRoutes);
app.use('/company', companyRoutes);

// Serve other static files
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`));
});

// Model associations
User.hasMany(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });

Application.belongsTo(Profile);
Profile.hasMany(Application);

Application.hasMany(Reminder);
Reminder.belongsTo(Application);

Company.hasMany(Application);
Application.belongsTo(Company);

Company.belongsToMany(Profile, { through: CompanyProfiles });
Profile.belongsToMany(Company, { through: CompanyProfiles });

database.sync({ force: true })
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.error('Database sync error:', err);
    });
