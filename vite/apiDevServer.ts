import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin, ViteDevServer } from 'vite'

/**
 * Serves the `api/` routes from the Vite dev server.
 *
 * In production these are real Vercel Functions. Locally, `vite` alone would
 * 404 on `/api/*`, so this mounts the same handlers as dev middleware — no
 * Vercel CLI or account needed to develop against auth and progress.
 *
 * The handlers are loaded through `ssrLoadModule`, so they are transformed by
 * Vite (TypeScript, ESM) and hot-reload on edit like the rest of the app.
 */

/** Node request → Web `Request`, the shape our handlers take. */
async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const host = req.headers.host ?? 'localhost'
  const url = new URL(req.url ?? '/', `http://${host}`)

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item)
    } else {
      headers.set(key, value)
    }
  }

  const method = req.method ?? 'GET'
  const hasBody = method !== 'GET' && method !== 'HEAD'

  let body: Buffer | undefined
  if (hasBody) {
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(chunk as Buffer)
    }
    body = Buffer.concat(chunks)
  }

  return new Request(url, {
    method,
    headers,
    body,
    // Required by Node's fetch when a body is present.
    ...(body ? { duplex: 'half' } : {}),
  } as RequestInit)
}

async function sendWebResponse(
  res: ServerResponse,
  response: Response,
): Promise<void> {
  res.statusCode = response.status

  // Auth sends multiple Set-Cookie headers; they must not be collapsed into one.
  const setCookies = response.headers.getSetCookie()
  if (setCookies.length > 0) {
    res.setHeader('set-cookie', setCookies)
  }

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') return
    res.setHeader(key, value)
  })

  const body = Buffer.from(await response.arrayBuffer())
  res.end(body)
}

interface ServerModules {
  auth: { handler: (request: Request) => Promise<Response> }
  progressRoutes: {
    list: (request: Request) => Promise<Response>
    complete: (request: Request) => Promise<Response>
  }
  streakRoutes: {
    get: (request: Request) => Promise<Response>
  }
  achievementRoutes: {
    list: (request: Request) => Promise<Response>
  }
}

async function loadServerModules(server: ViteDevServer): Promise<ServerModules> {
  const [authModule, containerModule] = await Promise.all([
    server.ssrLoadModule('/src/server/auth/betterAuth.ts'),
    server.ssrLoadModule('/src/server/container.ts'),
  ])

  return {
    auth: authModule.auth,
    progressRoutes: containerModule.progressRoutes,
    streakRoutes: containerModule.streakRoutes,
    achievementRoutes: containerModule.achievementRoutes,
  }
}

/** Maps a request onto the same handlers the `api/` functions call. */
async function dispatch(
  { auth, progressRoutes, streakRoutes, achievementRoutes }: ServerModules,
  request: Request,
): Promise<Response | null> {
  const { pathname } = new URL(request.url)

  if (pathname.startsWith('/api/auth/')) {
    return auth.handler(request)
  }

  if (pathname === '/api/progress') {
    return progressRoutes.list(request)
  }

  if (pathname === '/api/progress/complete') {
    return progressRoutes.complete(request)
  }

  if (pathname === '/api/streak') {
    return streakRoutes.get(request)
  }

  if (pathname === '/api/achievements') {
    return achievementRoutes.list(request)
  }

  return null
}

export function apiDevServer(): Plugin {
  return {
    name: 'logiclings:api-dev-server',
    apply: 'serve',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          next()
          return
        }

        void (async () => {
          try {
            const modules = await loadServerModules(server)
            const request = await toWebRequest(req)
            const response = await dispatch(modules, request)

            if (!response) {
              next()
              return
            }

            await sendWebResponse(res, response)
          } catch (error) {
            if (error instanceof Error) {
              server.ssrFixStacktrace(error)
            }
            // Surfaces a missing DATABASE_URL / unreachable database as a
            // readable 500 instead of a hung request.
            server.config.logger.error(
              `[api] ${req.method} ${req.url} failed:\n${
                error instanceof Error ? (error.stack ?? error.message) : error
              }`,
            )

            res.statusCode = 500
            res.setHeader('content-type', 'application/json')
            res.end(
              JSON.stringify({
                error: {
                  code: 'internal_error',
                  message:
                    error instanceof Error
                      ? error.message
                      : 'The API failed to handle this request.',
                },
              }),
            )
          }
        })()
      })
    },
  }
}
