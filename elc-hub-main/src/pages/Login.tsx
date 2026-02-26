import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, ArrowRight } from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (forgotMode) {
      const { error } = await resetPassword(email);
      setLoading(false);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email", description: "Password reset link has been sent." });
        setForgotMode(false);
      }
      return;
    }

    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You've logged in successfully." });
      navigate("/dashboard");
    }
  };

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
          <h1 className="text-2xl font-bold text-foreground">
            {forgotMode ? "Reset Password" : "Welcome Back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {forgotMode ? "Enter your email to receive a reset link" : "Log in to your ELC account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 card-elevated">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {!forgotMode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button type="button" onClick={() => setForgotMode(true)} className="text-xs text-primary hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}
          </div>
          <Button type="submit" className="mt-6 w-full font-semibold" disabled={loading}>
            {loading ? (forgotMode ? "Sending..." : "Logging in...") : forgotMode ? "Send Reset Link" : <>Log In <ArrowRight className="ml-1 h-4 w-4" /></>}
          </Button>
          {forgotMode ? (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <button type="button" onClick={() => setForgotMode(false)} className="font-medium text-primary hover:underline">Back to login</button>
            </p>
          ) : (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">Register</Link>
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
