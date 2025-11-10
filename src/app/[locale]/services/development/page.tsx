import type { Metadata } from "next";
import ServicePageTemplate, {
  generateServiceMetadata,
} from "@/components/services/ServicePageTemplate";
import { servicesConfig } from "@/config/services";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateServiceMetadata(props.params, servicesConfig.development);
}

export default async function DevelopmentPage(props: Props) {
  return <ServicePageTemplate params={props.params} config={servicesConfig.development} />;
}
