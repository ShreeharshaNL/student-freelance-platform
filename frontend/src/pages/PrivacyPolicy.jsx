import React from "react";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
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
            Privacy Policy
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
              <p>
                Welcome to StudentFreelance's Privacy Policy. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we collect, use, protect, and share your personal information when you use our platform.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    2.1 Information You Provide
                  </h3>
                  <ul className="list-disc pl-8 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, phone number, password</li>
                    <li><strong>Profile Information:</strong> Skills, education, certifications, portfolio, work experience</li>
                    <li><strong>Project Information:</strong> Project descriptions, proposals, work submissions</li>
                    <li><strong>Communication Data:</strong> Messages, reviews, feedback</li>
                    <li><strong>Payment Information:</strong> Bank account details, payment preferences (processed securely through payment providers)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    2.2 Information We Collect Automatically
                  </h3>
                  <ul className="list-disc pl-8 space-y-2">
                    <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                    <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                    <li><strong>Cookies:</strong> We use cookies to enhance user experience and analyze platform usage</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. How We Use Your Information
              </h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process transactions and payments</li>
                <li>Connect students with clients and facilitate project completion</li>
                <li>Send important updates, notifications, and communications</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
                <li>Analyze platform usage and performance</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Information Sharing
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>4.1 With Other Users:</strong> Your profile information is visible to other users as necessary for platform functionality (e.g., clients can see student profiles when reviewing applications).
                </p>
                <p>
                  <strong>4.2 With Service Providers:</strong> We share information with third-party service providers who help us operate the platform (payment processors, hosting providers, analytics services).
                </p>
                <p>
                  <strong>4.3 For Legal Reasons:</strong> We may disclose information if required by law or to protect our rights and safety.
                </p>
                <p>
                  <strong>4.4 Business Transfers:</strong> In case of merger, acquisition, or sale, your information may be transferred to the new entity.
                </p>
                <p className="font-semibold text-gray-900">
                  We do NOT sell your personal information to third parties.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <p className="mb-3">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-8 space-y-2">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure password storage (hashed and salted)</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Secure payment processing through certified providers</li>
              </ul>
              <p className="mt-3 text-sm italic">
                Note: While we strive to protect your information, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Privacy Rights
              </h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-8 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data (subject to legal retention requirements)</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain data processing activities</li>
                <li><strong>Restriction:</strong> Request restriction of data processing</li>
              </ul>
              <p className="mt-3">
                To exercise these rights, please contact us at <a href="mailto:privacy@studentfreelance.com" className="text-indigo-600 hover:underline">privacy@studentfreelance.com</a>
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Cookies and Tracking
              </h2>
              <p className="mb-3">
                We use cookies and similar tracking technologies to enhance your experience:
              </p>
              <ul className="list-disc pl-8 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for platform functionality (authentication, security)</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the platform</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings, but disabling certain cookies may affect platform functionality.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Data Retention
              </h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your data, except where we need to retain it for legal, tax, or audit purposes.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p>
                Our platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Third-Party Links
              </h2>
              <p>
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during international transfers.
              </p>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a prominent notice on our platform. The "Last updated" date at the top indicates when changes were last made.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contact Us
              </h2>
              <p className="mb-3">
                If you have questions, concerns, or requests regarding this Privacy Policy or your personal data:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> contact@StudentFreelance.com</p>
                <p><strong>Phone:</strong> +91-6282419992</p>
                <p><strong>Address:</strong> [Scholar lance]</p>
              </div>
            </section>

            {/* Consent */}
            <section className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-indigo-900 mb-3">
                Your Consent
              </h2>
              <p className="text-indigo-800">
                By using our platform, you consent to our Privacy Policy and agree to its terms. If you do not agree with this policy, please discontinue use of our platform.
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
            <Link to="/terms-and-conditions" className="hover:text-indigo-600">
              Terms & Conditions
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

export default PrivacyPolicy;
