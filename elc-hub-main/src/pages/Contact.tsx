import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from("contacts").insert({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: "Could not send message. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Message Sent!", description: "We'll get back to you shortly." });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <>
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="mb-3 inline-block rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
              Contact Us
            </span>
            <h1 className="mb-4 text-4xl font-extrabold text-primary-foreground md:text-5xl">
              Get in Touch
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6 lg:col-span-2"
            >
              <div className="rounded-xl border border-border bg-card p-6 card-elevated">
                <h3 className="mb-4 text-lg font-bold text-card-foreground">Contact Information</h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>Main Boulevard, Gujranwala, Punjab, Pakistan</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-5 w-5 shrink-0 text-primary" />
                    <span>+92 300 1234567</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="h-5 w-5 shrink-0 text-primary" />
                    <span>info@elcgujranwala.com</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 card-elevated">
                <h3 className="mb-2 text-lg font-bold text-card-foreground">Office Hours</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Monday – Friday: 9:00 AM – 6:00 PM</li>
                  <li>Saturday: 10:00 AM – 2:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-8 card-elevated">
                <h3 className="mb-6 text-xl font-bold text-card-foreground">Send a Message</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="mt-5 space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" placeholder="How can we help?" required />
                </div>
                <div className="mt-5 space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Your message..." rows={5} required />
                </div>
                <Button type="submit" className="mt-6 w-full font-semibold" disabled={loading}>
                  {loading ? "Sending..." : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
