"use client";

import React from "react";

import { useTranslations } from "@/app/hooks/useTranslations";

export default function TermsOfServicePage() {
  const { t, tArray } = useTranslations();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              {t("termsOfService.title")}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              {t("termsOfService.subtitle")}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              {t("termsOfService.lastUpdated")}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                {t("termsOfService.agreementOverview.title")}
              </h2>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                {t("termsOfService.agreementOverview.description")}
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.acceptanceOfTerms.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.acceptanceOfTerms.content.0")}
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {t("termsOfService.sections.acceptanceOfTerms.content.1")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.servicesDescription.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.servicesDescription.intro")}
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                {tArray(
                  "termsOfService.sections.servicesDescription.services"
                ).map((service: string, index: number) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.userResponsibilities.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.userResponsibilities.intro")}
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
                {tArray(
                  "termsOfService.sections.userResponsibilities.responsibilities"
                ).map((responsibility: string, index: number) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t(
                  "termsOfService.sections.userResponsibilities.prohibitedUses.title"
                )}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t(
                  "termsOfService.sections.userResponsibilities.prohibitedUses.intro"
                )}
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                {tArray(
                  "termsOfService.sections.userResponsibilities.prohibitedUses.prohibitions"
                ).map((prohibition: string, index: number) => (
                  <li key={index}>{prohibition}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.serviceAgreements.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.serviceAgreements.intro")}
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
                {tArray(
                  "termsOfService.sections.serviceAgreements.details"
                ).map((detail: string, index: number) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {t(
                  "termsOfService.sections.serviceAgreements.conflictResolution"
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.paymentTerms.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t(
                  "termsOfService.sections.paymentTerms.pricingAndInvoicing.title"
                )}
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
                {tArray(
                  "termsOfService.sections.paymentTerms.pricingAndInvoicing.terms"
                ).map((term: string, index: number) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t(
                  "termsOfService.sections.paymentTerms.refundsAndCancellations.title"
                )}
              </h3>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                {tArray(
                  "termsOfService.sections.paymentTerms.refundsAndCancellations.terms"
                ).map((term: string, index: number) => (
                  <li key={index}>{term}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.intellectualProperty.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t(
                  "termsOfService.sections.intellectualProperty.ourProperty.title"
                )}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t(
                  "termsOfService.sections.intellectualProperty.ourProperty.description"
                )}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t(
                  "termsOfService.sections.intellectualProperty.clientProperty.title"
                )}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {t(
                  "termsOfService.sections.intellectualProperty.clientProperty.description"
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.confidentiality.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.confidentiality.intro")}
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                {tArray(
                  "termsOfService.sections.confidentiality.commitments"
                ).map((commitment: string, index: number) => (
                  <li key={index}>{commitment}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.disclaimersAndLimitations.title")}
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t(
                  "termsOfService.sections.disclaimersAndLimitations.serviceAvailability.title"
                )}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t(
                  "termsOfService.sections.disclaimersAndLimitations.serviceAvailability.description"
                )}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {t(
                  "termsOfService.sections.disclaimersAndLimitations.limitationOfLiability.title"
                )}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {t(
                  "termsOfService.sections.disclaimersAndLimitations.limitationOfLiability.description"
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.dataProtectionAndPrivacy.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t(
                  "termsOfService.sections.dataProtectionAndPrivacy.content.0"
                )}
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {t(
                  "termsOfService.sections.dataProtectionAndPrivacy.content.1"
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.governingLawAndDisputes.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.governingLawAndDisputes.content.0")}
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {t("termsOfService.sections.governingLawAndDisputes.content.1")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.changesToTerms.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.changesToTerms.content.0")}
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                {t("termsOfService.sections.changesToTerms.content.1")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.termination.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.termination.intro")}
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                {tArray("termsOfService.sections.termination.conditions").map(
                  (condition: string, index: number) => (
                    <li key={index}>{condition}</li>
                  )
                )}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("termsOfService.sections.contactInformation.title")}
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("termsOfService.sections.contactInformation.intro")}
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>
                    {t("termsOfService.sections.contactInformation.company")}
                  </strong>
                  <br />
                  Email:{" "}
                  <a
                    href={`mailto:${t("termsOfService.sections.contactInformation.email")}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("termsOfService.sections.contactInformation.email")}
                  </a>
                  <br />
                  Phone:{" "}
                  <a
                    href={`tel:${t("termsOfService.sections.contactInformation.phone")}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {t("termsOfService.sections.contactInformation.phone")}
                  </a>
                  <br />
                  Address:{" "}
                  {t("termsOfService.sections.contactInformation.address")}
                </p>
              </div>
            </section>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                {t("termsOfService.legalNotice.title")}
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                {t("termsOfService.legalNotice.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
