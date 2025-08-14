# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/0aa1bf2a-f620-45fd-a1a5-4dc7f87c3e40

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/0aa1bf2a-f620-45fd-a1a5-4dc7f87c3e40) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/0aa1bf2a-f620-45fd-a1a5-4dc7f87c3e40) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Email provider: Zoho SMTP

This app sends all transactional emails via Zoho SMTP.

Edge Functions:
- contact-seller: Sends buyer messages to sellers using Zoho SMTP (From: StableWise <info@stablewise.org>).
- send-test-email: Sends a test email to ZOHO_FROM_EMAIL by default, or to a provided "toEmail" in the request body.

Testing:
- In your app code, invoke: `supabase.functions.invoke('send-test-email', { body: { toEmail: 'you@stablewise.org' } })`
- Or call from the Supabase dashboard Functions tester. Check logs if needed.

Zoho DNS setup checklist:
- SPF includes Zoho: `v=spf1 include:zoho.eu ~all` (region may vary)
- DKIM enabled for your domain in Zoho Mail Admin
- Ensure SMTP is enabled for the mailbox and you use an app password

All emails now originate from https://stablewise.org and info@stablewise.org.

