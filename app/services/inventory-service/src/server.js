import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`Inventory service escuchando en puerto ${PORT}`);
});