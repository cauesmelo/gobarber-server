import express from 'express';
import routes from './routes/index';
import 'reflect-metadata';
import uploadConfig from './config/upload';

import './database';

const app = express();

app.use(express.json());

app.use('/', routes);
app.use('/file', express.static(uploadConfig.directory));

app.listen(3333, () => {
  console.log('Server Running. Port: 3333');
});
