graph LR
User(["👤 Utilisateur"])

    User -->|HTTP| React["Frontend\nReact :5173"]

    React -->|REST JSON| NestJS["Backend\nNestJS :3000"]

    NestJS -->|Prisma| DB[("PostgreSQL\n:5432")]
    NestJS -->|read/write| FS["Filesystem\n/uploads"]

    Cron["Cron Job\nquotidien"] -->|purge| DB
    Cron -->|supprime| FS