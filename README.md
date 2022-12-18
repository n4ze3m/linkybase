# LinkYBase

Linkybase is a free and open source web app that allows you to manage your links in one place. Collect, organize, and share your links with your friends and family.

## Current Features

- Add links
- Create collections
- Share collections
- Search links (full text search)

## Planned Features

- Browser extension to add links
- Import links from other services
- Export links to other services
- DND to reorder links


## Development


### Requirements

- Node.js
- Supabase account

### Setup

1. Clone the repository

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a Supabase project

4. Add required environment variables

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` - Supabase database url
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
   - `NEXT_PUBLIC_SUPABASE_SERVICE_KEY` - Supabase service key
   -  `LINKY_SCRAPY_URL` - LinkyScrapy API url

* for `LINKY_SCRAPY_URL` host supabase edge functions

5. Run the development server

   ```bash

    npm run dev
    
    ```