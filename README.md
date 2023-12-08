# sovok

## Usage

### Development

```bash
npm i
npm run dev
```

This starts the server and the Vite dev server. You can then access the app at
`http://localhost:5173`. The server is proxied to `http://localhost:3000` so
that you can use the API at `/api`.

### Production

```bash
npm run build
npm start
```

This builds the app into the `dist` folders and starts the server. You can then
access the app at `http://localhost:3000`.

#### Env

```bash
# .env
PORT=3000 # Port to run the server on
```
