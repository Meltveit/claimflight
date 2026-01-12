import React, { useState, useEffect } from 'react';
import { 
    AppStep, 
    FlightDetails, 
    PassengerDetails, 
    ClaimEstimate,
    FlightStatus
} from './types';
import { checkFlightStatus, calculateEligibility } from './services/flightService';
import { generateClaimLetter } from './services/geminiService';
import { PlaneIcon, CheckCircleIcon, AlertCircleIcon, CopyIcon, DownloadIcon, ChevronRightIcon, ShieldIcon } from './components/Icons';
import ComparisonChart from './components/ComparisonChart';
import { AboutPage, PrivacyPage, FAQPage } from './components/StaticPages';

// --- Components defined internally ---

// 0. Reusable Flight Summary Card
const FlightSummaryCard = ({ flight }: { flight: FlightDetails }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full text-left">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Flight Summary</h3>
        <div className="flex justify-between items-center mb-4">
            <div>
                <div className="text-2xl font-bold text-slate-900">{flight.departure.split(' ')[0]}</div>
                {flight.scheduledDepartureTime && (
                    <div className="text-lg font-mono text-slate-700">{flight.scheduledDepartureTime}</div>
                )}
                <div className="text-sm text-slate-500">Departure</div>
            </div>
            <div className="flex-1 border-t-2 border-slate-200 border-dashed mx-4 relative top-[-8px]"></div>
            <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{flight.arrival.split(' ')[0]}</div>
                {flight.scheduledArrivalTime && (
                    <div className="text-lg font-mono text-slate-700">{flight.scheduledArrivalTime}</div>
                )}
                <div className="text-sm text-slate-500">Arrival</div>
            </div>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
            <div className="flex justify-between">
                <span className="font-semibold text-slate-700">{flight.airline}</span>
                <span>{flight.date}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
                <span>Flight: {flight.flightNumber}</span>
                <span>Distance: {flight.distanceKm}km</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 border-t border-slate-200 pt-2 mt-1">
                <span>Status:</span>
                <span className={`font-bold ${flight.status === FlightStatus.CANCELLED ? 'text-red-600' : flight.status === FlightStatus.DELAYED ? 'text-amber-600' : 'text-green-600'}`}>
                    {flight.status.replace('_', ' ')}
                    {flight.delayDurationMinutes > 0 && ` (${flight.delayDurationMinutes} min)`}
                </span>
            </div>
             {flight.delayReason && flight.delayReason !== 'Unknown' && (
                 <div className="text-xs text-slate-500 mt-1 italic border-t border-slate-200 pt-1">
                    Reason: {flight.delayReason}
                 </div>
            )}
        </div>
    </div>
);

// 1. Header Component
const Header = ({ onGoHome }: { onGoHome: () => void }) => (
  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer group" onClick={onGoHome}>
        <div className="bg-aviation-600 p-1.5 rounded-lg text-white group-hover:bg-aviation-700 transition-colors">
            <PlaneIcon className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-aviation-900">ClaimJet</span>
      </div>
      <div className="text-sm font-medium text-slate-500 hidden sm:block">
        Keep 100% of your compensation
      </div>
    </div>
  </header>
);

