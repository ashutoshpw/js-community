import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | JS Community",
  description: "Terms of Service for JS Community platform",
};

export default function TermsOfService() {
  const effectiveDate = "January 1, 2026";
  const version = "1.0.0";

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white px-6 py-12 dark:bg-black sm:px-8">
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Terms of Service
        </h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Version {version} | Effective Date: {effectiveDate}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            1. Introduction and Acceptance
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Welcome to JS Community ("we," "us," or "our"). These Terms of
            Service ("Terms") govern your access to and use of our platform,
            website, and services (collectively, the "Service").
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            By accessing or using the Service, you agree to be bound by these
            Terms. If you do not agree to these Terms, you may not access or use
            the Service. We reserve the right to modify these Terms at any time,
            and we will notify users of any material changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            2. User Accounts and Responsibilities
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.1 Account Creation
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            To access certain features of the Service, you may be required to
            create an account. You agree to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>
              Maintain the security and confidentiality of your password and
              account
            </li>
            <li>
              Accept responsibility for all activities that occur under your
              account
            </li>
            <li>
              Notify us immediately of any unauthorized use of your account
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.2 User Conduct
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You agree not to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Violate any applicable laws, regulations, or third-party rights
            </li>
            <li>
              Post or transmit any content that is unlawful, harmful,
              threatening, abusive, harassing, defamatory, or otherwise
              objectionable
            </li>
            <li>Impersonate any person or entity</li>
            <li>
              Interfere with or disrupt the Service or servers or networks
              connected to the Service
            </li>
            <li>
              Use any automated means to access the Service without our express
              written permission
            </li>
            <li>
              Attempt to gain unauthorized access to any part of the Service
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.3 Age Requirements
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You must be at least 13 years old to use the Service. If you are
            under 18, you represent that you have your parent or guardian's
            permission to use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            3. Platform Usage Terms
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            3.1 License to Use
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Subject to your compliance with these Terms, we grant you a limited,
            non-exclusive, non-transferable, revocable license to access and use
            the Service for your personal, non-commercial use.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            3.2 Prohibited Uses
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You may not use the Service to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Engage in any commercial activities without our prior written
              consent
            </li>
            <li>Distribute viruses, malware, or other harmful computer code</li>
            <li>Scrape, crawl, or index the Service without permission</li>
            <li>Reverse engineer any aspect of the Service</li>
            <li>Circumvent any security or access control measures</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            3.3 Service Availability
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We strive to provide continuous availability of the Service, but we
            do not guarantee that the Service will be uninterrupted or
            error-free. We reserve the right to modify, suspend, or discontinue
            the Service at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            4. Intellectual Property Rights
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.1 Our Intellectual Property
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            The Service and its original content, features, and functionality
            are owned by JS Community and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual
            property laws.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.2 User Content
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You retain all rights to any content you submit, post, or display on
            or through the Service ("User Content"). By submitting User Content,
            you grant us a worldwide, non-exclusive, royalty-free, transferable
            license to use, reproduce, modify, adapt, publish, translate,
            distribute, and display such content in connection with operating
            and providing the Service.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.3 Copyright Infringement
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We respect intellectual property rights and expect users to do the
            same. We will respond to valid notices of copyright infringement and
            may terminate accounts of repeat infringers. If you believe your
            copyright has been infringed, please contact us with detailed
            information.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.4 Trademarks
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            JS Community name and logo are trademarks of JS Community. You may
            not use our trademarks without our prior written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            5. Limitation of Liability
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.1 Disclaimer of Warranties
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
            LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.2 Limitation of Liability
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL
            JS COMMUNITY, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
            PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS,
            DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Your access to or use of or inability to access or use the Service
            </li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>
              Unauthorized access, use, or alteration of your transmissions or
              content
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.3 Indemnification
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You agree to indemnify, defend, and hold harmless JS Community and
            its affiliates, officers, directors, employees, and agents from and
            against any claims, liabilities, damages, losses, and expenses,
            including reasonable attorneys' fees, arising out of or in any way
            connected with your access to or use of the Service or your
            violation of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            6. Dispute Resolution
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.1 Governing Law
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            These Terms shall be governed by and construed in accordance with
            the laws of the jurisdiction in which JS Community operates, without
            regard to its conflict of law provisions.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.2 Dispute Resolution Process
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            In the event of any dispute, claim, or controversy arising out of or
            relating to these Terms or the Service, the parties agree to first
            attempt to resolve the dispute through good faith negotiations.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.3 Arbitration
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If the dispute cannot be resolved through negotiation within thirty
            (30) days, either party may submit the dispute to binding
            arbitration in accordance with the rules of a recognized arbitration
            authority. The arbitration shall be conducted in English, and the
            decision of the arbitrator shall be final and binding.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.4 Class Action Waiver
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You agree that any dispute resolution proceedings will be conducted
            only on an individual basis and not in a class, consolidated, or
            representative action.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            7. Termination
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            7.1 Termination by You
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You may terminate your account at any time by contacting us or using
            the account deletion feature in your account settings. Upon
            termination, your right to use the Service will immediately cease.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            7.2 Termination by Us
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may terminate or suspend your account and access to the Service
            immediately, without prior notice or liability, for any reason,
            including but not limited to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Breach of these Terms</li>
            <li>Violation of applicable laws or regulations</li>
            <li>Fraudulent, abusive, or illegal activity</li>
            <li>At our sole discretion for any other reason</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            7.3 Effect of Termination
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Upon termination, all licenses and rights granted to you under these
            Terms will immediately cease. Sections of these Terms that by their
            nature should survive termination shall survive, including but not
            limited to intellectual property provisions, warranty disclaimers,
            indemnity, and limitations of liability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            8. Privacy and Data Protection
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            8.1 Privacy Policy
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Your use of the Service is also governed by our Privacy Policy,
            which is incorporated into these Terms by reference. Please review
            our Privacy Policy to understand our practices regarding the
            collection, use, and disclosure of your personal information.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            8.2 GDPR Compliance
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            For users in the European Economic Area (EEA), we comply with the
            General Data Protection Regulation (GDPR). You have the right to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Access your personal data</li>
            <li>Rectify inaccurate personal data</li>
            <li>Request erasure of your personal data</li>
            <li>Restrict or object to processing of your personal data</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            8.3 Data Security
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We implement appropriate technical and organizational measures to
            protect your personal data. However, no method of transmission over
            the Internet or electronic storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            8.4 International Data Transfers
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Your information may be transferred to and processed in countries
            other than your country of residence. We ensure that such transfers
            comply with applicable data protection laws and that appropriate
            safeguards are in place.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            9. General Provisions
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            9.1 Entire Agreement
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            These Terms, together with our Privacy Policy, constitute the entire
            agreement between you and JS Community regarding the Service and
            supersede all prior agreements and understandings.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            9.2 Severability
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If any provision of these Terms is found to be unenforceable or
            invalid, that provision will be limited or eliminated to the minimum
            extent necessary, and the remaining provisions will remain in full
            force and effect.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            9.3 Waiver
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            No waiver of any term of these Terms shall be deemed a further or
            continuing waiver of such term or any other term, and our failure to
            assert any right or provision under these Terms shall not constitute
            a waiver of such right or provision.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            9.4 Assignment
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You may not assign or transfer these Terms or your rights hereunder,
            in whole or in part, without our prior written consent. We may
            assign these Terms at any time without notice to you.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            9.5 Force Majeure
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We shall not be liable for any failure or delay in performance under
            these Terms due to circumstances beyond our reasonable control,
            including but not limited to acts of God, war, terrorism, riots,
            embargoes, acts of civil or military authorities, fire, floods,
            accidents, strikes, or shortages of transportation, facilities,
            fuel, energy, labor, or materials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            10. Changes to Terms
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We reserve the right to modify or replace these Terms at any time.
            If a revision is material, we will provide at least 30 days' notice
            prior to any new terms taking effect. What constitutes a material
            change will be determined at our sole discretion.
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            By continuing to access or use the Service after those revisions
            become effective, you agree to be bound by the revised Terms. If you
            do not agree to the new Terms, you must stop using the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            11. Contact Information
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              <strong>JS Community</strong>
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">
              Email: legal@jscommunity.example.com
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Version History
          </h2>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="text-zinc-700 dark:text-zinc-300">
              <strong>Version {version}</strong> - Effective {effectiveDate}
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">
              Initial version of Terms of Service
            </p>
          </div>
        </section>

        <div className="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Last updated: {effectiveDate}
          </p>
        </div>
      </div>
    </div>
  );
}
