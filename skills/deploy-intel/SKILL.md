---
name: deploy-intel
description: Build and deploy the intel-email-bot to Cloud Run
disable-model-invocation: true
allowed-tools: Bash, Read
---

# Deploy Intel Email Bot

Deploy `intel-email-bot` (intel@mail.anyreach.ai) to Cloud Run.

**Project dir**: `C:\Users\Lin Richard\intel-email-bot\`

## Steps

1. `cd ~/intel-email-bot`
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy intel-email-bot --source . --region us-central1 --project anyreach-console --allow-unauthenticated
   ```
3. After deploy succeeds, verify with:
   ```bash
   curl -s https://intel-email-bot-788431076434.us-central1.run.app/health
   ```
4. Report the new revision name and health check result.
