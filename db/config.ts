import { defineDb, defineTable, column } from 'astro:db';

const Project = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    description: column.text(),
    image: column.text(),
    link: column.text(),
    tags: column.text(),
    createdAt: column.date()
  }
});

const BlogPost = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    title: column.text(),
    content: column.text(),
    image: column.text(),
    createdAt: column.date()
  }
});

const Admin = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    username: column.text({ unique: true }),
    password: column.text()
  }
});

export default defineDb({
  tables: { Project, BlogPost, Admin }
});