import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  fee: number | null;
}

const Courses = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("courses")
      .select("id, title, slug, description, duration, fee")
      .eq("published", true)
      .order("created_at")
      .then(({ data }) => { setCourses(data ?? []); setLoading(false); });
  }, []);

  return (
    <>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <span className="mb-3 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">Our Courses</span>
            <h1 className="mb-4 text-4xl font-extrabold text-primary-foreground md:text-5xl">Explore Our Modules</h1>
            <p className="text-lg text-primary-foreground/80">From beginner to advanced, our courses are designed to take you on a complete English language journey.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : (
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
                    {course.description ? course.description.substring(0, 120) + "…" : "No description available."}
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
              {courses.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">No courses available yet.</div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Courses;
