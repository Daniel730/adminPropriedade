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
  Play
} from "lucide-react";
import Link from "next/link";

const stats = [
  { value: "10,000+", label: "Properties Managed", company: "Top Firms" },
  { value: "98%", label: "Faster Response", company: "Industry Average" },
  { value: "50%", label: "Cost Reduction", company: "Our Clients" },
  { value: "4.9/5", label: "Customer Rating", company: "Verified Reviews" },
];

const features = [
  {
    icon: Building2,
    title: "Property Dashboard",
    description: "Centralize all your properties in one powerful dashboard with real-time occupancy tracking and insights."
  },
  {
    icon: Wrench,
    title: "Maintenance Automation",
    description: "AI-powered maintenance tracking from submission to resolution with automated vendor assignment."
  },
  {
    icon: Users,
    title: "Vendor Network",
    description: "Build and manage your trusted vendor network. Assign jobs and track performance effortlessly."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and 99.9% uptime SLA. Your data is always safe and accessible."
  },
  {
    icon: Zap,
    title: "Real-time Notifications",
    description: "Instant alerts keep everyone informed. Never miss a critical update or deadline."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Make data-driven decisions with comprehensive reporting and predictive insights."
  }
];

const testimonials = [
  {
    quote: "PropFlow has transformed how we manage our 50+ properties. What used to take hours now takes minutes. The automation is incredible.",
    author: "Sarah Chen",
    role: "Property Manager",
    company: "Urban Living Co.",
    rating: 5
  },
  {
    quote: "The maintenance tracking alone has saved us countless headaches. Our tenants love the transparency and quick response times.",
    author: "Michael Roberts",
    role: "Portfolio Owner",
    company: "Roberts Properties",
    rating: 5
  },
  {
    quote: "Finally, a property management tool that actually understands what managers need. The ROI was visible within the first month.",
    author: "Jessica Park",
    role: "Director of Operations",
    company: "Park Management Group",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    features: ["Up to 5 properties", "Basic maintenance tracking", "Email notifications", "Community support"],
    cta: "Get Started Free",
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement Banner */}
      <div className="bg-foreground text-background py-2.5 text-center text-sm">
        <span className="opacity-80">New: AI-powered maintenance predictions are here.</span>
        <Link href="/login" className="ml-2 font-medium underline underline-offset-4 hover:opacity-80">
          Learn more <ChevronRight className="inline h-3 w-3" />
        </Link>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <BrandLogo size="sm" />
              <nav className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Customers
                </Link>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" className="rounded-full px-4" asChild>
                <Link href="/login">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                <span className="text-muted-foreground">Trusted by 500+ property managers</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-balance leading-[1.1]">
                The complete platform for{" "}
                <span className="text-primary">property management</span>
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground max-w-xl text-pretty leading-relaxed">
                Streamline maintenance, automate billing, and delight your tenants. Everything you need to manage properties efficiently in one powerful dashboard.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full px-6 gap-2" asChild>
                  <Link href="/login">
                    Get started — it&apos;s free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-6 gap-2" asChild>
                  <Link href="#demo">
                    <Play className="h-4 w-4" />
                    Watch demo
                  </Link>
                </Button>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                No credit card required. Free 14-day trial.
              </p>
            </div>

            {/* Right Column - Hero Visual */}
            <div className="relative lg:ml-8">
              <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
                <div className="bg-muted/30 p-1">
                  <div className="flex gap-1.5 px-3 py-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  </div>
                </div>
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-background to-primary/10 p-6">
                  <div className="h-full rounded-lg border bg-card/50 backdrop-blur flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Dashboard Preview</p>
                        <p className="text-sm text-muted-foreground">Manage all properties at a glance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating stats card */}
              <div className="absolute -bottom-4 -left-4 rounded-xl border bg-card p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Request Resolved</p>
                    <p className="text-xs text-muted-foreground">Unit 4B - Plumbing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border">
            {stats.map((stat, index) => (
              <div key={index} className="py-8 lg:py-12 px-4 lg:px-8 text-center lg:text-left">
                <p className="text-2xl lg:text-3xl font-semibold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-3">Features</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-balance">
              Everything you need to manage properties efficiently
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Powerful tools designed by property managers, for property managers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="group relative rounded-2xl border bg-card p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-3">How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              Get started in minutes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create your account", description: "Sign up for free and set up your organization in under 5 minutes." },
              { step: "02", title: "Add your properties", description: "Import properties and invite your team, tenants, and vendors." },
              { step: "03", title: "Start managing", description: "Track maintenance, collect rent, and run reports from one dashboard." }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-muted-foreground/20 mb-4">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-3">Testimonials</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              Loved by property managers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="rounded-2xl border bg-card p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">{testimonial.author.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium text-primary mb-3">Pricing</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your portfolio size.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`rounded-2xl border bg-card p-6 flex flex-col ${
                  plan.highlighted 
                    ? "border-primary shadow-lg shadow-primary/10 relative scale-105" 
                    : ""
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline">
                    <span className="text-4xl font-semibold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.highlighted ? "default" : "outline"} 
                  className="w-full rounded-full"
                  asChild
                >
                  <Link href="/login">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-foreground text-background overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10" />
            <div className="relative px-8 py-16 lg:px-16 lg:py-24 text-center">
              <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight max-w-2xl mx-auto text-balance">
                Ready to streamline your property management?
              </h2>
              <p className="mt-4 text-lg opacity-80 max-w-xl mx-auto">
                Join thousands of property managers who trust PropFlow to run their business.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" variant="secondary" className="rounded-full px-6 gap-2" asChild>
                  <Link href="/login">
                    Get started for free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="rounded-full px-6 text-background hover:text-background hover:bg-background/10" asChild>
                  <Link href="#pricing">View pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <BrandLogo size="sm" />
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Modern property management software for today&apos;s professionals.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} PropFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
