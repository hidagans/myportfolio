import { motion } from 'framer-motion';

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  slug: string;
}

export default function BlogCard({ title, excerpt, image, date, slug }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden"
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <time className="text-purple-400 text-sm">{date}</time>
        <h3 className="text-xl font-bold text-white mt-2 mb-3">{title}</h3>
        <p className="text-gray-300 mb-4">{excerpt}</p>
        <a
          href={`/blog/${slug}`}
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Read more →
        </a>
      </div>
    </motion.article>
  );
}