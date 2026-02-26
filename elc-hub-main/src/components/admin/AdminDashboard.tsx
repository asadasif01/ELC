import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ClipboardList, UserPlus } from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ students: 0, courses: 0, enrollments: 0, recent: 0 });
  const [recentStudents, setRecentStudents] = useState<{ name: string; email: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [profilesRes, coursesRes, enrollmentsRes, recentRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id", { count: "exact", head: true }),
        supabase.from("enrollments").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("name, email, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      setStats({
        students: profilesRes.count ?? 0,
        courses: coursesRes.count ?? 0,
        enrollments: enrollmentsRes.count ?? 0,
        recent: profilesRes.count ?? 0,
      });
      setRecentStudents(recentRes.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  const cards = [
    { label: "Total Students", value: stats.students, icon: Users, color: "text-blue-600" },
    { label: "Active Courses", value: stats.courses, icon: BookOpen, color: "text-green-600" },
    { label: "Total Enrollments", value: stats.enrollments, icon: ClipboardList, color: "text-purple-600" },
    { label: "Recent Signups", value: stats.recent, icon: UserPlus, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className={`h-5 w-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Registrations</CardTitle></CardHeader>
        <CardContent>
          {recentStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No students yet.</p>
          ) : (
            <div className="space-y-3">
              {recentStudents.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
