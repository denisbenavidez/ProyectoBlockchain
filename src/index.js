import app from './app.js'
import { connectDB } from './db.js'

connectDB(); 
app.listen(4000);
console.log('server 4000', 4000);