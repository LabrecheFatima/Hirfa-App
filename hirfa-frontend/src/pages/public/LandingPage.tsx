import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';

// Motion Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const LandingPage: React.FC = () => {
  const { authenticated, roles } = useAuth();

  // Staff Access Control: Immediate redirect to scanner terminal
  if (authenticated && roles.includes(Role.STAFF)) {
    return <Navigate to="/staff/scanner" replace />;
  }

  const isOrganiser = authenticated && roles.includes(Role.ORGANISER);

  const craftAdvantages = [
    {
      title: 'Baking & Pastry Arts',
      subtitle: 'فن المخبوزات والحلويات',
      category: 'Culinary Mastery',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop',
      description:
        'Master commercial dough ratios, precise oven temperature regulation, artisan bread shaping, and professional cake decoration techniques.',
      benefit: 'Gain practical recipes and industry-standard kitchen workflow skills.',
    },
    {
      title: 'Drawing & Visual Arts',
      subtitle: 'الرسم والفنون التشكيلية',
      category: 'Creative Expression',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop',
      description:
        'Develop fundamental perspective rules, shading mechanics, color blending theory, and ink techniques through hands-on studio practice.',
      benefit: 'Build a solid portfolio with live guidance from master artists.',
    },
    {
      title: 'Tailoring & Sewing',
      subtitle: 'فن الخياطة والتفصيل',
      category: 'Textile Craftsmanship',
      // Verified direct Unsplash image featuring dress mannequin, tailoring atelier & pattern drafting
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
      description:
        'Learn custom pattern drafting, fabric selection, garment fitting, industrial machine operation, and fine embroidery detailing.',
      benefit: 'Create custom-fitted garments from initial sketch to finished piece.',
    },
    {
      title: 'Artisan Business Growth',
      subtitle: 'تسويق وإدارة الحرف',
      category: 'Enterprise Skills',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
      description:
        'Understand raw material costing, product pricing strategies, local workshop distribution, and building a sustainable artisan brand.',
      benefit: 'Turn hand-crafted skills into a profitable local venture.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            className="space-y-6 text-left"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Hands-On Artisanal & Technical Masterclasses</span>
            </div>

            <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
              Master Real Skills with <span className="font-sans font-extrabold text-emerald-600 italic">Hirfa Workshops</span>
            </h1>

            <p className="max-w-xl text-base text-slate-600 sm:text-lg leading-relaxed">
              Join expert-led sessions in traditional crafts, modern technical disciplines, and creative arts. Reserve your seat, obtain digital QR passes, and build practical expertise.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/courses">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-semibold shadow-md">
                    Explore Catalog
                  </Button>
                </motion.div>
              </Link>

              {isOrganiser && (
                <Link to="/organiser/events">
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      variant="outline"
                      className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 px-6 py-3 text-sm font-semibold"
                    >
                      Organiser Dashboard
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="overflow-hidden rounded-3xl bg-slate-200 shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000"
                alt="Artisan Workshop"
                className="h-80 w-full object-cover sm:h-96 lg:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold text-emerald-300">Live Craft Training</p>
                  <p className="text-sm font-semibold">Interactive Practical Workshops</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Craft Advantages Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-3xl bg-emerald-700 p-8 sm:p-12 text-white shadow-xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
        >
          <div className="mx-auto max-w-2xl text-center space-y-3 mb-10">
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-200">Craft Advantages</span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">Why Enroll in Our Courses?</h2>
            <p className="text-sm text-emerald-100">
              Practical guidance designed to turn beginners into confident artisans, bakers, and creators.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {craftAdvantages.map((adv, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="overflow-hidden rounded-2xl bg-emerald-800/80 backdrop-blur-md border border-emerald-500/40 flex flex-col justify-between text-left transition-all shadow-md hover:shadow-xl"
              >
                {/* Header Image with Fallback */}
                <div className="relative h-48 w-full overflow-hidden bg-emerald-950">
                  <img
                    src={adv.image}
                    alt={adv.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      // High-reliability secondary fallback URL
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=800&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-bold z-10">
                    <span className="rounded-lg bg-emerald-950/80 px-2.5 py-1 uppercase tracking-wider text-emerald-200 border border-emerald-500/30 backdrop-blur-md">
                      {adv.category}
                    </span>
                    <span className="rounded-lg bg-emerald-950/80 px-2.5 py-1 text-emerald-100 border border-emerald-500/30 backdrop-blur-md">
                      {adv.subtitle}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-xl text-white mb-2">{adv.title}</h3>
                    <p className="text-xs text-emerald-100 leading-relaxed mb-4">{adv.description}</p>
                  </div>

                  <div className="pt-4 border-t border-emerald-600/50 flex items-center justify-between text-xs text-emerald-200">
                    <span className="font-medium text-emerald-100">{adv.benefit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonial Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="text-left space-y-6">
            <div className="h-1 w-12 bg-emerald-600 rounded" />
            <blockquote className="text-2xl font-serif font-bold tracking-tight text-slate-900 sm:text-3xl leading-snug">
              "The structured workshops on Hirfa provided direct hands-on guidance. Learning tailoring and baking techniques directly from experienced craftspeople made all the difference."
            </blockquote>
            <div>
              <p className="font-bold text-slate-900">Meriem Amrani</p>
              <p className="text-xs text-slate-500">Craft & Tailoring Workshop Participant</p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
              alt="Craft Instructor"
              className="h-80 w-full rounded-3xl object-cover shadow-xl border border-slate-200 sm:h-96"
            />
          </div>
        </motion.div>
      </section>

      {/* Dynamic Green CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-3xl bg-emerald-600 px-6 py-12 text-center text-white shadow-xl sm:px-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
              Ready to Reserve Your Next Workshop Pass?
            </h2>
            <p className="text-sm text-emerald-100 sm:text-base">
              Browse available craft sessions, select your pass tier, and complete secure checkout via Chargily Pay.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/courses">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="secondary"
                    className="!bg-white !text-emerald-900 hover:!bg-emerald-50 font-extrabold px-6 py-3 text-sm shadow-md border-0"
                  >
                    Browse Available Passes
                  </Button>
                </motion.div>
              </Link>

              {isOrganiser && (
                <Link to="/organiser/events">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      className="border-white !text-white hover:!bg-emerald-700 px-6 py-3 text-sm font-bold"
                    >
                      Manage My Events
                    </Button>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 Hirfa Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};