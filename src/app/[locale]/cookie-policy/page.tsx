import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy - Fredonbytes',
  description: 'Learn about how Fredonbytes uses cookies and similar technologies to enhance your browsing experience and provide personalized services.',
  robots: 'index, follow',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              How we use cookies and similar technologies
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
              Last updated: January 6, 2025
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Cookie Overview
              </h2>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                This policy explains how Fredonbytes uses cookies and similar technologies when you visit our website, and your choices regarding these technologies.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.
              </p>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                We also use similar technologies such as web beacons, pixels, and local storage, which we collectively refer to as &ldquo;cookies&rdquo; in this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                2. Types of Cookies We Use
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">
                    🔧 Essential Cookies
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                    <strong>Purpose:</strong> Required for basic website functionality
                  </p>
                  <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                    <strong>Can be disabled:</strong> No - these are necessary for the site to work
                  </p>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    These cookies enable core functionality such as page navigation, access to secure areas, and remembering your cookie preferences.
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    📊 Analytics Cookies
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                    <strong>Purpose:</strong> Help us understand website usage
                  </p>
                  <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                    <strong>Can be disabled:</strong> Yes - through our cookie banner
                  </p>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">
                    🎯 Marketing Cookies
                  </h3>
                  <p className="text-purple-800 dark:text-purple-200 text-sm mb-3">
                    <strong>Purpose:</strong> Deliver relevant advertisements
                  </p>
                  <p className="text-purple-800 dark:text-purple-200 text-sm mb-3">
                    <strong>Can be disabled:</strong> Yes - through our cookie banner
                  </p>
                  <p className="text-purple-800 dark:text-purple-200 text-sm">
                    These cookies track your browsing habits to show you relevant ads and measure advertising effectiveness.
                  </p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-3">
                    ⚙️ Preference Cookies
                  </h3>
                  <p className="text-orange-800 dark:text-orange-200 text-sm mb-3">
                    <strong>Purpose:</strong> Remember your settings and preferences
                  </p>
                  <p className="text-orange-800 dark:text-orange-200 text-sm mb-3">
                    <strong>Can be disabled:</strong> Yes - through our cookie banner
                  </p>
                  <p className="text-orange-800 dark:text-orange-200 text-sm">
                    These cookies remember your preferences such as language, region, or theme settings for a personalized experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                3. Specific Cookies We Use
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-slate-200 dark:border-slate-700 rounded-lg">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                    <tr>
                      <th className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-left text-slate-900 dark:text-white font-semibold">Cookie Name</th>
                      <th className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-left text-slate-900 dark:text-white font-semibold">Purpose</th>
                      <th className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-left text-slate-900 dark:text-white font-semibold">Type</th>
                      <th className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-left text-slate-900 dark:text-white font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">cookie-consent</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Stores your cookie preferences</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Essential</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">1 year</td>
                    </tr>
                    <tr>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">_ga</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Google Analytics - distinguishes users</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Analytics</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">2 years</td>
                    </tr>
                    <tr>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">_gid</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Google Analytics - distinguishes users</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Analytics</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">24 hours</td>
                    </tr>
                    <tr>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">theme-preference</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Remembers dark/light mode preference</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">Preference</td>
                      <td className="border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-slate-700 dark:text-slate-300">1 year</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">_fbp</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Facebook Pixel - tracks conversions</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Marketing</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">3 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                4. Third-Party Cookies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Google Analytics</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                    Helps us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    Google Privacy Policy
                  </a>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Google Fonts</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                    Provides web fonts to enhance the visual design of our website.
                  </p>
                  <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    Google Privacy Policy
                  </a>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Social Media Platforms</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">
                    When you interact with social media buttons or embedded content, those platforms may set their own cookies.
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                    Please refer to the respective privacy policies of each platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                5. How to Control Cookies
              </h2>
              
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Our Cookie Banner
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                When you first visit our website, you&apos;ll see a cookie banner that allows you to:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>Accept all cookies</li>
                <li>Accept only necessary cookies</li>
                <li>Customize your cookie preferences</li>
                <li>Learn more about each type of cookie</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Browser Settings
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                You can also control cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                Opt-Out Links
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Google Analytics:</strong> 
                    <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 dark:text-blue-400 hover:underline ml-2">
                      Google Analytics Opt-out Browser Add-on
                    </a>
                  </li>
                  <li>
                    <strong>Facebook:</strong> 
                    <a href="https://www.facebook.com/settings?tab=ads" className="text-blue-600 dark:text-blue-400 hover:underline ml-2">
                      Facebook Ad Preferences
                    </a>
                  </li>
                  <li>
                    <strong>General Advertising:</strong> 
                    <a href="http://www.youronlinechoices.com/" className="text-blue-600 dark:text-blue-400 hover:underline ml-2">
                      Your Online Choices
                    </a>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                6. Impact of Disabling Cookies
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                If you choose to disable certain cookies, some features of our website may not function properly:
              </p>
              <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-6 space-y-1">
                <li>You may need to re-enter information on each visit</li>
                <li>Some personalized features may not be available</li>
                <li>You may see less relevant advertisements</li>
                <li>Website analytics may be incomplete</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                7. Updates to This Policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. 
                We will notify you of any material changes by posting the updated policy on our website and updating the &ldquo;Last updated&rdquo; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                8. Contact Us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <p className="text-slate-700 dark:text-slate-300 mb-2">
                  <strong>Fredonbytes</strong><br/>
                  Email: <a href="mailto:privacy@fredonbytes.cloud" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@fredonbytes.cloud</a><br/>
                  Phone: <a href="tel:+420799027984" className="text-blue-600 dark:text-blue-400 hover:underline">+420 799 027 984</a><br/>
                  Address: Brno, Czech Republic
                </p>
              </div>
            </section>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                🍪 Need to Change Your Cookie Preferences?
              </h3>
              <p className="text-green-800 dark:text-green-200 text-sm mb-3">
                You can update your cookie preferences at any time by clicking the cookie settings button in the bottom corner of any page on our website.
              </p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Manage Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}