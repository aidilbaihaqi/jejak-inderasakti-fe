# Deploying to staging / production

This repo's stack is a single container, **web** (the Next.js app), started from `deploy/docker-compose.yml`.
It has no domain or TLS of its own — Caddy in the **jejak-inderasakti-be** repo terminates TLS for
`penyengatadventure.tech` and reverse-proxies to this container by its Docker service name (`web:3000`).
Read that repo's `deploy/README.md` first; it covers server prep, DNS and the shared Docker network.

## 1. Prerequisites

- The `jejak-inderasakti-be` stack's `deploy-network` step has already run once on this host
  (creates the external `jejak_net` network both stacks join).
- This repo is cloned as a sibling of `jejak-inderasakti-be` (its Caddy config assumes both are
  reachable on the same host/network; the two repos deploy independently otherwise).

## 2. Configure

```bash
cp deploy/.env.example deploy/.env
```

`API_DOMAIN` must match the backend's `API_DOMAIN` in its own `deploy/.env` — it's baked into the
frontend's client bundle at build time as the WebSocket URL (`wss://API_DOMAIN/ws`), since
Next.js rewrites can proxy REST calls same-origin but not the WebSocket upgrade.

## 3. Build and start

```bash
make up   # docker compose up -d --build in deploy/ — builds the image, starts "web"
```

## 4. Verify

```bash
make ps
make logs
curl -i https://penyengatadventure.tech          # via Caddy, once the backend stack is also up
```

A 502 from Caddy at this point usually means the `web` container isn't healthy yet, or
`jejak_net` wasn't created before `make up` ran (recreate it, then `make up` again).

## 5. Operate

| Task | Command |
|---|---|
| Deploy a new version | `git pull && make up` (rebuilds the image with the current `deploy/.env`) |
| Stop | `make down` |
| Logs | `make logs` |

`make down` never removes `jejak_net` — it's external, owned by neither stack — so the backend
keeps running independently.
