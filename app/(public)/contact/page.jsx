"use client";

import React, { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    setRedirectUrl(window.location.href);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    try {
      const response = await fetch("https://formsubmit.co/ajax/ashrafulasif260@gmail.com", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        e.target.reset(); // Clear the form
      } else {
        toast.error("Failed to send message. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white font-sans overflow-x-hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-40 md:-mt-32 pt-40 pb-0">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-4 md:px-16 max-w-7xl mx-auto mb-12 md:mb-32">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="font-heading text-5xl md:text-[6rem] lg:text-[8rem] font-bold leading-[0.85] tracking-tight uppercase text-white mb-6">
            Get In <br/> <span className="text-[#CCFF00]">Touch.</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-[#A1A1AA] font-light max-w-2xl leading-relaxed">
            Have a question, need support, or want to partner with Nexus? We are here to help you create unforgettable experiences.
          </p>
        </div>
      </section>

      {/* 2. CONTACT FORM & INFO SECTION */}
      <section className="py-12 md:py-24 bg-white text-black border-y border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6 md:mb-8">
                Reach Out
              </h2>
              <p className="text-gray-600 font-medium text-base md:text-lg mb-8 md:mb-12 max-w-md">
                Fill out the form to send an email directly to our team. We typically respond within 24 hours.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0A0A0A] text-white p-4 rounded-xl">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold mb-1">Email</h3>
                    <p className="text-gray-600">ashrafulasif260@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#0A0A0A] text-white p-4 rounded-xl">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold mb-1">Headquarters</h3>
                    <p className="text-gray-600">Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#0A0A0A] text-white p-4 rounded-xl">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-bold mb-1">Support</h3>
                    <p className="text-gray-600">Available 24/7 for Enterprise Partners</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form using FormSubmit.co to send directly to email without backend setup */}
            <div className="bg-[#0A0A0A] text-white p-6 md:p-12 rounded-2xl md:rounded-3xl shadow-2xl">
              <form 
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Security/Config Fields for Formsubmit */}
                <input type="hidden" name="_captcha" value="true" />
                <input type="hidden" name="_subject" value="New Contact Request from Nexus" />
                {/* To redirect back to contact page after submission */}
                <input type="hidden" name="_next" value={redirectUrl} />

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80 font-medium">Name</Label>
                  <Input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Your name"
                    className="bg-[#27272A] border-none text-white focus-visible:ring-[#CCFF00] h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80 font-medium">Email</Label>
                  <Input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="your@email.com"
                    className="bg-[#27272A] border-none text-white focus-visible:ring-[#CCFF00] h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white/80 font-medium">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    required 
                    placeholder="How can we help?"
                    rows={5}
                    className="bg-[#27272A] border-none text-white focus-visible:ring-[#CCFF00] rounded-xl resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#CCFF00] hover:bg-[#CCFF00]/80 text-[#0A0A0A] font-heading font-bold text-lg uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
