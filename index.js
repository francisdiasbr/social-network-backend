import process from 'process';
import mongoose from 'mongoose';
import util from 'util';

import config from './server/config/config.js';
import app from './server/config/express.js';


// Maneira moderna de capturar exceções não tratadas
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
});

// Função global de log para ambiente de desenvolvimento
global.l = (...args) => {
  if (config.env !== 'production') {
    console.log(...args);
  }
};

// Conexão ao MongoDB
const mongoUri = config.mongo.host;
(async () => {
  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.info(`Conectado ao MongoDB: ${mongoUri}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${mongoUri}`, error);
    process.exit(1);
  }
})();

if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}


app.listen(config.port, () => {
  console.info(`Servidor iniciado na porta ${config.port} (${config.env})`);
});

export default app;
