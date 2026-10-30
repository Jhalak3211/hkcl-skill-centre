import { ArrowUpRight } from 'lucide-react';
import Container from './Container.jsx';
import SectionHeading from './SectionHeading.jsx';
import { FadeIn, FadeInStagger, FadeInItem } from './MotionReveal.jsx';
import { siteConfig } from '../data/siteConfig.js';
import {
  FacebookIcon,
  InstagramIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from './SocialIcons.jsx';

export default function SocialSection() {
  const { social } = siteConfig;

  const channels = [
    {
      id: 'instagram',
      name: 'Instagram',
      handle: '@hkclachariyainstitution',
      href: social.instagram,
      cta: 'Follow on Instagram',
      icon: InstagramIcon,
      cardHover: 'hover:border-[#DD2A7B]/40 active:border-[#DD2A7B]/40 hover:shadow-xl active:shadow-xl hover:shadow-[#DD2A7B]/10 active:shadow-[#DD2A7B]/10',
      iconColor: 'text-[#DD2A7B] sm:text-slate-700',
      iconBg: 'bg-pink-50 sm:bg-slate-100',
      iconHover: 'group-hover:bg-gradient-to-tr group-hover:from-[#F58529] group-hover:via-[#DD2A7B] group-hover:to-[#8134AF] group-hover:text-white group-active:bg-gradient-to-tr group-active:from-[#F58529] group-active:via-[#DD2A7B] group-active:to-[#8134AF] group-active:text-white group-hover:shadow-md group-hover:shadow-pink-500/20',
      handleHover: 'group-hover:text-[#DD2A7B] group-active:text-[#DD2A7B]',
      btnHover: 'group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#833AB4] group-hover:via-[#FD1D1D] group-hover:to-[#F77737] group-hover:text-white group-active:border-transparent group-active:bg-gradient-to-r group-active:from-[#833AB4] group-active:via-[#FD1D1D] group-active:to-[#F77737] group-active:text-white group-hover:shadow-md',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'HKCL Skill Centre Achariya',
      href: social.facebook,
      cta: 'Follow on Facebook',
      icon: FacebookIcon,
      cardHover: 'hover:border-[#1877F2]/40 active:border-[#1877F2]/40 hover:shadow-xl active:shadow-xl hover:shadow-[#1877F2]/10 active:shadow-[#1877F2]/10',
      iconColor: 'text-[#1877F2] sm:text-slate-700',
      iconBg: 'bg-blue-50 sm:bg-slate-100',
      iconHover: 'group-hover:bg-[#1877F2] group-hover:text-white group-active:bg-[#1877F2] group-active:text-white group-hover:shadow-md group-hover:shadow-blue-500/20',
      handleHover: 'group-hover:text-[#1877F2] group-active:text-[#1877F2]',
      btnHover: 'group-hover:border-transparent group-hover:bg-[#1877F2] group-hover:text-white group-active:border-transparent group-active:bg-[#1877F2] group-active:text-white group-hover:shadow-md',
    },
    {
      id: 'whatsapp-channel',
      name: 'WhatsApp Channel',
      handle: 'HKCL Official Channel',
      href: social.whatsappChannel,
      cta: 'Join Channel',
      icon: WhatsAppIcon,
      cardHover: 'hover:border-[#25D366]/40 active:border-[#25D366]/40 hover:shadow-xl active:shadow-xl hover:shadow-[#25D366]/10 active:shadow-[#25D366]/10',
      iconColor: 'text-[#25D366] sm:text-slate-700',
      iconBg: 'bg-emerald-50 sm:bg-slate-100',
      iconHover: 'group-hover:bg-[#25D366] group-hover:text-white group-active:bg-[#25D366] group-active:text-white group-hover:shadow-md group-hover:shadow-emerald-500/20',
      handleHover: 'group-hover:text-[#25D366] group-active:text-[#25D366]',
      btnHover: 'group-hover:border-transparent group-hover:bg-[#25D366] group-hover:text-white group-active:border-transparent group-active:bg-[#25D366] group-active:text-white group-hover:shadow-md',
    },
    ...(social.youtube
      ? [
          {
            id: 'youtube',
            name: 'YouTube',
            handle: 'HKCL Skill Centre',
            href: social.youtube,
            cta: 'Subscribe on YouTube',
            icon: YouTubeIcon,
            cardHover: 'hover:border-[#FF0000]/40 active:border-[#FF0000]/40 hover:shadow-xl active:shadow-xl hover:shadow-[#FF0000]/10 active:shadow-[#FF0000]/10',
            iconColor: 'text-[#FF0000] sm:text-slate-700',
            iconBg: 'bg-red-50 sm:bg-slate-100',
            iconHover: 'group-hover:bg-[#FF0000] group-hover:text-white group-active:bg-[#FF0000] group-active:text-white group-hover:shadow-md group-hover:shadow-red-500/20',
            handleHover: 'group-hover:text-[#FF0000] group-active:text-[#FF0000]',
            btnHover: 'group-hover:border-transparent group-hover:bg-[#FF0000] group-hover:text-white group-active:border-transparent group-active:bg-[#FF0000] group-active:text-white group-hover:shadow-md',
          },
        ]
      : []),
  ].filter((c) => c.href);

  if (channels.length === 0) return null;

  return (
    <section
      aria-labelledby="social-heading"
      className="pt-16 sm:pt-20"
    >
      <Container>
        <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            id="social-heading"
            title="Stay Connected With HKCL"
            intro="Follow our official social media channels for real-time announcements, student projects, batch schedules and learning tips."
          />
        </FadeIn>

        <FadeInStagger className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((ch) => {
            const Icon = ch.icon;
            return (
              <FadeInItem key={ch.id}>
                <a
                  href={ch.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex h-full flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] ${ch.cardHover}`}
                >
                  <div>
                    {/* Header: Icon (Visible brand accent on mobile, neutral on desktop until hover/active) & Top Arrow */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`grid h-12 w-12 place-items-center rounded-xl shadow-2xs transition-all duration-300 group-hover:scale-105 ${ch.iconBg} ${ch.iconColor} ${ch.iconHover}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-slate-300 group-hover:text-slate-800">
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Channel name & handle */}
                    <div className="mt-5">
                      <h3 className="font-display text-lg font-bold text-brand-950 transition-colors sm:text-xl">
                        {ch.name}
                      </h3>
                      <p className={`mt-1 text-sm font-medium text-slate-500 transition-colors duration-300 ${ch.handleHover}`}>
                        {ch.handle}
                      </p>
                    </div>
                  </div>

                  {/* CTA button (Visible accent on active, brand colors on hover) */}
                  <div className="mt-6 pt-2">
                    <div
                      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs transition-all duration-300 group-hover:shadow-md ${ch.btnHover}`}
                    >
                      <span>{ch.cta}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                  </div>
                </a>
              </FadeInItem>
            );
          })}
        </FadeInStagger>
      </Container>
    </section>
  );
}
