# Deployment

## Production

- URL: https://mat-ma-dien-bien-phu.vercel.app/
- Platform: Vercel, deployed through the connected Vercel MCP.
- Project: `mat-ma-dien-bien-phu` (`prj_rbJ8UVUhlOnca4n98tQbfKQBjKiw`).
- Repository: `thaideptrai218/mat-ma-dien-bien-phu`.

Deploy the reviewed commit from `fix/alternating-sprite-gait` with the Vercel MCP. The project uses Vite, installs with `npm ci`, builds with `npm run build`, and publishes `dist`. Check the deployment until it reaches `READY`, then confirm the public campaign and standalone room pages respond over HTTPS.

## Configuration

No environment variables are required. Fonts, sprites, illustrations, and audio are bundled as local assets.

## Rollback

Use Vercel MCP `list_deployments` to find a verified production deployment, then `request_rollback` with this project ID and deployment ID.
