import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              StudentFreelance
            </Link>
            <Link
              to="/"
              className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-gray-600 mb-8">
            Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <div className="space-y-8 text-gray-700">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introduction
              </h2>
              <p className="mb-4">
                Welcome to StudentFreelance ("we," "our," or "us"). By accessing or using our platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
              </p>
              <p>
                Our platform connects students with clients for freelance work opportunities. Students can offer their services, and clients can post projects and hire qualified students.
              </p>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Account Registration
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>2.1 Eligibility:</strong> You must be at least 18 years old to create an account. Students must use a valid college or university email address.
                </p>
                <p>
                  <strong>2.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized access.
                </p>
                <p>
                  <strong>2.3 Accurate Information:</strong> You agree to provide accurate, current, and complete information during registration and to update such information as necessary.
                </p>
                <p>
                  <strong>2.4 Account Types:</strong>
                </p>
                <ul className="list-disc pl-8 space-y-2">
                  <li><strong>Student Accounts:</strong> Must be registered with a college/university email (.edu, .ac.in, .edu.in, .ac.uk). Students can apply to projects and offer services.</li>
                  <li><strong>Client Accounts:</strong> Can be registered with any valid email. Clients can post projects and hire students.</li>
                </ul>
              </div>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. User Conduct
              </h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Post false, misleading, or fraudulent content</li>
                <li>Engage in harassment, abuse, or harmful behavior toward other users</li>
                <li>Violate intellectual property rights</li>
                <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
                <li>Use the platform for any illegal activities</li>
                <li>Spam, phish, or engage in any form of unsolicited communication</li>
                <li>Circumvent platform fees by conducting transactions outside the platform</li>
              </ul>
            </section>

            {/* Project Posting and Applications */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Project Posting and Applications
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>4.1 Client Responsibilities:</strong> Clients must provide clear project descriptions, fair budgets, and reasonable deadlines. Projects must comply with all applicable laws.
                </p>
                <p>
                  <strong>4.2 Student Responsibilities:</strong> Students must submit accurate applications showcasing their skills and experience. Only apply to projects you can realistically complete.
                </p>
                <p>
                  <strong>4.3 Hiring Process:</strong> Clients have the sole discretion to hire or reject applicants. Once hired, both parties must communicate professionally and work toward project completion.
                </p>
              </div>
            </section>

            {/* Payments and Fees */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Payments and Fees
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>5.1 Payment Terms:</strong> Payments are processed upon project completion and client approval. Clients must pay agreed-upon amounts within the specified timeframe.
                </p>
                <p>
                  <strong>5.2 Platform Fees:</strong> We may charge service fees on transactions. Any applicable fees will be clearly disclosed before transaction completion.
                </p>
                <p>
                  <strong>5.3 Refunds:</strong> Refund policies depend on project terms and completion status. Disputes should be resolved through our dispute resolution process.
                </p>
                <p>
                  <strong>5.4 Taxation:</strong> Users are responsible for all applicable taxes on their earnings and payments.
                </p>
              </div>
            </section>

            {/* Work Submission and Reviews */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Work Submission and Reviews
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>6.1 Quality Standards:</strong> Students must deliver work that meets the project requirements and agreed-upon quality standards.
                </p>
                <p>
                  <strong>6.2 Revisions:</strong> Clients may request revisions if work doesn't meet specifications. Reasonable revision requests should be accommodated.
                </p>
                <p>
                  <strong>6.3 Reviews and Ratings:</strong> Both parties may leave reviews after project completion. Reviews must be honest, fair, and constructive.
                </p>
                <p>
                  <strong>6.4 Intellectual Property:</strong> Unless otherwise agreed, clients own the rights to completed work. Students retain portfolio rights with client permission.
                </p>
              </div>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Dispute Resolution
              </h2>
              <p className="mb-3">
                In case of disputes between users, we encourage amicable resolution through communication. If unresolved:
              </p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Contact our support team for mediation</li>
                <li>Provide all relevant documentation and evidence</li>
                <li>Cooperate with the resolution process</li>
                <li>Accept platform decisions as final in disputes</li>
              </ul>
            </section>

            {/* Privacy and Data */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Privacy and Data Protection
              </h2>
              <p className="mb-3">
                We take your privacy seriously. Please review our Privacy Policy for information on how we collect, use, and protect your data. By using our platform, you consent to our data practices as described in the Privacy Policy.
              </p>
            </section>

            {/* Platform Modifications */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Platform Modifications
              </h2>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the platform at any time. We will provide reasonable notice of significant changes but are not liable for any modifications or interruptions.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Limitation of Liability
              </h2>
              <p className="mb-3">
                The platform is provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Quality of work provided by students</li>
                <li>Disputes between users</li>
                <li>Loss of data or earnings</li>
                <li>Technical issues or downtime</li>
                <li>Actions of other users</li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Account Termination
              </h2>
              <p className="mb-3">
                We may suspend or terminate accounts that violate these terms. Users may also delete their accounts at any time. Upon termination:
              </p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Ongoing projects must be completed or resolved</li>
                <li>Pending payments will be processed according to policy</li>
                <li>Account data may be retained for legal compliance</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Governing Law
              </h2>
              <p>
                These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in [Your City/State].
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="mb-3">
                If you have questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> support@studentfreelance.com</p>
                <p><strong>Phone:</strong> +91-6282419992</p>
                <p><strong>Address:</strong> [sujeetkulkarni@gmail.com]</p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-indigo-900 mb-3">
                Acceptance of Terms
              </h2>
              <p className="text-indigo-800">
                By creating an account and using StudentFreelance, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and StudentFreelance.
              </p>
            </section>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>
            <Link to="/privacy-policy" className="hover:text-indigo-600">
              Privacy Policy
            </Link>
            <Link to="/login" className="hover:text-indigo-600">
              Login
            </Link>
            <Link to="/signup" className="hover:text-indigo-600">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
