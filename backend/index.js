const Env = process.env.Node_ENV || 'production';
require('dotenv').config({ path: `./.env.${Env}` });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const exchangeRouter = require('./routers/exchangeRouter');
const errorController = require('./controllers/errorController');
const exchangeRateService = require('./services/exchangeRateService');

//app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000/api/exchange/convert', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

async function initializeApp() {
    try {
        await exchangeRateService.initializeRates();

        app.use('/api/exchange', exchangeRouter);
        app.use(errorController.get404);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running at: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1);
    }
}

initializeApp();