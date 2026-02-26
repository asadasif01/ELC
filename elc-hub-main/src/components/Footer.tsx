import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight text-foreground">ELC</span>
              <span className="text-[10px] leading-tight text-muted-foreground">by Gujranwala</span>
            </div>
          </Link>
          <p className="text-sm text-muted-foreground">
            Empowering students with world-class English language education in Gujranwala.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link to="/courses" className="hover:text-primary transition-colors">Courses</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Courses</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courses/culture-communication" className="hover:text-primary transition-colors">Professional Communication</Link></li>
            <li><Link to="/courses/basic-foundation" className="hover:text-primary transition-colors">Basic Foundation (A1)</Link></li>
            <li><Link to="/courses/elementary-skills" className="hover:text-primary transition-colors">Elementary Skills</Link></li>
            <li><Link to="/courses/intermediate-skills" className="hover:text-primary transition-colors">Intermediate Skills (B1)</Link></li>
            <li><Link to="/courses/exam-preparation" className="hover:text-primary transition-colors">Exam Preparation</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-foreground">Contact Info</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>Main Boulevard, Gujranwala, Pakistan</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <span>info@elcgujranwala.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ELC by Gujranwala. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
