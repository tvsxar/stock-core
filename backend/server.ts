import app from './app.js';

const PORT = process.env.PORT || 1011;

app.listen(PORT, (error?: Error) => {
  if (error) {
    console.error(`Failed to start server on port ${PORT}:`, error);
    process.exit(1);
  }

  console.log(`Server started on http://localhost:${PORT}`);
});