// 2. Flight Search Form
const SearchStep = ({ onSearch }: { onSearch: (f: string, d: string) => void }) => {
  const [flightNum, setFlightNum] = useState('');
  const [date, setDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSearch(flightNum, date);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl mb-4">
          Delayed Flight? <br />
          <span className="text-aviation-600">Get Paid, Don't Get Played.</span>
        </h1>
        <p className="text-lg text-slate-600">
            Generate a professional legal compensation letter in seconds for just <span className="font-bold text-slate-900">€2.99</span>. 
            Others take 35% of your payout. We take zero.
        </p>
      </div>

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="flight" className="block text-sm font-medium text-slate-700 mb-1">Flight Number</label>
            <input
              type="text"
              id="flight"
              placeholder="e.g. LH401"
              required
              className="block w-full rounded-lg border-slate-300 border p-3 shadow-sm focus:border-aviation-500 focus:ring-aviation-500 sm:text-sm transition-colors"
              value={flightNum}
              onChange={(e) => setFlightNum(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Date of Flight</label>
            <input
              type="date"
              id="date"
              required
              className="block w-full rounded-lg border-slate-300 border p-3 shadow-sm focus:border-aviation-500 focus:ring-aviation-500 sm:text-sm transition-colors"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-aviation-600 hover:bg-aviation-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aviation-500 disabled:opacity-70 transition-all"
          >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking Flight...
                </span>
            ) : "Check Eligibility"}
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-slate-400">
           Checking flight status via Aviation API
        </p>
      </div>
    </div>
  );
};

// 3. Eligibility Result Step
const EligibilityStep = ({ 
    flight, 
    claim, 
    onNext,
    onReset
}: { 
    flight: FlightDetails, 
    claim: ClaimEstimate, 
    onNext: () => void,
    onReset: () => void
}) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button 
        onClick={onReset} 
        className="mb-6 flex items-center text-sm text-slate-500 hover:text-aviation-600 transition-colors font-medium group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover:-translate-x-1 transition-transform">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
        </svg>
        Back to Search
      </button>

      {claim.eligible ? (
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Flight Info & Status */}
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
               <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                    <CheckCircleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-green-800">Eligible for Compensation</h2>
                    <p className="text-green-700 mt-1">
                        Your flight was delayed by {Math.floor(flight.delayDurationMinutes / 60)}h {flight.delayDurationMinutes % 60}m.
                        Under {claim.regulation}, you are entitled to compensation.
                    </p>
                  </div>
               </div>
            </div>

            <FlightSummaryCard flight={flight} />
          </div>

          {/* Right Column: Value Prop & Action */}
          <div className="space-y-6">
             <div className="bg-white border border-aviation-100 ring-4 ring-aviation-50 rounded-xl p-6 shadow-lg">
                <div className="text-center mb-6">
                    <div className="text-sm font-medium text-slate-500">Estimated Payout</div>
                    <div className="text-5xl font-extrabold text-aviation-600 mt-2">{claim.currency}{claim.amount}</div>
                    <div className="text-xs text-slate-400 mt-1">per passenger</div>
                </div>
                
                <ComparisonChart claimAmount={claim.amount} />

                <button 
                    onClick={onNext}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-4 px-6 bg-aviation-600 hover:bg-aviation-700 text-white rounded-xl font-bold text-lg shadow-md transition-all transform hover:scale-[1.02]"
                >
                    Claim Your {claim.currency}{claim.amount} Now
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
                <div className="text-center mt-3 text-xs text-slate-400">
                    Pay only €2.99 once. Keep 100% of the rest.
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto flex flex-col items-center">
            <div className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <AlertCircleIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-yellow-900 mb-2">Not Eligible for Compensation</h2>
                <div className="text-yellow-800 space-y-2">
                    <p>
                        Based on the data for {flight.airline} flight {flight.flightNumber}, the delay was less than 3 hours or due to extraordinary circumstances. 
                        Claims under EU261 require a delay of 3+ hours upon arrival.
                    </p>
                </div>
            </div>

            <div className="w-full mb-6">
                 <FlightSummaryCard flight={flight} />
            </div>

            <button 
                onClick={onReset}
                className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium cursor-pointer transition-colors shadow-sm"
            >
                Check Another Flight
            </button>
        </div>
      )}
    </div>
  );
};

