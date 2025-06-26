import express from 'express';
import axios from 'axios';
import Log from './loggingMiddleware';
import path from 'path';

const app = express();
app.use(express.json());

// Serve static files
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Root route
app.get('/', (req: any, res: any) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Registration endpoint
app.post('/register', async (req: any, res: any) => {
  try {
    const { email, name, mobileNo, githubUsername, rollNo, accessCode } = req.body;

    // Validate required fields
    if (!email || !name || !mobileNo || !githubUsername || !rollNo || !accessCode) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        status: 'error'
      });
    }

    // Log the registration attempt
    Log('backend', 'info', 'handler', `Registration attempt for ${email}`);

    // Forward the registration request to the test server
    const response = await axios.post('http://20.244.56.144/evaluation-service/register', {
      email,
      name,
      mobileNo,
      githubUsername,
      rollNo,
      accessCode
    });

    // Log successful registration
    Log('backend', 'info', 'handler', `Registration successful for ${email}`);

    // Return the response from test server
    res.json(response.data);
  } catch (error: any) {
    Log('backend', 'error', 'handler', `Registration failed: ${error.message}`);
    
    // Check if error is from axios (network error)
    if (error instanceof Error) {
      if (error.name === 'AxiosError') {
        return res.status((error as any).response?.status || 500).json({
          message: (error as any).response?.data?.message || 'Registration failed',
          status: 'error'
        });
      }
    }

    // Handle other errors
    res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    });
  }
});

// Authentication endpoint
app.post('/auth', async (req: any, res: any) => {
  try {
    const { email, name, rollNo, accessCode, clientID, clientSecret } = req.body;

    // Validate required fields
    if (!email || !name || !rollNo || !accessCode || !clientID || !clientSecret) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        status: 'error'
      });
    }

    // Log the authentication attempt
    Log('backend', 'info', 'auth', `Authentication attempt for ${email}`);

    // Forward the request to the test server
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      email,
      name,
      rollNo,
      accessCode,
      clientID,
      clientSecret
    });

    // Log successful authentication
    Log('backend', 'info', 'auth', `Authentication successful for ${email}`);

    // Return the response from test server
    res.json(response.data);
  } catch (error: any) {
    Log('backend', 'error', 'auth', `Authentication failed: ${error.message}`);
    
    // Check if error is from axios (network error)
    if (error instanceof Error) {
      if (error.name === 'AxiosError') {
        return res.status((error as any).response?.status || 500).json({
          message: (error as any).response?.data?.message || 'Authentication failed',
          status: 'error'
        });
      }
    }

    // Handle other errors
    res.status(500).json({
      message: 'Internal server error',
      status: 'error'
    });
  }
});

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});