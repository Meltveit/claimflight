import React from 'react';

export const AboutPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">About ClaimJet</h1>
        <div className="prose prose-slate prose-lg text-slate-600 leading-relaxed">
            <p className="mb-4">
                ClaimJet was born from a simple frustration: why should passengers lose a massive chunk of their hard-earned compensation to "claims agencies" that simply automate a form letter?
            </p>
            <p className="mb-4">
                Under EU Regulation 261/2004 and UK laws, passengers are legally entitled to compensation for significant delays and cancellations. It is your right. You shouldn't have to pay 35% + VAT of <i>your</i> money to get it.
            </p>
            <p className="mb-4">
                We built ClaimJet to provide a professional, legally-sound service for a flat "micro" fee. We use advanced AI to draft the perfect legal demand letter, customized to your specific flight situation, giving you the best chance of success without eating into your payout.
            </p>
            <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Our Promise</h2>
            <ul className="list-disc pl-5 space-y-2 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <li><strong className="text-slate-900">Zero Commissions:</strong> You keep 100% of your payout.</li>
                <li><strong className="text-slate-900">Flat Fee:</strong> Just €2.99, regardless of claim size.</li>
                <li><strong className="text-slate-900">Instant:</strong> No waiting for caseworkers.</li>
            </ul>
        </div>
    </div>
);

export const PrivacyPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 text-slate-600">
            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">1. Data Collection</h2>
                <p>We believe in data minimalism. We only collect the data strictly necessary to generate your claim letter (Name, Flight Details) and deliver it to you (Email).</p>
            </section>
            
            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">2. Payment Information</h2>
                <p>We do not store or process your credit card details on our servers. All payments are securely handled by Stripe, a PCI-certified payment provider.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">3. AI Processing</h2>
                <p>To generate your legal letter, we send your flight and passenger details to third-party AI providers (like OpenAI or Google Gemini). This data is transient and used solely for the purpose of content generation.</p>
            </section>

            <section>
                <h2 className="text-lg font-bold text-slate-900 mb-2">4. No Selling of Data</h2>
                <p>We do not sell, trade, or rent your personal identification information to others. We are a tool for you, not a data broker.</p>
            </section>
        </div>
    </div>
);

export const FAQPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Is ClaimJet a law firm?</h3>
                <p className="text-slate-600">No. We provide a specialized software tool that generates a legal demand letter based on your inputs and current regulations. If your claim requires complex court action beyond a demand letter, we recommend consulting a solicitor.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 text-lg mb-2">How do I send the letter?</h3>
                <p className="text-slate-600">Once generated, you can copy the text or download it as a PDF file. We will provide you with the specific email address for your airline's legal/claims department. You simply email the letter to them directly from your own email address.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Do you take a commission?</h3>
                <p className="text-slate-600">Never. Competitors take 35-50% of your money. We charge a flat €2.99 fee for the generation service. If the airline pays you €600, you keep exactly €600.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 text-lg mb-2">Which flights are eligible?</h3>
                <p className="text-slate-600">Generally, under EU261/UK261, flights departing from a UK/EU airport (any airline) OR arriving at a UK/EU airport (on a UK/EU airline) that are delayed by 3+ hours or cancelled are eligible for compensation.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 text-lg mb-2">What if the airline refuses to pay?</h3>
                <p className="text-slate-600">Our letter includes language demanding payment within 14 days and threatening escalation to the National Enforcement Body (NEB). If they still refuse, you can use our letter as evidence when you file a complaint with the NEB or AviationADR.</p>
            </div>
        </div>
    </div>
);