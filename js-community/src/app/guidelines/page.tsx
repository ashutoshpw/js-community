import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Guidelines | JS Community",
  description:
    "Community Guidelines and Code of Conduct for JS Community - Learn about our standards for respectful interaction and content policies",
};

export default function CommunityGuidelines() {
  const effectiveDate = "January 1, 2026";
  const version = "1.0.0";

  return (
    <div className="mx-auto min-h-screen max-w-4xl bg-white px-6 py-12 dark:bg-black sm:px-8">
      <div className="prose prose-zinc max-w-none dark:prose-invert">
        <h1 className="mb-2 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          Community Guidelines
        </h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Version {version} | Effective Date: {effectiveDate}
        </p>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Welcome to JS Community
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            JS Community is built on the principles of respect, collaboration,
            and inclusive learning. These Community Guidelines outline the
            standards we expect all members to uphold. By participating in our
            community, you agree to follow these guidelines and contribute to a
            positive, welcoming environment for all.
          </p>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Our goal is to create a space where JavaScript developers of all
            skill levels can connect, learn, share knowledge, and grow together.
            We believe in fostering an environment that is safe, respectful, and
            supportive for everyone.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            1. Code of Conduct
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Our Code of Conduct sets the foundation for all interactions within
            JS Community. We are committed to providing a harassment-free
            experience for everyone, regardless of age, body size, disability,
            ethnicity, gender identity and expression, level of experience,
            nationality, personal appearance, race, religion, or sexual identity
            and orientation.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            1.1 Expected Behavior
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            All community members are expected to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Be Respectful:</strong> Treat all members with respect and
              kindness. Disagreements are natural, but they should be handled
              professionally and constructively.
            </li>
            <li>
              <strong>Be Inclusive:</strong> Welcome and support people of all
              backgrounds and identities. Use inclusive language and be mindful
              of how your words might affect others.
            </li>
            <li>
              <strong>Be Collaborative:</strong> Work together to help each
              other learn and grow. Share knowledge generously and give credit
              where it's due.
            </li>
            <li>
              <strong>Be Professional:</strong> Maintain professional standards
              in all communications. Remember that this is a public forum and
              your behavior reflects on the entire community.
            </li>
            <li>
              <strong>Be Constructive:</strong> Provide helpful, actionable
              feedback. Focus on the content, not the person, when discussing
              code or ideas.
            </li>
            <li>
              <strong>Be Patient:</strong> Remember that everyone is at a
              different stage in their learning journey. Help beginners without
              condescension.
            </li>
            <li>
              <strong>Assume Good Intent:</strong> Give others the benefit of
              the doubt. If something seems off, ask for clarification before
              making assumptions.
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            1.2 Unacceptable Behavior
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            The following behaviors are strictly prohibited:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Harassment:</strong> Including offensive comments,
              intimidation, stalking, unwanted photography, inappropriate
              physical contact, and unwelcome sexual attention.
            </li>
            <li>
              <strong>Discrimination:</strong> Discriminatory language or
              actions based on personal characteristics, identity, or beliefs.
            </li>
            <li>
              <strong>Hate Speech:</strong> Content that promotes hatred or
              violence against individuals or groups.
            </li>
            <li>
              <strong>Personal Attacks:</strong> Insulting, demeaning, or
              belittling other members, including ad hominem arguments.
            </li>
            <li>
              <strong>Trolling:</strong> Deliberately inflammatory, extraneous,
              or off-topic messages intended to provoke emotional responses or
              disrupt discussions.
            </li>
            <li>
              <strong>Doxxing:</strong> Publishing or threatening to publish
              someone's private information (e.g., physical address, email,
              phone number) without explicit permission.
            </li>
            <li>
              <strong>Impersonation:</strong> Pretending to be another person or
              organization.
            </li>
            <li>
              <strong>Disruption:</strong> Deliberately disrupting discussions,
              events, or activities.
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            1.3 Inclusive Language
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We encourage all members to use inclusive language in their posts
            and communications. This includes:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Using gender-neutral terms when gender is not relevant to the
              discussion
            </li>
            <li>Respecting people's pronouns and chosen names</li>
            <li>
              Avoiding stereotypes, generalizations, and assumptions about
              groups of people
            </li>
            <li>Being mindful of cultural differences and sensitivities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            2. Content Policy
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Our Content Policy defines what types of content are acceptable on
            JS Community and what is prohibited. These policies help maintain a
            high-quality, relevant, and safe environment for all members.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.1 Acceptable Content
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            The following types of content are welcome and encouraged:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Technical Discussions:</strong> Questions, answers, and
              discussions about JavaScript, web development, and related
              technologies
            </li>
            <li>
              <strong>Learning Resources:</strong> Tutorials, articles, videos,
              courses, and other educational content
            </li>
            <li>
              <strong>Project Showcases:</strong> Sharing your projects,
              experiments, or open-source contributions
            </li>
            <li>
              <strong>Career Advice:</strong> Job opportunities, career
              development tips, and professional growth discussions
            </li>
            <li>
              <strong>Community Events:</strong> Announcements about meetups,
              conferences, hackathons, and other community events
            </li>
            <li>
              <strong>Best Practices:</strong> Discussions about code quality,
              architecture patterns, testing strategies, and development
              workflows
            </li>
            <li>
              <strong>News and Updates:</strong> Relevant news about JavaScript
              frameworks, libraries, tools, and the broader web development
              ecosystem
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.2 Prohibited Content
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            The following types of content are not allowed:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Illegal Content:</strong> Content that violates laws,
              including pirated software, cracked tools, or instructions for
              illegal activities
            </li>
            <li>
              <strong>Spam:</strong> Unsolicited advertisements, excessive
              self-promotion, repetitive posts, or irrelevant links
            </li>
            <li>
              <strong>Malicious Code:</strong> Malware, viruses, exploits, or
              code intended to harm users or systems
            </li>
            <li>
              <strong>Explicit Content:</strong> Pornography, graphic violence,
              or other NSFW (Not Safe For Work) material
            </li>
            <li>
              <strong>Misinformation:</strong> Deliberately false or misleading
              information, especially regarding security, health, or safety
            </li>
            <li>
              <strong>Plagiarism:</strong> Presenting others' work as your own
              without proper attribution
            </li>
            <li>
              <strong>Off-Topic Content:</strong> Content that is completely
              unrelated to JavaScript, web development, or technology in general
            </li>
            <li>
              <strong>Excessive Self-Promotion:</strong> Repeatedly promoting
              your own products, services, or content without contributing to
              the community
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.3 Content Quality Standards
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            To maintain a high-quality community, we ask that you:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Use Clear Titles:</strong> Write descriptive titles that
              accurately reflect the content of your post
            </li>
            <li>
              <strong>Format Your Posts:</strong> Use proper formatting,
              including code blocks for code snippets, headers for organization,
              and lists for clarity
            </li>
            <li>
              <strong>Provide Context:</strong> Include relevant details,
              versions, error messages, and what you've already tried when
              asking questions
            </li>
            <li>
              <strong>Use Appropriate Tags:</strong> Tag your posts with
              relevant topics to help others find and filter content
            </li>
            <li>
              <strong>Cite Sources:</strong> Provide links and attribution when
              sharing others' content or ideas
            </li>
            <li>
              <strong>Update Your Posts:</strong> Edit your posts to add
              solutions or updates when issues are resolved
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            2.4 Intellectual Property
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Respect intellectual property rights:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Only post content you have the right to share</li>
            <li>
              Provide proper attribution and links when sharing others' work
            </li>
            <li>
              Respect copyright, trademarks, and other intellectual property
              rights
            </li>
            <li>
              Do not post copyrighted material without permission or fair use
              justification
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            3. Moderation
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Our moderation team works to maintain a safe and productive
            environment for all community members. This section explains how
            moderation works and what you can expect from our moderators.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            3.1 Moderator Responsibilities
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Our moderators are responsible for:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Enforcing these Community Guidelines fairly and consistently
            </li>
            <li>Reviewing reported content and taking appropriate action</li>
            <li>Removing content that violates our policies</li>
            <li>Issuing warnings, suspensions, or bans when necessary</li>
            <li>Helping resolve disputes between community members</li>
            <li>
              Answering questions about community policies and moderation
              decisions
            </li>
            <li>
              Maintaining transparency about moderation actions when appropriate
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            3.2 Moderation Process
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            When content is reported or flagged, moderators will:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Review the content in the context of these guidelines</li>
            <li>
              Consider the severity of the violation and any previous violations
              by the user
            </li>
            <li>
              Take appropriate action, which may include removing content,
              issuing warnings, or applying account restrictions
            </li>
            <li>Notify the affected parties of the decision and next steps</li>
            <li>Document the incident for future reference</li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            3.3 Moderator Authority
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Moderators have the authority to:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Edit or remove any content that violates our guidelines</li>
            <li>
              Lock or close discussions that become unproductive or hostile
            </li>
            <li>Move posts to more appropriate categories or topics</li>
            <li>Temporarily or permanently restrict user accounts</li>
            <li>
              Make judgment calls in situations not explicitly covered by these
              guidelines
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            3.4 Appeals Process
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If you believe a moderation decision was made in error, you can
            appeal by:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Contacting the moderation team at
              moderation@jscommunity.example.com
            </li>
            <li>
              Providing a clear explanation of why you believe the decision was
              incorrect
            </li>
            <li>
              Including relevant context or evidence to support your appeal
            </li>
          </ul>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Appeals are typically reviewed within 7 business days. The decision
            of the moderation team is final.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            4. Reporting Violations
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We rely on our community members to help identify content and
            behavior that violates our guidelines. Your reports help us maintain
            a safe and welcoming environment for everyone.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.1 How to Report
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            You can report violations in the following ways:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Report Button:</strong> Use the "Report" button available
              on all posts and comments
            </li>
            <li>
              <strong>Email:</strong> Send a detailed report to
              report@jscommunity.example.com
            </li>
            <li>
              <strong>Direct Message:</strong> Contact a moderator directly
              through our platform's messaging system
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.2 What to Include in a Report
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            When reporting a violation, please include:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>A direct link to the content or user profile in question</li>
            <li>
              A clear description of the violation and which guideline was
              broken
            </li>
            <li>
              Screenshots or other evidence, if applicable (especially for
              content that might be edited or deleted)
            </li>
            <li>
              Any relevant context that would help moderators understand the
              situation
            </li>
            <li>
              Your contact information if you want to be updated on the outcome
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.3 Report Response Time
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We strive to review all reports promptly:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Urgent Reports:</strong> Reports of serious violations
              (threats, doxxing, illegal content) are reviewed within 1-2 hours
            </li>
            <li>
              <strong>Standard Reports:</strong> Most reports are reviewed
              within 24-48 hours
            </li>
            <li>
              <strong>Low Priority Reports:</strong> Minor guideline violations
              may take up to 5 business days to review
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.4 Confidentiality
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            All reports are kept confidential. We do not share the identity of
            reporters with the reported users unless legally required to do so.
            False or malicious reports may result in action against the
            reporting user's account.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            4.5 Emergency Situations
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If you are in immediate danger or witness content that poses an
            immediate threat to someone's safety:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>Contact local law enforcement immediately</li>
            <li>
              Then report the content to us so we can take appropriate action on
              our platform
            </li>
            <li>
              For urgent platform-related matters, email
              urgent@jscommunity.example.com with "URGENT" in the subject line
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            5. Enforcement
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            When violations of our Community Guidelines occur, we take
            appropriate enforcement action to protect our community. The level
            of enforcement depends on the severity and frequency of violations.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.1 Enforcement Actions
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            We may take the following actions in response to violations:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Content Removal:</strong> Deleting posts, comments, or
              other content that violates our guidelines
            </li>
            <li>
              <strong>Warning:</strong> Issuing a formal warning to the user
              about the violation
            </li>
            <li>
              <strong>Temporary Suspension:</strong> Temporarily restricting
              account access for a specified period (typically 1-30 days)
            </li>
            <li>
              <strong>Permanent Ban:</strong> Permanently removing a user's
              access to the platform
            </li>
            <li>
              <strong>Feature Restrictions:</strong> Limiting specific features
              like posting, commenting, or messaging
            </li>
            <li>
              <strong>Shadowban:</strong> Limiting the visibility of a user's
              content without their knowledge (for spam or persistent minor
              violations)
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.2 Violation Severity Levels
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Violations are categorized by severity:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              <strong>Minor Violations:</strong> First-time, unintentional
              guideline violations (e.g., formatting issues, minor off-topic
              posts)
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>First offense: Warning</li>
                <li>Second offense: 24-hour suspension</li>
                <li>Third offense: 7-day suspension</li>
              </ul>
            </li>
            <li>
              <strong>Moderate Violations:</strong> Deliberate but non-malicious
              violations (e.g., spam, excessive self-promotion, mild rudeness)
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>First offense: 3-7 day suspension</li>
                <li>Second offense: 14-30 day suspension</li>
                <li>Third offense: Permanent ban</li>
              </ul>
            </li>
            <li>
              <strong>Severe Violations:</strong> Serious violations that harm
              the community (e.g., harassment, hate speech, doxxing, threats)
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>First offense: 30-day suspension or permanent ban</li>
                <li>Second offense: Permanent ban</li>
              </ul>
            </li>
            <li>
              <strong>Critical Violations:</strong> Illegal activity, extreme
              harassment, or threats of violence
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Immediate permanent ban</li>
                <li>Report to law enforcement if appropriate</li>
              </ul>
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.3 Notification Process
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            When enforcement action is taken:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              You will receive a notification explaining the violation and the
              action taken
            </li>
            <li>
              The notification will include the specific guideline that was
              violated
            </li>
            <li>
              You will be informed of your right to appeal (except in cases of
              critical violations)
            </li>
            <li>
              For suspensions, you will be notified of the suspension duration
              and reinstatement date
            </li>
          </ul>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.4 Repeat Offenders
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            Users with multiple violations across different categories may face
            escalated enforcement actions, even if individual violations would
            typically result in lesser consequences. Patterns of behavior that
            indicate a persistent disregard for community standards will result
            in permanent removal from the platform.
          </p>

          <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
            5.5 Account Reinstatement
          </h3>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            After a temporary suspension:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6 text-zinc-700 dark:text-zinc-300">
            <li>
              Your account will be automatically reinstated after the suspension
              period ends
            </li>
            <li>
              You will be required to acknowledge the Community Guidelines
              before resuming activity
            </li>
            <li>
              Your account will be monitored more closely for a probationary
              period (typically 30-90 days)
            </li>
            <li>
              Any further violations during the probationary period may result
              in immediate permanent ban
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            6. Frequently Asked Questions
          </h2>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: What should I do if I see content that violates the guidelines?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Use the "Report" button on the post or comment
              to flag it for moderator review. You can also email
              report@jscommunity.example.com with details about the violation.
              Do not engage with the violating content or user - let our
              moderation team handle it.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: Can I promote my own projects or products?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Yes, but in moderation. You can share your
              projects in appropriate categories (e.g., "Show and Tell" or
              "Projects"). However, excessive self-promotion or spam will result
              in content removal and potential account restrictions. A good rule
              of thumb is to contribute to the community 10 times for every 1
              promotional post.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: What counts as harassment?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Harassment includes targeted attacks,
              intimidation, stalking, unwanted contact after being asked to
              stop, threats, doxxing, or any behavior intended to make someone
              feel unsafe or unwelcome. A single rude comment may not constitute
              harassment, but a pattern of negative interactions targeting a
              specific person does.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: How do I appeal a moderation decision?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Send an email to
              moderation@jscommunity.example.com explaining why you believe the
              decision was incorrect. Include relevant context and evidence.
              Appeals are typically reviewed within 7 business days. Be
              respectful in your appeal - aggressive or demanding appeals may
              not be considered.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: Can I use profanity in my posts?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Mild profanity is generally acceptable when
              used to express frustration with code or technology (e.g., "this
              bug is driving me crazy"). However, profanity directed at other
              users, excessive use, or particularly offensive language is not
              permitted and may result in content removal or warnings.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: What if someone disagrees with my technical opinion?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Technical disagreements are normal and
              encouraged as long as they remain respectful and constructive.
              Focus on the technical merits of different approaches rather than
              attacking the person. If a discussion becomes heated, take a break
              and return with a cooler head, or agree to disagree and move on.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: Are job postings allowed?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Yes, job postings are allowed in designated
              areas (e.g., "Jobs" or "Careers" category). Please ensure job
              posts are relevant to JavaScript/web development and include
              essential details like location, requirements, and compensation
              range. Excessive recruitment posts or spam will be removed.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: Can I delete my own posts?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Yes, you can edit or delete your own posts at
              any time. However, we encourage you to edit rather than delete if
              your post has received helpful replies, as others may benefit from
              the discussion. If your post violates guidelines, delete it
              promptly to avoid moderation action.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: What if I accidentally violate a guideline?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Honest mistakes happen! If you realize you've
              violated a guideline, edit or delete the content immediately and,
              if appropriate, post a correction or apology. First-time,
              unintentional violations typically result in a warning rather than
              suspension. The moderation team considers intent when making
              decisions.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: How can I become a moderator?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> We periodically recruit new moderators from
              active, trusted community members. If we're looking for
              moderators, we'll post an announcement with application
              instructions. In the meantime, the best way to prepare is to be an
              active, helpful, and positive member of the community.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 text-xl font-medium text-zinc-900 dark:text-zinc-50">
              Q: Are these guidelines subject to change?
            </h3>
            <p className="mb-4 text-zinc-700 dark:text-zinc-300">
              <strong>A:</strong> Yes, we may update these guidelines as our
              community grows and evolves. We'll notify the community of any
              material changes and provide at least 30 days' notice before they
              take effect. We encourage feedback from the community when
              considering changes to our guidelines.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            7. Contact Information
          </h2>
          <p className="mb-4 text-zinc-700 dark:text-zinc-300">
            If you have questions about these Community Guidelines or need to
            report a violation, please contact us:
          </p>
          <div className="rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              <strong>JS Community Moderation Team</strong>
            </p>
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              General Inquiries: community@jscommunity.example.com
            </p>
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              Report Violations: report@jscommunity.example.com
            </p>
            <p className="mb-2 text-zinc-700 dark:text-zinc-300">
              Moderation Appeals: moderation@jscommunity.example.com
            </p>
            <p className="text-zinc-700 dark:text-zinc-300">
              Urgent Matters: urgent@jscommunity.example.com
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
              Initial version of Community Guidelines
            </p>
          </div>
        </section>

        <div className="mb-8 rounded-lg border-2 border-zinc-300 bg-zinc-50 p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="mb-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Thank You for Being Part of Our Community
          </h3>
          <p className="text-zinc-700 dark:text-zinc-300">
            By following these guidelines, you help create a welcoming,
            inclusive, and productive environment where JavaScript developers of
            all levels can learn, share, and grow together. We appreciate your
            commitment to making JS Community a positive space for everyone.
          </p>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Last updated: {effectiveDate}
          </p>
        </div>
      </div>
    </div>
  );
}