// 4. Payment Form (Mock)
const PaymentStep = ({ onPay }: { onPay: (details: PassengerDetails) => void }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [bookingRef, setBookingRef] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate Stripe processing time
        setTimeout(() => {
            onPay({ firstName, lastName, email, bookingReference: bookingRef });
        }, 2000);
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-800">Secure Checkout</h2>
                    <div className="flex gap-2">
                        <div className="w-8 h-5 bg-slate-300 rounded"></div>
                        <div className="w-8 h-5 bg-slate-300 rounded"></div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">Premium Claim Letter</span>
                            <span className="font-bold text-slate-900">€2.99</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-slate-100 pt-2">
                            <span className="font-bold text-slate-900">Total</span>
                            <span className="font-bold text-aviation-600 text-lg">€2.99</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">First Name</label>
                                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full rounded border-slate-300 border p-2 text-sm" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Last Name</label>
                                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full rounded border-slate-300 border p-2 text-sm" placeholder="Doe" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded border-slate-300 border p-2 text-sm" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Booking Reference (PNR)</label>
                            <input type="text" required value={bookingRef} onChange={e => setBookingRef(e.target.value)} className="w-full rounded border-slate-300 border p-2 text-sm" placeholder="e.g. A1B2C3" />
                        </div>

                        {/* Mock Card Element */}
                        <div className="pt-4 border-t border-slate-100 mt-4">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Card Details</label>
                            <div className="border border-slate-300 rounded p-3 bg-white flex items-center gap-3">
                                <ShieldIcon className="w-5 h-5 text-slate-400" />
                                <input type="text" className="w-full outline-none text-sm bg-transparent" placeholder="4242 4242 4242 4242" disabled />
                                <span className="text-xs text-slate-400">MM/YY CVC</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">
                                *This is a demo. No real payment is processed.
                            </p>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isProcessing}
                            className="w-full mt-4 py-3 bg-aviation-600 hover:bg-aviation-700 text-white font-bold rounded-lg shadow transition-colors flex justify-center items-center gap-2"
                        >
                            {isProcessing ? "Processing..." : "Pay €2.99 & Generate"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// 5. Letter Generation & Success
const SuccessStep = ({ 
    flight, 
    passenger, 
    claim 
}: { 
    flight: FlightDetails, 
    passenger: PassengerDetails, 
    claim: ClaimEstimate 
}) => {
    const [letterText, setLetterText] = useState('');
    const [generating, setGenerating] = useState(true);

    useEffect(() => {
        const fetchLetter = async () => {
            try {
                const text = await generateClaimLetter(flight, passenger, claim.regulation, claim.amount, claim.currency);
                setLetterText(text);
            } catch (err) {
                setLetterText("There was an error generating your letter. Please contact support.");
            } finally {
                setGenerating(false);
            }
        };
        fetchLetter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(letterText);
        alert("Letter copied to clipboard!");
    };

    const downloadFakePDF = () => {
        const element = document.createElement("a");
        const file = new Blob([letterText], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `Claim_Letter_${flight.flightNumber}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    if (generating) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
                <div className="w-16 h-16 border-4 border-aviation-200 border-t-aviation-600 rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-bold text-slate-900">Generating Your Legal Letter</h2>
                <p className="text-slate-500 mt-2 max-w-md">
                    Our AI is drafting a formal claim based on Regulation {claim.regulation}, citing relevant case law for flight {flight.flightNumber}.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <div className="bg-green-600 px-8 py-6 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <CheckCircleIcon className="w-6 h-6" /> Success!
                        </h2>
                        <p className="text-green-100 mt-1">Your claim letter is ready. </p>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            onClick={copyToClipboard}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition"
                         >
                            <CopyIcon className="w-4 h-4" /> Copy Text
                         </button>
                         <button 
                            onClick={downloadFakePDF}
                            className="bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition shadow-sm"
                         >
                            <DownloadIcon className="w-4 h-4" /> Download
                         </button>
                    </div>
                </div>

                <div className="p-8 bg-slate-50">
                    <div className="bg-white p-8 shadow-sm border border-slate-200 rounded-lg whitespace-pre-wrap font-serif text-slate-800 leading-relaxed letter-scroll max-h-[600px] overflow-y-auto">
                        {letterText}
                    </div>
                </div>

                <div className="bg-slate-100 p-6 border-t border-slate-200 text-center">
                    <h3 className="font-semibold text-slate-800 mb-2">What's Next?</h3>
                    <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                        Send this letter via email or certified mail to <strong>{flight.airline}</strong>'s legal department. 
                        We have sent their specific claims email address to <strong>{passenger.email}</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
};

// 6. Navigation Types
type AppView = 'APP' | 'ABOUT' | 'PRIVACY' | 'FAQ';


// --- Main App Component ---

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>('APP');
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SEARCH);
  
  // App Logic State
  const [flightData, setFlightData] = useState<FlightDetails | null>(null);
  const [claimEstimate, setClaimEstimate] = useState<ClaimEstimate | null>(null);
  const [passengerData, setPassengerData] = useState<PassengerDetails | null>(null);

  const handleSearch = async (flightNum: string, date: string) => {
    const flight = await checkFlightStatus(flightNum, date);
    const claim = calculateEligibility(flight);
    
    setFlightData(flight);
    setClaimEstimate(claim);
    setCurrentStep(AppStep.ELIGIBILITY);
  };

  const handleReset = () => {
      setFlightData(null);
      setClaimEstimate(null);
      setPassengerData(null);
      setCurrentStep(AppStep.SEARCH);
  };

  const handleProceedToPayment = () => {
    setCurrentStep(AppStep.PAYMENT);
  };

  const handlePaymentSuccess = (passenger: PassengerDetails) => {
    setPassengerData(passenger);
    setCurrentStep(AppStep.SUCCESS);
  };

  const goToHome = () => {
      setCurrentView('APP');
      // We do NOT reset the app step so the user doesn't lose progress if they just wanted to check FAQ
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onGoHome={goToHome} />
      
      <main className="flex-grow">
        {currentView === 'APP' && (
            <>
                {currentStep === AppStep.SEARCH && (
                    <SearchStep onSearch={handleSearch} />
                )}

                {currentStep === AppStep.ELIGIBILITY && flightData && claimEstimate && (
                    <EligibilityStep 
                        flight={flightData} 
                        claim={claimEstimate} 
                        onNext={handleProceedToPayment} 
                        onReset={handleReset}
                    />
                )}

                {currentStep === AppStep.PAYMENT && (
                    <PaymentStep onPay={handlePaymentSuccess} />
                )}

                {currentStep === AppStep.SUCCESS && flightData && claimEstimate && passengerData && (
                    <SuccessStep 
                        flight={flightData} 
                        passenger={passengerData} 
                        claim={claimEstimate} 
                    />
                )}
            </>
        )}

        {currentView === 'ABOUT' && <AboutPage />}
        {currentView === 'PRIVACY' && <PrivacyPage />}
        {currentView === 'FAQ' && <FAQPage />}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-slate-800 font-bold">
                        <div className="bg-aviation-600 p-1 rounded-md text-white">
                            <PlaneIcon className="w-3 h-3" />
                        </div>
                        ClaimJet
                     </div>
                     <p className="text-slate-500 text-sm max-w-xs">
                        Democratizing air passenger rights with AI-powered legal tools.
                     </p>
                </div>
                
                <div className="flex gap-8 text-sm font-medium text-slate-600">
                    <button onClick={() => setCurrentView('ABOUT')} className="hover:text-aviation-600 transition-colors">About Us</button>
                    <button onClick={() => setCurrentView('FAQ')} className="hover:text-aviation-600 transition-colors">FAQ</button>
                    <button onClick={() => setCurrentView('PRIVACY')} className="hover:text-aviation-600 transition-colors">Privacy Policy</button>
                </div>
            </div>
            
            <div className="border-t border-slate-100 mt-8 pt-8 text-center text-slate-400 text-xs">
                <p>&copy; {new Date().getFullYear()} ClaimJet. Not a law firm. Information provided for generation purposes only.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;