import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
}

const SectionHeading = ({ badge, title, description, center = true }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className={`mb-12 ${center ? "text-center" : ""}`}
  >
    {badge && (
      <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        {badge}
      </span>
    )}
    <h2 className="text-3xl font-bold text-foreground md:text-4xl">{title}</h2>
    {description && (
      <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
