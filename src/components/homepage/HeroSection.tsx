import DesktopClient from "./hero/DesktopHeroSection";
import MobileClient from "./hero/MobileHeroSection";


export default function HeroSection() {

  return (
    <>
      <section className="relative min-h-screen hidden xl:flex items-center justify-center overflow-hidden py-20">
        <DesktopClient />
      </section>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden xl:hidden" >
        <MobileClient />
      </section>
    </>
  );
}
