import {once} from 'events';
import express, {Request, Response} from 'express';
import * as http from 'http';
import {ApplicationConfig, TryExpressApplication} from './application';

export {ApplicationConfig};

export class ExpressServer {
  public readonly app: express.Application;
  public readonly lbApp: TryExpressApplication;
  private server?: http.Server;

  constructor(options: ApplicationConfig = {}) {
    this.app = express();
    this.lbApp = new TryExpressApplication(options);

    // this.app.use(express.static('public'));

    this.app.use('/api', this.lbApp.requestHandler);

    // Custom Express routes
    this.app.get('/', function (_req: Request, res: Response) {
      res.redirect('/api/explorer/');
    });

  }

  async boot() {
    await this.lbApp.boot();
  }

  public async start() {
    // await this.lbApp.start();
    const port = this.lbApp.restServer.config.port ?? 3000;
    const host = this.lbApp.restServer.config.host || '127.0.0.1';
    // const port = 3000;
    // const host = '127.0.0.1';
    this.server = this.app.listen(port, host);
    console.log(`Express server is running at http://${host}:${port}`);
    await once(this.server, 'listening');
  }

  // For testing purposes
  public async stop() {
    if (!this.server) return;
    // await this.lbApp.stop();
    this.server.close();
    await once(this.server, 'close');
    this.server = undefined;
  }
}
