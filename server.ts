import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
const cors = require('cors');
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/NGAppServerSideRender/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  const comp1 = existsSync(join(distFolder, 'componente1.component.html'));
  const home1 = existsSync(join(distFolder, 'home1.html'));

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(express.json());
  server.use(cors({
        origin: '*',
        optionsSuccessStatus: 200
      })
);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  server.get('/home', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  server.post('/api/initialize', (req, res) => {
  
    console.log("request: ", req.body);

    // let email= req.body.email;
    // let password= req.body.password;

    // if ((req.body.email == undefined || req.body.email == null) || 
    //     (req.body.password == null || req.body.password == undefined))
    // {
      
    //   return res.status(400).json({
    //     error: true,
    //     message: "Falta diligenciar valores en los campos requeridos"
    //   });

    // }

    //return res.status(200).json(JSON.stringify(req));
    //return res.status(200).json(req);
    
    // return res.status(200).json({
      //   error: false,
      //   message: "Metodo Post ejecutado exitosamente!"
      // });
      
    return res.status(200).json(req.body);

    //return res.send('modulo-web');
    //return res.send('app-componente1');
    //return res.send(home1);
    //return res.render('home1.html', { initialize: req.body });
  });


  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';