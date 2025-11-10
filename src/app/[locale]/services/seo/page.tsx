import type { Metadata } from "next";
import ServicePageTemplate, {
  generateServiceMetadata,
} from "@/components/services/ServicePageTemplate";
import { servicesConfig } from "@/config/services";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateServiceMetadata(props.params, servicesConfig.seo);
}

export default async function SEOPage(props: Props) {
  return <ServicePageTemplate params={props.params} config={servicesConfig.seo} />;
}
