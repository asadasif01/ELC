import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Users, BookOpen, BarChart3 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const values = [
  { icon: Target, title: "Our Mission", desc: "To provide accessible, high-quality English language education that empowers individuals in Gujranwala to communicate confidently in personal, academic, and professional settings." },
  { icon: Eye, title: "Our Vision", desc: "To become the leading English language center in Punjab, producing graduates who excel in global communication and contribute positively to society." },
  { icon: Lightbulb, title: "Teaching Philosophy", desc: "We believe in learning by doing. Our communicative approach combines practical exercises, real-world scenarios, and technology-enhanced learning to ensure every student achieves measurable progress." },
];

const methods = [
  { icon: Users, title: "Small Class Sizes", desc: "Maximum 15 students per class for personalized attention and maximum speaking practice." },
  { icon: BookOpen, title: "Immersive Curriculum", desc: "Modern, research-based curriculum with multimedia resources and authentic English materials." },
  { icon: BarChart3, title: "Progress Tracking", desc: "Regular assessments, feedback sessions, and progress reports to keep you on track." },
];

const About = () => (
  <>
    <section className="hero-gradient py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="mb-3 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
            About ELC
          </span>
          <h1 className="mb-4 text-4xl font-extrabold text-primary-foreground md:text-5xl">
            About ELC Gujranwala
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Founded with the vision of making quality English education accessible to everyone in Gujranwala, ELC has been transforming lives through language since its inception.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-xl border border-border bg-card p-8 card-elevated"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <v.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-card-foreground">{v.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-gradient py-20">
      <div className="container mx-auto px-4">
        <SectionHeading
          badge="Methodology"
          title="Our Teaching Approach"
          description="We combine proven methodologies with innovative techniques to deliver an engaging and effective learning experience."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {methods.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-border bg-card p-6 text-center card-elevated"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <m.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-bold text-card-foreground">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default About;
