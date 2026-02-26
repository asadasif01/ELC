import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, BookOpen, Bell, ArrowRight, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface EnrolledCourse {
  id: string;
  course_id: string;
  status: string;
  course: { id: string; title: string; slug: string; duration: string | null };
  progress: number;
  totalLessons: number;
  completedLessons: number;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const Dashboard = () => {
  const { profile, signOut, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("id, course_id, status, courses(id, title, slug, duration)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const courses: EnrolledCourse[] = [];
      for (const e of enrollments ?? []) {
        const courseData = e.courses as unknown as { id: string; title: string; slug: string; duration: string | null };
        if (!courseData) continue;

        const { data: contentItems } = await supabase.from("course_content").select("id").eq("course_id", courseData.id);
        const totalLessons = contentItems?.length ?? 0;
        let completedLessons = 0;

        if (totalLessons > 0) {
          const contentIds = contentItems!.map((c) => c.id);
          const { data: progressData } = await supabase
            .from("content_progress").select("content_id").eq("user_id", user.id).eq("completed", true).in("content_id", contentIds);
          completedLessons = progressData?.length ?? 0;
        }

        courses.push({
          id: e.id, course_id: e.course_id, status: e.status, course: courseData,
          progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          totalLessons, completedLessons,
        });
      }
      setEnrolledCourses(courses);

      const { data: annData } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(5);
      setAnnouncements(annData ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {profile?.name || "Student"}</h1>
            <p className="text-muted-foreground">{profile?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate("/admin")}>Admin Panel</Button>
            )}
            <Link to="/profile">
              <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Edit Profile</Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button onClick={() => navigate("/courses")} variant="default">
            <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
          </Button>
        </div>

        {/* Enrolled Courses */}
        <h2 className="mb-4 text-xl font-bold text-foreground">My Enrolled Courses</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
        ) : enrolledCourses.length === 0 ? (
          <div className="mb-8 rounded-xl border border-border bg-card p-8 text-center card-elevated">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">You haven't enrolled in any courses yet.</p>
            <Button variant="outline" className="mt-4" size="sm" onClick={() => navigate("/courses")}>
              Browse Courses <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((ec) => (
              <div key={ec.id} className="rounded-xl border border-border bg-card p-5 card-elevated">
                <h3 className="mb-1 font-semibold text-foreground">{ec.course.title}</h3>
                {ec.course.duration && <p className="mb-3 text-xs text-muted-foreground">Duration: {ec.course.duration}</p>}
                <div className="mb-2 flex items-center gap-2">
                  <Progress value={ec.progress} className="h-2 flex-1" />
                  <span className="text-xs font-medium text-muted-foreground">{ec.progress}%</span>
                </div>
                <p className="mb-3 text-xs text-muted-foreground">{ec.completedLessons} of {ec.totalLessons} lessons</p>
                <Link to={`/course/${ec.course.id}/learn`}>
                  <Button variant="outline" size="sm" className="w-full">
                    {ec.progress > 0 ? "Continue Learning" : "Start Learning"} <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Quick Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 card-elevated">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Profile</h3>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>Phone: {profile?.phone || "Not set"}</p>
              <p>CNIC: {profile?.cnic || "Not set"}</p>
            </div>
            <Link to="/profile">
              <Button variant="link" size="sm" className="mt-2 p-0">Edit Profile →</Button>
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 card-elevated">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-3 text-lg font-semibold text-foreground">Announcements</h3>
            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="border-l-2 border-primary/30 pl-3">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.content.substring(0, 100)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
