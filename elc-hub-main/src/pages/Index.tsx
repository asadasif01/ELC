import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Users, Award, BarChart3, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";
import { supabase } from "@/integrations/supabase/client";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  fee: number | null;
}

interface Testimonial {
  id: string;
  student_name: string;
  message: string;
  rating: number;
}

const features = [
  { icon: BookOpen, title: "Practical Learning", desc: "Hands-on activities and real-world scenarios to build practical language skills." },
  { icon: Users, title: "Confidence Building", desc: "A supportive environment that encourages you to speak, make mistakes, and grow." },
  { icon: Award, title: "Qualified Teachers", desc: "Experienced instructors with professional certifications in English language teaching." },
  { icon: BarChart3, title: "Regular Assessments", desc: "Continuous evaluation to track your progress and identify areas for improvement." },
];

const Index = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, title, slug, description, duration, fee")
      .eq("published", true)
      .order("created_at")
      .limit(6)
      .then(({ data }) => setCourses(data ?? []));

    supabase
      .from("testimonials")
      .select("id, student_name, message, rating")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setTestimonials(data ?? []));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 hero-gradient opacity-85" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
            <span className="mb-4 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              Welcome to ELC Gujranwala
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-primary-foreground md:text-6xl">
              ELC by Gujranwala
            </h1>
            <p className="mb-8 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
              Empowering you with world-class English language education. From beginner to advanced — unlock your potential with our expertly designed courses.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#courses">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Explore Courses <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </a>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 font-semibold text-primary-foreground hover:bg-primary-foreground/20">
                  Register Now <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-gradient py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="About Us"
            title="Our Mission & Vision"
            description="At ELC Gujranwala, we believe every student deserves access to quality English language education. Our mission is to bridge the communication gap and empower learners with the skills they need to succeed globally."
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {[
              { title: "Expert Faculty", value: "15+", desc: "Certified teachers" },
              { title: "Students Taught", value: "2,000+", desc: "And counting" },
              { title: "Success Rate", value: "95%", desc: "Course completion" },
            ].map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="rounded-xl border border-border bg-card p-6 text-center card-elevated"
              >
                <p className="text-3xl font-extrabold text-gradient">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section id="courses" className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Our Courses"
            title="Explore Our Modules"
            description="From foundational English to exam preparation, our carefully designed modules cater to every level of learner."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 card-elevated"
              >
                <h3 className="mb-2 text-lg font-bold text-card-foreground">{course.title}</h3>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {course.description ? course.description.substring(0, 100) + "…" : ""}
                </p>
                <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {course.duration && <span>⏱ {course.duration}</span>}
                  {course.fee != null && <span>💰 PKR {course.fee.toLocaleString()}</span>}
                </div>
                <Link to={`/courses/${course.slug}`}>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-gradient py-20">
        <div className="container mx-auto px-4">
          <SectionHeading
            badge="Why ELC"
            title="Why Choose ELC Gujranwala?"
            description="We go beyond textbooks to create an immersive English learning experience."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-xl border border-border bg-card p-6 text-center card-elevated"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-2 font-bold text-card-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeading
              badge="Testimonials"
              title="What Our Students Say"
              description="Hear from students who have transformed their English skills at ELC."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="rounded-xl border border-border bg-card p-6 card-elevated"
                >
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">"{t.message}"</p>
                  <p className="text-sm font-semibold text-foreground">— {t.student_name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Start Your English Journey?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
              Get in touch with us today and take the first step towards mastering English.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Contact Us <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 font-semibold text-primary-foreground hover:bg-primary-foreground/20">
                  Register Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;
