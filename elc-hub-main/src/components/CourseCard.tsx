import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/courses";

interface CourseCardProps {
  course: Course;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="group flex flex-col rounded-xl border border-border bg-card p-6 card-elevated"
  >
    <div className="mb-4 text-4xl">{course.icon}</div>
    <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
      {course.level}
    </span>
    <h3 className="mb-2 text-lg font-bold text-card-foreground">{course.title}</h3>
    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
      {course.shortDescription}
    </p>
    <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
      <span>⏱ {course.duration}</span>
      <span>💰 {course.fee}</span>
    </div>
    <Link to={`/courses/${course.id}`}>
      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        View Details <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </Button>
    </Link>
  </motion.div>
);

export default CourseCard;
