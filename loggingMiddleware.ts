interface LogData {
  stack: string;
  level: string;
  package: string;
  message: string;
}

const LOG_SERVER_URL = 'http://20.244.56.144/evaluation-service/logs';
const yourAccessToken = 'your_token_here'; // Replace with the actual token

async function Log(stack: string, level: string, pkg: string, message: string) {
  // Validate allowed values
  const validStacks = ['backend', 'frontend'];
  const validLevels = ['info', 'error', 'debug'];
  const validPackages = ['auth', 'handler', 'middleware'];

  if (!validStacks.includes(stack)) {
    console.error(`Invalid stack value. Must be one of: ${validStacks.join(', ')}`);
    return;
  }

  if (!validLevels.includes(level)) {
    console.error(`Invalid level value. Must be one of: ${validLevels.join(', ')}`);
    return;
  }

  if (!validPackages.includes(pkg)) {
    console.error(`Invalid package value. Must be one of: ${validPackages.join(', ')}`);
    return;
  }

  const logData: LogData = {
    stack,
    level,
    package: pkg,
    message,
  };

  try {
    const response = await fetch(LOG_SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourAccessToken}`
      },
      body: JSON.stringify(logData)
    });
    
    if (!response.ok) {
      console.error('Failed to send log:', await response.text());
    }
  } catch (error) {
    console.error('Error sending log:', error);
  }
}

export default Log;