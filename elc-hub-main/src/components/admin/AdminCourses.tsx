import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Course = Tables<"courses">;

const emptyCourse = { title: "", slug: "", description: "", duration: "", fee: "", image_url: "", learning_outcomes: "", published: true };

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyCourse);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyCourse); setOpen(true); };
  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      title: c.title, slug: c.slug, description: c.description ?? "",
      duration: c.duration ?? "", fee: c.fee?.toString() ?? "", image_url: c.image_url ?? "",
      learning_outcomes: (c.learning_outcomes ?? []).join("\n"), published: c.published,
    });
    setOpen(true);
  };

  const save = async () => {
    const payload = {
      title: form.title, slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-"),
      description: form.description || null, duration: form.duration || null,
      fee: form.fee ? parseFloat(form.fee) : null, image_url: form.image_url || null,
      learning_outcomes: form.learning_outcomes ? form.learning_outcomes.split("\n").filter(Boolean) : null,
      published: form.published,
    };
    if (editing) {
      const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Course updated" });
    } else {
      const { error } = await supabase.from("courses").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Course created" });
    }
    setOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    await supabase.from("courses").delete().eq("id", id);
    toast({ title: "Course deleted" });
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Courses</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew}><Plus className="mr-1 h-4 w-4" />Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Course" : "Add Course"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from title" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Duration</Label><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
                <div><Label>Fee (PKR)</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} /></div>
              </div>
              <div><Label>Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
              <div><Label>Learning Outcomes (one per line)</Label><Textarea value={form.learning_outcomes} onChange={(e) => setForm({ ...form, learning_outcomes: e.target.value })} rows={4} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /><Label>Published</Label></div>
              <Button className="w-full" onClick={save} disabled={!form.title}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Duration</TableHead>
              <TableHead className="hidden sm:table-cell">Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.title}</TableCell>
                <TableCell className="hidden sm:table-cell">{c.duration || "—"}</TableCell>
                <TableCell className="hidden sm:table-cell">{c.fee ? `PKR ${c.fee.toLocaleString()}` : "—"}</TableCell>
                <TableCell><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{c.published ? "Published" : "Draft"}</span></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No courses found.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminCourses;
