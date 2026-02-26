import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", cnic: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, phone: profile.phone || "", cnic: profile.cnic || "" });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: form.name, phone: form.phone || null, cnic: form.cnic || null })
      .eq("user_id", user.id);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated", description: "Your profile has been saved successfully." });
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 card-elevated space-y-5">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile?.email || ""} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="+92 300 0000000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnic">CNIC</Label>
            <Input id="cnic" placeholder="00000-0000000-0" value={form.cnic} onChange={(e) => setForm({ ...form, cnic: e.target.value })} />
          </div>
          <Button className="w-full font-semibold" onClick={handleSave} disabled={loading || !form.name}>
            <Save className="mr-2 h-4 w-4" /> {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
