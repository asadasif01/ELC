import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, ArrowRight, Mail } from "lucide-react";

const Register = () => {
  const { toast } = useToast();
  const { signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", cnic: "", password: "", confirmPassword: "" });
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    supabase.from("courses").select("id, title").eq("published", true).order("title").then(({ data }) => setCourses(data ?? []));
  }, []);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, { name: form.name, phone: form.phone || undefined, cnic: form.cnic || undefined });
    setLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      setEmailSent(true);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md px-4 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h1 className="mb-3 text-2xl font-bold text-foreground">Check Your Email</h1>
          <p className="mb-6 text-muted-foreground">
            We've sent a verification link to <strong className="text-foreground">{form.email}</strong>. Click the link in the email to activate your account and log in.
          </p>
          <Link to="/login">
            <Button variant="outline">Go to Login</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md px-4"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Register to access ELC courses</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 card-elevated">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your full name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+92 300 0000000" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnic">CNIC (Optional)</Label>
              <Input id="cnic" placeholder="00000-0000000-0" value={form.cnic} onChange={(e) => update("cnic", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Min 8 characters" required minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Repeat password" required minLength={8} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="mt-6 w-full font-semibold" disabled={loading}>
            {loading ? "Creating Account..." : <>Register <ArrowRight className="ml-1 h-4 w-4" /></>}
          </Button>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Log In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
