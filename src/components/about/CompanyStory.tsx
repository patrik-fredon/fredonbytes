/**
 * CompanyStory Component
 *
 * Displays the emotional, inspiring story about Fredon's developer journey
 * and the "All-in-One digital army" concept.
 *
 * Features:
 * - Dev-themed GlassCard design with terminal aesthetic
 * - 2-column responsive layout (content + mission)
 * - CSS scroll-driven animations (zero JS, better performance)
 * - AAA WCAG accessibility compliance
 * - Responsive typography and spacing
 *
 * @module components/about/CompanyStory
 */

import { getTranslations } from "next-intl/server";

import GlassCard from "@/components/dev-ui/GlassCard";

interface CompanyStoryProps {
  locale: string;
}

export default async function CompanyStory({ locale }: CompanyStoryProps) {
  const t = await getTranslations({
    locale,
    namespace: "aboutPage.companyStory",
  });

  // Get content array from translations
  const contentParagraphs = [
    t("content.0"),
    t("content.1"),
    t("content.2"),
    t("content.3"),
    t("content.4"),
    t("content.5"),
  ];

  return (
    <section
      className="mb-16 sm:mb-20 lg:mb-24"
      aria-labelledby="company-story-title"
      id="company-story"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-0">
        {/* 2-Column Layout: Story Content + Mission Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Story Content - Left Column (2/3 width on desktop) */}
          <div className="lg:col-span-2 animate-fade-in-scale">
            <GlassCard variant="window" glowColor="normal" className="h-full">
              <div className="space-y-4 sm:space-y-5">
                <h2
                  id="company-story-title"
                  className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 text-center leading-tight font-mono animate-fade-in-down"
                >
                  <span className="text-neon-purple">{">> "}</span> {t("title")}
                </h2>
                <div className="text-center border-b border-neon-cyan w-full mx-auto max-w-xl rounded-b-4xl py-2"></div>
                {contentParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm sm:text-base text-slate-300 leading-relaxed font-mono animate-fade-in-up px-2"
                    style={{
                      animationDelay: `${index * 150 + 200}ms`,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Mission Statement - Right Column (1/3 width on desktop) */}
          <div
            className="lg:col-span-1 animate-fade-in-scale"
            style={{ animationDelay: "300ms" }}
          >
            <GlassCard
              variant="card"
              glowColor="normal"
              className="h-full sticky top-24"
            >
              <div className="space-y-6">
                {/* Mission Header */}
                <div className="border-b border-neon-purple/20 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-neon-purple font-mono flex items-center gap-2">
                    <span className="text-neon-purple">$</span> Our Mission
                  </h3>
                </div>

                {/* Mission Content */}
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-mono italic">
                    &ldquo;{t("mission")}&rdquo;
                  </p>

                  {/* Founder Attribution */}
                  <div className="pt-4 border-t border-neon-purple/10">
                    <p className="text-xs sm:text-sm text-neon-cyan font-mono">
                      <span className="text-slate-500">//</span> {t("founder")}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Founder & CEO
                    </p>
                  </div>
                </div>

                {/* Decorative Code Element */}
                <div className="mt-6 p-3 bg-terminal-darker/50 rounded border border-neon-purple/10">
                  <code className="text-xs text-neon-purple font-mono">
                    <span className="text-slate-500">{"{"}</span> status:{" "}
                    <span className="text-neon-cyan">
                      &quot;building_future&quot;
                    </span>{" "}
                    <span className="text-slate-500">{"}"}</span>
                  </code>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
