import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, BookOpen, Users, Star, Megaphone, FileText, Mail } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminCourseContent from "@/components/admin/AdminCourseContent";
import AdminStudents from "@/components/admin/AdminStudents";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminAnnouncements from "@/components/admin/AdminAnnouncements";
import AdminContacts from "@/components/admin/AdminContacts";

const Admin = () => {
  const { profile } = useAuth();
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">Welcome, {profile?.name || "Admin"}</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="flex w-full flex-wrap gap-1">
          <TabsTrigger value="dashboard" className="gap-1.5"><LayoutDashboard className="h-4 w-4" /><span className="hidden sm:inline">Dashboard</span></TabsTrigger>
          <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="h-4 w-4" /><span className="hidden sm:inline">Courses</span></TabsTrigger>
          <TabsTrigger value="content" className="gap-1.5"><FileText className="h-4 w-4" /><span className="hidden sm:inline">Content</span></TabsTrigger>
          <TabsTrigger value="students" className="gap-1.5"><Users className="h-4 w-4" /><span className="hidden sm:inline">Students</span></TabsTrigger>
          <TabsTrigger value="testimonials" className="gap-1.5"><Star className="h-4 w-4" /><span className="hidden sm:inline">Testimonials</span></TabsTrigger>
          <TabsTrigger value="announcements" className="gap-1.5"><Megaphone className="h-4 w-4" /><span className="hidden sm:inline">Announcements</span></TabsTrigger>
          <TabsTrigger value="contacts" className="gap-1.5"><Mail className="h-4 w-4" /><span className="hidden sm:inline">Messages</span></TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard"><AdminDashboard /></TabsContent>
        <TabsContent value="courses"><AdminCourses /></TabsContent>
        <TabsContent value="content"><AdminCourseContent /></TabsContent>
        <TabsContent value="students"><AdminStudents /></TabsContent>
        <TabsContent value="testimonials"><AdminTestimonials /></TabsContent>
        <TabsContent value="announcements"><AdminAnnouncements /></TabsContent>
        <TabsContent value="contacts"><AdminContacts /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
