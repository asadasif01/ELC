import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, DollarSign, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  fee: number | null;
  learning_outcomes: string[] | null;
  image_url: string | null;
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, title, slug, description, duration, fee, learning_outcomes, image_url")
        .eq("slug", courseId!)
        .single();
      setCourse(data);

      if (data && user) {
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_id", data.id)
          .maybeSingle();
        setEnrolled(!!enrollment);
      }
      setLoading(false);
    };
    load();
  }, [courseId, user]);

  const handleEnroll = async () => {
    if (!user) { navigate("/login", { state: { from: `/courses/${courseId}` } }); return; }
    if (!course) return;
    setEnrolling(true);
    const { error } = await supabase.from("enrollments").insert({ user_id: user.id, course_id: course.id });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setEnrolled(true);
      toast({ title: "Enrolled!", description: `You are now enrolled in ${course.title}.` });
    }
    setEnrolling(false);
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  if (!course) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Course Not Found</h1>
        <Link to="/courses"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses</Button></Link>
      </div>
    </div>
  );

  return (
    <>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <Link to="/courses" className="mb-4 inline-flex items-center gap-1 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Courses
            </Link>
            <h1 className="mb-4 text-3xl font-extrabold text-primary-foreground md:text-5xl">{course.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/80">
              {course.duration && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {course.duration}</span>}
              {course.fee != null && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> PKR {course.fee.toLocaleString()}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              {course.description && (
                <>
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Course Description</h2>
                  <p className="mb-10 text-base leading-relaxed text-muted-foreground">{course.description}</p>
                </>
              )}

              {course.learning_outcomes && course.learning_outcomes.length > 0 && (
                <>
                  <h2 className="mb-4 text-2xl font-bold text-foreground">Learning Outcomes</h2>
                  <ul className="mb-10 space-y-3">
                    {course.learning_outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="rounded-xl border border-border bg-card p-6 card-elevated">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                  <div>
                    {course.fee != null && (
                      <>
                        <p className="text-sm text-muted-foreground">Course Fee</p>
                        <p className="text-2xl font-extrabold text-gradient">PKR {course.fee.toLocaleString()}</p>
                      </>
                    )}
                  </div>
                  {enrolled ? (
                    <Link to={`/course/${course.id}/learn`}>
                      <Button size="lg" className="font-semibold">Go to Course</Button>
                    </Link>
                  ) : (
                    <Button size="lg" className="font-semibold" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enrolling...</> : "Enroll Now"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CourseDetail;
