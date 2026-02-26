import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, BookOpen, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseOption { id: string; title: string; }
interface ContentItem { id: string; course_id: string; title: string; content: string; sort_order: number; created_at: string; }

const emptyContent = { title: "", content: "", sort_order: 1 };

const AdminCourseContent = () => {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState(emptyContent);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const loadCourses = async () => {
    const { data } = await supabase.from("courses").select("id, title").order("title");
    setCourses(data ?? []);
    setLoading(false);
  };

  const loadContent = async (courseId: string) => {
    const { data } = await supabase.from("course_content").select("*").eq("course_id", courseId).order("sort_order");
    setContentItems(data ?? []);
  };

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) loadContent(selectedCourse); }, [selectedCourse]);

  const openNew = () => {
    setEditing(null);
    const nextOrder = contentItems.length > 0 ? Math.max(...contentItems.map(c => c.sort_order)) + 1 : 1;
    setForm({ ...emptyContent, sort_order: nextOrder });
    setOpen(true);
  };
  const openEdit = (c: ContentItem) => {
    setEditing(c);
    setForm({ title: c.title, content: c.content, sort_order: c.sort_order });
    setOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${selectedCourse}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("course-images").upload(filePath, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("course-images").getPublicUrl(filePath);
    const imageTag = `\n[IMAGE: ${urlData.publicUrl}]\n`;
    setForm((prev) => ({ ...prev, content: prev.content + imageTag }));
    toast({ title: "Image uploaded", description: "Image tag added to content." });
    setUploading(false);
  };

  const save = async () => {
    if (form.sort_order < 1) {
      toast({ title: "Invalid order", description: "Sort order must be 1 or greater.", variant: "destructive" });
      return;
    }
    const payload = { course_id: selectedCourse, title: form.title, content: form.content, sort_order: form.sort_order };
    if (editing) {
      const { error } = await supabase.from("course_content").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Content updated" });
    } else {
      const { error } = await supabase.from("course_content").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Content added" });
    }
    setOpen(false);
    loadContent(selectedCourse);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this content?")) return;
    await supabase.from("course_content").delete().eq("id", id);
    toast({ title: "Content deleted" });
    loadContent(selectedCourse);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" /> Course Content</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select a course" /></SelectTrigger>
            <SelectContent>
              {courses.map((c) => (<SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>))}
            </SelectContent>
          </Select>
          {selectedCourse && (<Button size="sm" onClick={openNew}><Plus className="mr-1 h-4 w-4" />Add Lesson</Button>)}
        </div>
      </CardHeader>
      <CardContent>
        {!selectedCourse ? (
          <p className="py-8 text-center text-muted-foreground">Select a course to manage its content.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Preview</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentItems.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.sort_order}</TableCell>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="hidden max-w-xs truncate sm:table-cell text-muted-foreground text-sm">
                    {c.content.substring(0, 80)}…
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {contentItems.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No content yet. Add lessons for this course.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader><DialogTitle>{editing ? "Edit Lesson" : "Add Lesson"}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Lesson Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div>
                <Label>Sort Order (min 1)</Label>
                <Input type="number" min={1} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Math.max(1, parseInt(e.target.value) || 1) })} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Content</Label>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    <Button type="button" variant="outline" size="sm" className="pointer-events-none" disabled={uploading}>
                      {uploading ? <><Upload className="mr-1 h-3 w-3 animate-spin" /> Uploading...</> : <><ImageIcon className="mr-1 h-3 w-3" /> Add Image</>}
                    </Button>
                  </label>
                </div>
                <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={12} placeholder="Write the lesson content here. Use the Add Image button to insert images." />
                <p className="mt-1 text-xs text-muted-foreground">Images are embedded as [IMAGE: url] tags and displayed to students automatically.</p>
              </div>
              <Button className="w-full" onClick={save} disabled={!form.title}>{editing ? "Update" : "Create"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminCourseContent;
