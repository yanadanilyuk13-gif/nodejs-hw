import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';

const app = express();

const PORT = Number(process.env.PORT ?? 3000);

// Middleware
app.use(express.json());
app.use(cors());

app.use(
    pino({
        level: 'info',
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
                messageFormat:
                    '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
                hideObject: true,
            },
        },
    }));

//GET /notes
app.get('/notes', (req, res) => {
    res.status(200).json({ message: 'Retrieved all notes' });
});

//GET /notes/:noteId
app.get('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;

    res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

//GET /test-error
app.get('/test-error', () => {
    throw new Error('Simulated server error');
});

// 404 - Route not found
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// 500 - Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: err.message,
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});