# Deployment

## Platform: Vercel

Production: **https://mat-ma-dien-bien-phu.vercel.app/**

Deployed31/10/2026 using the connected **Vercel MCP**, without Vercel CLI or a local token. Project `mat-ma-dien-bien-phu`, ID `prj_rbJ8UVUhlOnca4n98tQbfKQBjKiw`. Production deployment `dpl_HQewuAkur9BPE4w5nSH9jrnm9G3W`, confirmed `READY`.

Source: `thaideptrai218/mat-ma-dien-bien-phu`, branch `feat/complete-five-room-campaign`, commit `32ffcc5505fa624f171014db488ed110646578b6`. This publishes the complete campaign and new illustrated exploration sprite; it does not merge PR#3 into main. Deploy future updates from the intended reviewed branch/commit explicitly.

## Deploy command: connected MCP

Use `get_project` to reuse the project above, then `create_deployment` with:

```json
{
  "requestBody": {
    "name": "mat-ma-dien-bien-phu",
    "project": "prj_rbJ8UVUhlOnca4n98tQbfKQBjKiw",
    "target": "production",
    "gitSource": {
      "type": "github",
      "org": "thaideptrai218",
      "repo": "mat-ma-dien-bien-phu",
      "ref": "feat/complete-five-room-campaign",
      "sha": "32ffcc5505fa624f171014db488ed110646578b6"
    },
    "projectSettings": {
      "framework": "vite",
      "installCommand": "npm ci",
      "buildCommand": "npm run build",
      "outputDirectory": "dist"
    }
  }
}
```

Replace `sha`/`ref` with the intended reviewed update, inspect returned deployment ID via `get_deployment` until READY, then verify the public URL anonymously. No SPA catch-all rewrite: the build has five real HTML entries. The Vercel project selected Node26.x by default; cloud build reached READY and runtime smoke passed. Source engine remains >=22.12.0.

## Environment variables

None required. Fonts, sprites, illustrations and synthesized audio are local browser assets. No private source PDF/transcript, backend, API key or user-written reflection is uploaded by the application. Deployment builds only the Vite `dist` output.

## Domains and access

The Vercel-provided `mat-ma-dien-bien-phu.vercel.app` production alias is publicly playable without a Vercel login; checked with anonymous HTTP and a fresh browser. No custom domain or DNS configuration requested. Account protection defaults were not changed.

## Verification

- Anonymous HTTP200 on `/`, `/room-one.html`, `/room-two.html`, `/room-three.html`, `/room-four.html`.
- Fresh public browser completed museum intro into real Room1, loaded fonts/canvas and new `quang-reference` sprite; body24×16.
- Actual keyboard walk/run, release-to-idle and map pause passed. Trusted audio click unlocked Web Audio; movement produced a footstep. Zero captured runtime exceptions.
- Deployed sprite bytes match the reviewed artifact: SHA256 `580d3d2b3482a4266dae04adbc2e6b16d2e8cfdcbeb5428779552630932f4dea`.
- This is deployment smoke coverage; prior full campaign and119-test results remain in their scoped reports. The entire puzzle journey was not replayed on the public origin.

Save data belongs to each origin: localhost and Vercel have independent progress. Keep previous hashed build assets available during hosting updates where possible; refresh an old tab after a new deployment if its lazy asset is retired.

## Rollback

Use MCP `list_deployments` to identify a previously verified production READY deployment, then `request_rollback` with this project ID and that deployment ID. No previous production revision existed at first publication, so rollback was documented but not executed. Do not reset source/main or overwrite the protected Bảo checkout.

## Operational note

MCP create/get project/deployment succeeded. The optional build-log endpoint returned403 for its team scope; no log contents were read and no alternate credentials/CLI were used. Deployment verification used READY status plus public HTTP/runtime checks. If future failure diagnosis requires private build logs, grant this connection the indicated team access before reading them.
