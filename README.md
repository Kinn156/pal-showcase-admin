# Pal Showcase Suite

Build a modern, dark-themed corporate and product showcase website for "Pal Inc" using Next.js (App Router), Tailwind CSS, TypeScript, and Lucide React icons. The platform must feature a fully functional Admin Panel to dynamically manage content without hardcoding.



### 1. Global Layout & Navigation Header

- **Left Corner:** "Pal Inc" brand name with a sleek geometric logo icon.

- **Right Corner (Desktop & Responsive Menu):** 

  - Navigation links: "Company & Investors", "Products", "Terms & Policy", "Support".

  - Action buttons: "Join" and "Talk to team".

- **Theme:** Strict Vercel-inspired dark mode aesthetic (deep blacks `bg-black`, zinc surfaces `bg-zinc-900/50`, subtle borders `border-white/10`, and backdrop blurring).



### 2. Hero Section

- **Motto / Tagline:** "Freedom of Software" displayed in bold, clean, large typography with smooth tracking.

- **Dynamic Background System:** 

  - Support background media rotation (images and looping background videos) managed via the admin panel.

  - Apply dark gradient overlays to ensure text remains crisp and readable over any media.

- **CTAs:** Prominent primary and secondary buttons matching the header actions ("Join" and "Talk to team").



### 3. Products Section (Vercel Exact Style)

- **Design Layout:** A responsive grid featuring layered, floating UI mockup cards. Each card must have:

  - Thin borders (`border-white/10`), deep shadows (`shadow-2xl`), rounded corners (`rounded-2xl`), and internal glow effects.

  - An embedded high-fidelity application mockup or video preview container.

- **Explore Functionality:** Every product card must include an "Explore" button that directs users to a designated external or internal link.

- **Dynamic Data:** Product details, images, video paths, titles, descriptions, and explore URLs must be fetched dynamically from a database or JSON configuration file linked to the admin panel.



### 4. About Section & Footer

- **About Section:** A clean narrative layout explaining Pal Inc's mission, philosophy, and infrastructure vision.

- **Footer:** Contains company legal links, social media handles (Twitter/X, GitHub, LinkedIn, Discord), and copyright notices.



### 5. Admin Panel (`/admin`)

- Build a protected admin dashboard interface allowing management of:

  - **Background Media Manager:** Upload, preview, and select active background images/videos for the hero section.

  - **Product CRUD (Create, Read, Update, Delete):** Add new products, edit titles, descriptions, mockup assets, and configure the custom **Explore URL** for each product card.

  - **Site Metadata:** Quick toggles to update the motto, announce

ment banners, and header links.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dbacb522-c3ac-4b49-ae60-cd25a708dcfb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
