# Qui a balancé ? – frontend

Next.js (App Router) + TypeScript + Tailwind CSS v4 (config dans app/globals.css, pas de tailwind.config).

    npx create-next-app@latest secret-game --ts --tailwind --app --eslint --src-dir=false --import-alias "@/*"
    # puis copier ces fichiers par-dessus, et :
    npm run dev

Variable d'environnement : `NEXT_PUBLIC_API_URL` (voir `.env.local`).
