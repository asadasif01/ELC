import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ContentItem { id: string; title: string; content: string; sort_order: number; }
interface ProgressItem { content_id: string; completed: boolean; }

const renderContent = (content: string) => {
  // Split content by image tags and render text + images
  const parts = content.split(/\[IMAGE:\s*(https?:\/\/[^\]]+)\]/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // This is a URL (odd indices after split)
      return <img key={i} src={part} alt="Lesson image" className="my-4 max-w-full rounded-lg border border-border" />;
    }
    return part ? <span key={i}>{part}</span> : null;
  });
};

const CourseLearn = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<{ id: string; title: string; slug: string } | null>(null);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: courseData } = await supabase.from("courses").select("id, title, slug").eq("id", courseId!).single();
      setCourse(courseData);

      const { data: contentData } = await supabase.from("course_content").select("id, title, content, sort_order").eq("course_id", courseId!).order("sort_order");
      setContents(contentData ?? []);
      if (contentData && contentData.length > 0) setActiveLesson(contentData[0].id);

      if (user) {
        const contentIds = (contentData ?? []).map((c) => c.id);
        if (contentIds.length > 0) {
          const { data: progressData } = await supabase.from("content_progress").select("content_id, completed").eq("user_id", user.id).in("content_id", contentIds);
          setProgress(progressData ?? []);
        }
      }
      setLoading(false);
    };
    load();
  }, [courseId, user]);

  const isCompleted = (contentId: string) => progress.some((p) => p.content_id === contentId && p.completed);

  const toggleComplete = async (contentId: string) => {
    if (!user) return;
    const existing = progress.find((p) => p.content_id === contentId);
    if (existing) {
      const newVal = !existing.completed;
      await supabase.from("content_progress").update({ completed: newVal, completed_at: newVal ? new Date().toISOString() : null }).eq("user_id", user.id).eq("content_id", contentId);
      setProgress((prev) => prev.map((p) => p.content_id === contentId ? { ...p, completed: newVal } : p));
    } else {
      await supabase.from("content_progress").insert({ user_id: user.id, content_id: contentId, completed: true, completed_at: new Date().toISOString() });
      setProgress((prev) => [...prev, { content_id: contentId, completed: true }]);
    }
  };

  const completedCount = progress.filter((p) => p.completed).length;
  const progressPercent = contents.length > 0 ? Math.round((completedCount / contents.length) * 100) : 0;
  const activeContent = contents.find((c) => c.id === activeLesson);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  if (!course) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Course Not Found</h1>
        <Link to="/dashboard"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Button></Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{course.title}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={progressPercent} className="h-2 flex-1" />
            <span className="text-sm font-medium text-muted-foreground">{progressPercent}%</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{completedCount} of {contents.length} lessons completed</p>
        </div>

        {contents.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center card-elevated">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground">No Content Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">The instructor hasn't added any lessons to this course yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar */}
            <div className="rounded-xl border border-border bg-card p-4 card-elevated h-fit">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Lessons</h3>
              <div className="space-y-1">
                {contents.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveLesson(c.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      activeLesson === c.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {isCompleted(c.id) ? <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" /> : <Circle className="h-4 w-4 shrink-0" />}
                    <span className="truncate">{c.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {activeContent && (
              <div className="rounded-xl border border-border bg-card p-6 card-elevated">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">{activeContent.title}</h2>
                  <Button variant={isCompleted(activeContent.id) ? "default" : "outline"} size="sm" onClick={() => toggleComplete(activeContent.id)}>
                    {isCompleted(activeContent.id) ? <><CheckCircle2 className="mr-1 h-4 w-4" /> Completed</> : "Mark Complete"}
                  </Button>
                </div>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {renderContent(activeContent.content)}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CourseLearn;
