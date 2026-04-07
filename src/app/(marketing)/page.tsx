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
  Star
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Building2,
    title: "Property Management",
    description: "Centralize all your properties in one powerful dashboard with real-time insights."
  },
  {
    icon: Wrench,
    title: "Maintenance Tracking",
    description: "Track requests from submission to resolution with automated status updates."
  },
  {
    icon: Users,
    title: "Vendor Network",
    description: "Build your trusted vendor network and assign jobs with a single click."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security with 99.9% uptime guarantee."
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description: "Real-time alerts keep everyone informed at every step."
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Make data-driven decisions with comprehensive reporting tools."
  }
];

const testimonials = [
  {
    quote: "PropFlow has transformed how we manage our 50+ properties. What used to take hours now takes minutes.",
    author: "Sarah Chen",
    role: "Property Manager, Urban Living Co.",
    rating: 5
  },
  {
    quote: "The maintenance tracking alone has saved us countless headaches. Our tenants love the transparency.",
    author: "Michael Roberts",
    role: "Owner, Roberts Properties",
    rating: 5
  },
  {
    quote: "Finally, a property management tool that actually understands what managers need. Highly recommended.",
    author: "Jessica Park",
    role: "Director, Park Management Group",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: ["Up to 5 properties", "Basic maintenance tracking", "Email notifications", "Community support"],
    cta: "Get Started",
    highlighted: false
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For growing property managers",
    features: ["Unlimited properties", "Advanced analytics", "Vendor management", "Priority support", "Custom branding", "API access"],
    cta: "Start Free Trial",
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Everything in Professional", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option", "Training & onboarding"],
    cta: "Contact Sales",
    highlighted: false
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <BrandLogo size="sm" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Now with AI-powered insights
          </div>
          
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-balance max-w-4xl mx-auto">
            Property management,{" "}
            <span className="text-gradient">simplified.</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            The complete platform for property managers. Streamline maintenance, billing, and tenant communication in one powerful dashboard.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/login">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="#features">See how it works</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. 14-day free trial.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-xl border bg-card shadow-2xl shadow-primary/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
            <div className="aspect-[16/9] bg-muted flex items-center justify-center">
              <div className="text-center p-8">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight">
              Everything you need to manage properties
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern property managers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="bg-card border rounded-xl p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight">
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
                className="bg-card border rounded-xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose the plan that fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`bg-card border rounded-xl p-6 flex flex-col ${
                  plan.highlighted 
                    ? "border-primary shadow-lg shadow-primary/10 relative" 
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-semibold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
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
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready to streamline your property management?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join thousands of property managers who trust PropFlow to run their business.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
              <Link href="/login">
                Get started for free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <BrandLogo size="sm" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PropFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
