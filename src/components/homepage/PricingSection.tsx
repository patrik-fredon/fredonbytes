"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../common/Button";
import GlassCard from "../dev-ui/GlassCard";

export default function PricingSection() {
  const t = useTranslations();

  return (
    <section id="pricing" className="py-12 lg:py-14 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="section-animate">
          <GlassCard
            className="px-8 py-16 bg-terminal-darker/80"
            glowColor="normal"
            strongGlow
          >
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 justify-center items-center gap-12">
              <div className="">
                <h2 className="text-3xl text-center md:text-left lg:text-4xl font-extrabold mb-6 leading-tight font-mono text-terminal-light">
                  <span className="text-neon-purple">{`//`}</span>{" "}
                  {t("homepage.pricingSection.title")}
                </h2>
                <p className="text-lg lg:text-xl text-terminal-light/80 leading-relaxed mb-8">
                  {t("homepage.pricingSection.description")}
                </p>

                <Link href="/pricing" className="inline-block">
                  <Button variant="gradient" size="xl" className="font-mono">
                    $ {t("homepage.pricingSection.cta")} --explore
                  </Button>
                </Link>
              </div>
              <div className="text-center relative w-full aspect-video max-w-2xl mx-auto">
                <Image
                  src="https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/general-assets/fredobytes-company-logo.webp"
                  alt="Fredonbytes Company Logo - Premium Benefits and Features"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                  className="object-contain rounded-lg "
                  priority={false}
                />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
