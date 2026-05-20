"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Calendar, User, ArrowRight } from "lucide-react"

const posts = [
  {
    category: "Industry Insight",
    title: "The Future of Last-Mile Delivery in Southeast Asia",
    excerpt:
      "As e-commerce accelerates across the region, logistics companies face mounting pressure to deliver faster, cheaper, and greener.",
    author: "Sarah Chen",
    date: "May 12, 2025",
    readTime: "5 min read",
  },
  {
    category: "Product Update",
    title: "Real-Time Tracking Now Available on All Routes",
    excerpt:
      "We've rolled out live GPS tracking for every shipment in our network. Monitor your parcels from pickup to delivery.",
    author: "David Tan",
    date: "April 28, 2025",
    readTime: "3 min read",
  },
  {
    category: "Company News",
    title: "Airpak Express Expands to 10 New European Markets",
    excerpt:
      "Our expansion into Germany, France, Spain, Italy, and five more countries marks a major milestone for global coverage.",
    author: "James Wilson",
    date: "April 15, 2025",
    readTime: "4 min read",
  },
  {
    category: "Tips & Guide",
    title: "How to Prepare Your Packages for International Shipping",
    excerpt:
      "A step-by-step guide to packaging, labeling, and documentation to ensure your international shipments clear customs smoothly.",
    author: "Lisa Wong",
    date: "March 30, 2025",
    readTime: "6 min read",
  },
  {
    category: "Industry Insight",
    title: "Sustainable Logistics: Reducing Carbon Footprint in 2025",
    excerpt:
      "Our commitment to carbon-neutral operations by 2027 and the initiatives we're deploying across our fleet.",
    author: "Priya Sharma",
    date: "March 18, 2025",
    readTime: "7 min read",
  },
  {
    category: "Customer Story",
    title: "How TechMart Cut Delivery Times by 40% with Airpak",
    excerpt:
      "A deep dive into how our API integration and dedicated fulfillment network transformed TechMart's operations.",
    author: "Marco Rossi",
    date: "February 25, 2025",
    readTime: "5 min read",
  },
]

const categoryColors: Record<string, string> = {
  "Industry Insight": "text-blue-400 bg-blue-400/10",
  "Product Update": "text-green-400 bg-green-400/10",
  "Company News": "text-purple-400 bg-purple-400/10",
  "Tips & Guide": "text-yellow-400 bg-yellow-400/10",
  "Customer Story": "text-pink-400 bg-pink-400/10",
}

export default function BlogComponent01() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-white text-2xl font-semibold mb-3">Latest from Airpak</h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Insights, updates, and stories from our global logistics network
          </p>
        </motion.div>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.4 }}
              className={cn(
                "bg-white/4 border border-white/8 rounded-xl p-5",
                "hover:bg-white/8 transition-colors duration-300",
                "flex flex-col sm:flex-row sm:items-start gap-4 cursor-pointer group"
              )}
            >
              {/* No image — text-only card */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full",
                      categoryColors[post.category] ?? "text-white/40 bg-white/10"
                    )}
                  >
                    {post.category}
                  </span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs">{post.readTime}</span>
                </div>

                <h3 className="text-white font-semibold text-base mb-2 leading-snug group-hover:text-white/80 transition-colors">
                  {post.title}
                </h3>

                <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-white/30">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </span>
                </div>
              </div>

              <div className="flex sm:items-center sm:self-center">
                <div className="w-8 h-8 rounded-full bg-white/6 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 text-center"
        >
          <button className="px-6 py-2.5 rounded-lg border border-white/20 text-white/70 text-sm hover:bg-white/6 transition-colors">
            View All Articles
          </button>
        </motion.div>
      </div>
    </section>
  )
}