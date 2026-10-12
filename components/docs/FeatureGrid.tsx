"use client"

import { motion } from "motion/react"

type Feature = { title: string; description: string; icon?: React.ReactNode }

/** Grid of feature tiles that stagger in when scrolled into view. */
export function FeatureGrid({ features }: { features: Feature[] }) {
  return (
    <motion.div
      className="features"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {features.map((f) => (
        <motion.div
          key={f.title}
          className="feature"
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          whileHover={{ y: -3 }}
        >
          {f.icon && <div className="feature-icon">{f.icon}</div>}
          <strong>{f.title}</strong>
          <p>{f.description}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
