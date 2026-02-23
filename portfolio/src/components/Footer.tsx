"use client";
import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-black/50 pt-16 pb-8 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon to-transparent opacity-50" />
      
      <div className="container-custom">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="#home" className="text-3xl font-bold text-primary inline-block">
              <span className="text-gradient-accent">MQ</span>
            </Link>
            <p className="text-muted max-w-sm leading-relaxed">
              A passionate software developer focused on building exceptional digital experiences 
              and secure applications.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-white/5 text-muted hover:text-neon hover:bg-white/10 transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-muted hover:text-[#0A66C2] hover:bg-white/10 transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 text-muted hover:text-[#1DA1F2] hover:bg-white/10 transition-all">
                <Twitter size={20} />
              </a>
              <a href="mailto:hello@muhammadquddous.dev" className="p-2 rounded-full bg-white/5 text-muted hover:text-neon-purple hover:bg-white/10 transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#home" className="text-muted hover:text-neon transition-colors">Home</Link></li>
              <li><Link href="#about" className="text-muted hover:text-neon transition-colors">About</Link></li>
              <li><Link href="#skills" className="text-muted hover:text-neon transition-colors">Skills</Link></li>
              <li><Link href="#projects" className="text-muted hover:text-neon transition-colors">Projects</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-primary mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted hover:text-neon transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted hover:text-neon transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm text-center md:text-left">
            &copy; {currentYear} Muhammad Quddous. All rights reserved.
          </p>
          <p className="text-muted text-sm flex items-center gap-1">
            Designed & Built with <span className="text-red-500">❤</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
