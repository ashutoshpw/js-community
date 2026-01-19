import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | JS Community",
  description:
    "Privacy Policy for JS Community platform - GDPR and CCPA compliant",
};

export default function PrivacyPolicy() {
  const effectiveDate = "January 1, 2026";
  const version = "1.0.0";

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white px-6 py-12 dark:bg-black sm:px-8">
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Version {version} | Effective Date: {effectiveDate}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            1. Introduction
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Welcome to JS Community ("we," "us," or "our"). We are committed to
            protecting your privacy and ensuring the security of your personal
            information. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you use our platform,
            website, and services (collectively, the "Service").
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            This Privacy Policy complies with the General Data Protection
            Regulation (GDPR) for users in the European Economic Area (EEA) and
            the California Consumer Privacy Act (CCPA) for California residents.
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            By using the Service, you agree to the collection and use of
            information in accordance with this Privacy Policy. If you do not
            agree with our policies and practices, please do not use our
            Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            2. Information We Collect
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.1 Personal Information You Provide
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We collect information that you voluntarily provide when using our
            Service:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Account Information:</strong> Username, email address,
              password (encrypted), and profile information
            </li>
            <li>
              <strong>Profile Data:</strong> Display name, bio, profile picture,
              location, and other optional profile fields
            </li>
            <li>
              <strong>Content:</strong> Posts, comments, messages, and other
              user-generated content
            </li>
            <li>
              <strong>Communications:</strong> Information you provide when
              contacting us for support or feedback
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.2 Automatically Collected Information
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We automatically collect certain information when you use our
            Service:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Usage Data:</strong> Pages visited, features used,
              timestamps, and interaction patterns
            </li>
            <li>
              <strong>Device Information:</strong> IP address, browser type and
              version, device type, operating system
            </li>
            <li>
              <strong>Log Data:</strong> Server logs, error reports, and
              performance metrics
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> Session
              cookies, preference cookies, and analytics cookies (see Cookie
              Policy below)
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.3 Information from Third Parties
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may receive information from third-party services when you:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Sign in using third-party authentication (e.g., GitHub, Google)
            </li>
            <li>
              Integrate third-party services with your account (with your
              consent)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            3. How We Use Your Information
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We use the collected information for the following purposes:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Service Provision:</strong> To provide, maintain, and
              improve our Service
            </li>
            <li>
              <strong>Account Management:</strong> To create and manage your
              account and authenticate users
            </li>
            <li>
              <strong>Communication:</strong> To send important updates,
              security alerts, and administrative messages
            </li>
            <li>
              <strong>Personalization:</strong> To customize your experience and
              provide relevant content
            </li>
            <li>
              <strong>Analytics:</strong> To understand how users interact with
              our Service and improve functionality
            </li>
            <li>
              <strong>Security:</strong> To detect, prevent, and address fraud,
              abuse, and security issues
            </li>
            <li>
              <strong>Legal Compliance:</strong> To comply with legal
              obligations and enforce our Terms of Service
            </li>
            <li>
              <strong>Marketing:</strong> To send promotional materials (only
              with your consent, and you may opt out at any time)
            </li>
          </ul>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            <strong>Legal Basis for Processing (GDPR):</strong> We process your
            personal data based on:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Your consent (which you may withdraw at any time)</li>
            <li>
              Performance of a contract (providing the Service you requested)
            </li>
            <li>
              Legitimate interests (improving our Service, security, analytics)
            </li>
            <li>Legal obligations (compliance with laws and regulations)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            4. Data Storage and Security
          </h2>
          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.1 Data Storage
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Your information is stored on secure servers located in data centers
            that comply with industry-standard security practices. We use
            encryption for data in transit (HTTPS/TLS) and at rest where
            appropriate.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.2 Security Measures
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We implement appropriate technical and organizational measures to
            protect your personal information:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Encryption of sensitive data (passwords are hashed and salted)
            </li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Secure data backup and recovery procedures</li>
            <li>Employee training on data protection and security</li>
          </ul>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            However, no method of transmission over the Internet or electronic
            storage is 100% secure. While we strive to protect your personal
            information, we cannot guarantee its absolute security.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.3 International Data Transfers
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Your information may be transferred to and processed in countries
            other than your country of residence. We ensure that such transfers
            comply with applicable data protection laws and implement
            appropriate safeguards, such as Standard Contractual Clauses
            approved by the European Commission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            5. Cookie Policy
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We use cookies and similar tracking technologies to enhance your
            experience on our Service. Cookies are small data files stored on
            your device.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.1 Types of Cookies We Use
          </h3>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Essential Cookies:</strong> Required for the Service to
              function (session management, authentication)
            </li>
            <li>
              <strong>Preference Cookies:</strong> Remember your settings and
              preferences (theme, language)
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how you use
              our Service (anonymized usage statistics)
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant
              advertisements (only with your consent)
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.2 Cookie Management
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You can control cookies through:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Our cookie consent banner (displayed on your first visit or when
              settings change)
            </li>
            <li>Your browser settings (to block or delete cookies)</li>
            <li>
              Your account preferences (to manage analytics and marketing
              cookies)
            </li>
          </ul>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Note that disabling essential cookies may affect the functionality
            of our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            6. Data Sharing and Disclosure
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.1 With Your Consent
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may share your information when you explicitly consent to such
            sharing (e.g., when you integrate third-party services).
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.2 Service Providers
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may share your information with third-party service providers who
            perform services on our behalf:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Cloud hosting providers (e.g., AWS, Vercel)</li>
            <li>Analytics services (e.g., Google Analytics, Plausible)</li>
            <li>Email service providers</li>
            <li>Payment processors (if applicable)</li>
            <li>Customer support tools</li>
          </ul>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            These providers are contractually obligated to protect your data and
            use it only for the purposes we specify.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.3 Legal Requirements
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may disclose your information if required by law or in response
            to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Valid legal processes (subpoenas, court orders)</li>
            <li>Government or regulatory requests</li>
            <li>
              Protection of our rights, property, or safety, or that of our
              users
            </li>
            <li>Detection and prevention of fraud or security issues</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.4 Business Transfers
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If we are involved in a merger, acquisition, or sale of assets, your
            information may be transferred as part of that transaction. We will
            notify you of any such change in ownership or control.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            6.5 Public Information
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Information you choose to make public on your profile or in posts is
            accessible to other users and may be indexed by search engines.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            7. Your Privacy Rights
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You have certain rights regarding your personal information. These
            rights may vary depending on your location.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            7.1 GDPR Rights (EEA Users)
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If you are located in the European Economic Area, you have the
            following rights:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Right to Access:</strong> Request a copy of your personal
              data we hold
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of
              inaccurate or incomplete data
            </li>
            <li>
              <strong>Right to Erasure:</strong> Request deletion of your
              personal data ("right to be forgotten")
            </li>
            <li>
              <strong>Right to Restriction:</strong> Request restriction of
              processing under certain circumstances
            </li>
            <li>
              <strong>Right to Object:</strong> Object to processing of your
              data for specific purposes
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Receive your data in a
              structured, machine-readable format
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Withdraw consent at
              any time (where processing is based on consent)
            </li>
            <li>
              <strong>Right to Lodge a Complaint:</strong> File a complaint with
              your local data protection authority
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            7.2 CCPA Rights (California Residents)
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If you are a California resident, you have the following rights:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Right to Know:</strong> Request information about the
              personal information we collect, use, and disclose
            </li>
            <li>
              <strong>Right to Delete:</strong> Request deletion of your
              personal information
            </li>
            <li>
              <strong>Right to Opt-Out:</strong> Opt-out of the sale of your
              personal information (we do not sell personal information)
            </li>
            <li>
              <strong>Right to Non-Discrimination:</strong> You will not be
              discriminated against for exercising your privacy rights
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            7.3 How to Exercise Your Rights
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            To exercise any of these rights, please:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Contact us at privacy@jscommunity.example.com with your request
            </li>
            <li>Use the data management tools in your account settings</li>
            <li>
              Submit a request through our privacy request form (if available)
            </li>
          </ul>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We will respond to your request within 30 days (or as required by
            applicable law). We may need to verify your identity before
            processing your request.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            8. Data Retention
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We retain your personal information for as long as necessary to
            provide our Service and fulfill the purposes outlined in this
            Privacy Policy, unless a longer retention period is required or
            permitted by law.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            8.1 Retention Periods
          </h3>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Active Accounts:</strong> Data is retained while your
              account is active
            </li>
            <li>
              <strong>Deleted Accounts:</strong> Most data is deleted within 30
              days of account deletion
            </li>
            <li>
              <strong>Backup Data:</strong> May be retained for up to 90 days in
              backup systems
            </li>
            <li>
              <strong>Legal Requirements:</strong> Some data may be retained
              longer to comply with legal obligations (e.g., financial records,
              security logs)
            </li>
            <li>
              <strong>Anonymized Data:</strong> Aggregated, anonymized analytics
              data may be retained indefinitely
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            8.2 Criteria for Retention
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We determine retention periods based on:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>The nature and sensitivity of the data</li>
            <li>The purposes for which we process the data</li>
            <li>Legal, regulatory, or contractual obligations</li>
            <li>
              The potential risk of harm from unauthorized use or disclosure
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            9. Third-Party Services
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Our Service may contain links to third-party websites, services, or
            applications that are not operated by us. We are not responsible for
            the privacy practices of these third parties.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            9.1 Third-Party Services We Use
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may use the following categories of third-party services:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Analytics:</strong> To understand how users interact with
              our Service (e.g., Google Analytics with IP anonymization)
            </li>
            <li>
              <strong>Hosting:</strong> Cloud infrastructure providers (e.g.,
              Vercel, AWS)
            </li>
            <li>
              <strong>Authentication:</strong> OAuth providers (e.g., GitHub,
              Google)
            </li>
            <li>
              <strong>Communication:</strong> Email delivery services
            </li>
            <li>
              <strong>Content Delivery:</strong> CDN providers for faster
              content delivery
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            9.2 Your Responsibility
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We encourage you to read the privacy policies of any third-party
            services you access through our Service. We are not responsible for
            the data practices of these third parties.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            10. Children's Privacy
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Our Service is not intended for children under the age of 13. We do
            not knowingly collect personal information from children under 13.
            If you are a parent or guardian and believe your child has provided
            us with personal information, please contact us at
            privacy@jscommunity.example.com.
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If we become aware that we have collected personal information from
            a child under 13 without parental consent, we will take steps to
            delete that information from our servers.
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Users between 13 and 18 years of age should have parental or
            guardian permission before using our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            11. Changes to This Privacy Policy
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices, technology, legal requirements, or other
            factors.
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            When we make material changes to this Privacy Policy, we will:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Update the "Effective Date" at the top of this policy</li>
            <li>
              Notify you via email or through a prominent notice on our Service
            </li>
            <li>
              Provide at least 30 days' notice before the changes take effect
            </li>
          </ul>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We encourage you to review this Privacy Policy periodically. Your
            continued use of the Service after changes are made constitutes your
            acceptance of the updated Privacy Policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            12. Contact Information
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If you have any questions, concerns, or requests regarding this
            Privacy Policy or our data practices, please contact us:
          </p>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              <strong>JS Community</strong>
            </p>
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              Privacy Team
            </p>
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              Email: privacy@jscommunity.example.com
            </p>
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              General Inquiries: legal@jscommunity.example.com
            </p>
          </div>
          <p className="mb-4 mt-4 text-zinc-700 dark:text-zinc-300">
            <strong>Data Protection Officer (DPO):</strong> For GDPR-related
            inquiries, you can contact our Data Protection Officer at
            dpo@jscommunity.example.com.
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            <strong>EU Representative:</strong> If you are in the European Union
            and have questions about our data practices, you may contact our EU
            representative (contact information will be provided when
            applicable).
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We aim to respond to all privacy inquiries within 30 days.
          </p>
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
              Initial version of Privacy Policy
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
