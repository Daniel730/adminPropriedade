import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import {
  Building2,
  Wrench,
  Users,
  Shield,
  Zap,
  BarChart3,
  ArrowRight,
  Check,
  Star,
  ChevronRight,
  ClipboardList,
  Bell,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PropFlow | Professional Property Management Made Simple",
  description: "PropFlow helps property managers, tenants, and vendors collaborate seamlessly. Streamline maintenance, billing, and communication in one powerful dashboard.",
  openGraph: {
    title: "PropFlow | Property Management Simplified",
    description: "The complete platform for property managers, tenants, and vendors.",
    type: "website",
  },
};


const stats = [
  { value: "10k+", label: "Properties managed" },
  { value: "98%", label: "Tenant satisfaction" },
  { value: "4h", label: "Avg. issue resolution" },
  { value: "99.9%", label: "Platform uptime" },
];

const features = [
  {
    icon: Building2,
    title: "Property Management",
    description:
      "Centralize all your properties in one powerful dashboard with real-time insights and occupancy tracking.",
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description:
      "Track requests from submission to resolution with automated status updates and vendor assignment.",
  },
  {
    icon: Users,
    title: "Vendor Network",
    description:
      "Build your trusted vendor network, compare quotes, and assign jobs with a single click.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with role-based access control and a 99.9% uptime guarantee.",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description:
      "Real-time alerts via email and in-app keep every stakeholder informed at every step.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Make data-driven decisions with comprehensive reporting on costs, performance, and trends.",
  },
];

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Tenant submits a request",
    description:
      "Tenants log maintenance issues from any device in under 60 seconds, with photos attached.",
  },
  {
    icon: Bell,
    step: "02",
    title: "Manager is notified instantly",
    description:
      "You receive an alert, review the request, and assign it to a trusted vendor with one click.",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Track to resolution",
    description:
      "Monitor progress in real time. Close the ticket and collect feedback when the job is done.",
  },
];

const testimonials = [
  {
    quote:
      "PropFlow transformed how we manage our 50+ properties. What used to take hours now takes minutes.",
    author: "Sarah Chen",
    role: "Property Manager, Urban Living Co.",
    rating: 5,
    initials: "SC",
  },
  {
    quote:
      "The maintenance tracking alone saved us countless headaches. Our tenants love the transparency.",
    author: "Michael Roberts",
    role: "Owner, Roberts Properties",
    rating: 5,
    initials: "MR",
  },
  {
    quote:
      "Finally, a property management tool that actually understands what managers need. Highly recommended.",
    author: "Jessica Park",
    role: "Director, Park Management Group",
    rating: 5,
    initials: "JP",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "Up to 5 properties",
      "Basic maintenance tracking",
      "Email notifications",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For growing property managers",
    features: [
      "Unlimited properties",
      "Advanced analytics",
      "Vendor management",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "On-premise option",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <BrandLogo size="sm" />
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a
              href="#testimonials"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="gap-1.5" asChild>
              <Link href="/login">
                Get started <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl -z-0" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now with AI-powered insights
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-balance max-w-4xl mx-auto leading-[1.1]">
            Property management,{" "}
            <span className="text-gradient">simplified.</span>
          </h1>

          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            The complete platform for property managers. Streamline
            maintenance, billing, and tenant communication — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 text-base" asChild>
              <Link href="/login">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 px-8 text-base"
              asChild
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required &middot; 14-day free trial
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl border bg-card shadow-2xl shadow-primary/10 glow-primary overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/50">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-warning/60" />
              <div className="h-3 w-3 rounded-full bg-success/60" />
              <div className="ml-4 flex-1 max-w-xs h-6 rounded-md bg-background/80 border text-xs flex items-center px-3 text-muted-foreground">
                app.propflow.io/dashboard
              </div>
            </div>
            {/* Dashboard preview content */}
            <div className="aspect-[16/9] bg-muted/30 p-6 grid grid-cols-3 gap-4">
              {/* Stat cards */}
              {[
                { label: "Open Requests", value: "12", color: "text-warning" },
                { label: "Properties", value: "48", color: "text-primary" },
                { label: "Resolved This Month", value: "94", color: "text-success" },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-card border rounded-xl p-4 flex flex-col gap-1"
                >
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                  <p className={`text-3xl font-semibold ${card.color}`}>
                    {card.value}
                  </p>
                </div>
              ))}
              {/* Request list placeholder */}
              <div className="col-span-2 bg-card border rounded-xl p-4">
                <p className="text-xs font-medium mb-3">Recent Requests</p>
                <div className="space-y-2">
                  {[
                    { title: "Leaking faucet – Unit 4B", status: "In Progress", color: "text-warning" },
                    { title: "Broken heater – Unit 2A", status: "Open", color: "text-destructive" },
                    { title: "Door lock – Unit 7C", status: "Resolved", color: "text-success" },
                  ].map((req) => (
                    <div
                      key={req.title}
                      className="flex items-center justify-between text-xs py-1.5 border-b last:border-0"
                    >
                      <span className="text-muted-foreground">{req.title}</span>
                      <span className={`font-medium ${req.color}`}>
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Activity placeholder */}
              <div className="bg-card border rounded-xl p-4">
                <p className="text-xs font-medium mb-3">Vendors Active</p>
                <div className="space-y-2">
                  {["Plumbing Co.", "HVAC Pro", "ElectriFix"].map((v) => (
                    <div
                      key={v}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <span className="h-2 w-2 rounded-full bg-success" />
                      {v}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-12 px-4 border-y bg-muted/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-semibold text-gradient">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              From request to resolution in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {steps.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-6 relative">
                  <step.icon className="h-8 w-8 text-primary" />
                  <span className="absolute -top-2 -right-2 text-xs font-bold bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
                    {step.step.slice(-1)}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Everything you need to manage properties
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Powerful features designed for modern property managers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-card border rounded-2xl p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Loved by property managers
            </h2>
            <p className="mt-4 text-muted-foreground">
              See what our customers have to say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card border rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose the plan that fits your needs. Upgrade or cancel anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card border rounded-2xl p-7 flex flex-col relative ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/10"
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-2xl" />
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  </>
                )}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-muted-foreground text-sm">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href="/login">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance">
            Ready to take control of your properties?
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
            Join thousands of property managers who trust PropFlow to run their
            business efficiently.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 h-12 px-8 text-base"
              asChild
            >
              <Link href="/login">
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required &middot; Set up in minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <BrandLogo size="sm" />
            <p className="text-sm text-muted-foreground order-last md:order-none">
              &copy; {new Date().getFullYear()} PropFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
