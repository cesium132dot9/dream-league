// src/screens/OnboardingScreen.jsx
import { useState, useEffect } from "react";
import whispImg from "../assets/whisp.png";
import whispHappyImg from "../assets/whisp-happy.png";
import whispSittingImg from "../assets/whisp-sitting.png";
import whispWelcomeImg from "../assets/whisp-welcome.png";
import whispTiredImg from "../assets/whisp-tired.png";
import big3Img from "../assets/big-3.png";
import big3CustomizedImg from "../assets/big-3-customized.png";
import dozerHappyImg from "../assets/dozer-happy.png";
import dozerCatnapFightingImg from "../assets/dozer-napster-fighting.png";
import napsterSleepingImg from "../assets/napster-sleeping-no-window.png";
import dozerLoadingVideo from "../assets/dozer-loading.mp4";
import dreamLeagueIcon from "../assets/DreamLeague-icon.png";

function OnboardingScreen({ onComplete }) {
  const sleepMascots = [
    { emoji: "🦉", label: "Owl", description: "Wise night guardian" },
    { emoji: "🐱", label: "Cat", description: "Cat striker" },
    { emoji: "🐻", label: "Bear", description: "Hibernation master" },
    { emoji: "🦇", label: "Bat", description: "Night flyer" },
    { emoji: "🐨", label: "Koala", description: "Sleep champion" },
    { emoji: "🦝", label: "Raccoon", description: "Night explorer" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedApps, setSelectedApps] = useState(["TikTok", "Instagram", "YouTube", "Twitter/X"]);
  const [bedtime, setBedtime] = useState("23:30");
  const [wakeTime, setWakeTime] = useState("07:30");
  const [selectedMascot, setSelectedMascot] = useState(sleepMascots[0]);
  const [username, setUsername] = useState("");
  const [prevPage, setPrevPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for back, 1 for forward
  
  // Animation states for app blocking page
  const [showMascot, setShowMascot] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState("");
  const [showHeading, setShowHeading] = useState(false);
  const [showSelectionBox, setShowSelectionBox] = useState(false);
  
  // Animation state for mascot intro page
  const [mascotIntroText, setMascotIntroText] = useState("");
  const [showUsernameInput, setShowUsernameInput] = useState(false);
  const [showMascotIntroButtons, setShowMascotIntroButtons] = useState(false);
  
  // Animation state for stats page
  const [statsText, setStatsText] = useState("");
  const [showStatsButton, setShowStatsButton] = useState(false);
  
  // Animation state for league format page
  const [leagueSubtitleText, setLeagueSubtitleText] = useState("");
  const [showDozer, setShowDozer] = useState(false);
  const [showPointSystem, setShowPointSystem] = useState(false);
  
  // Animation state for dream squad page
  const [showDreamSquadSubtitle, setShowDreamSquadSubtitle] = useState(false);
  const [showBig3Customized, setShowBig3Customized] = useState(false);
  
  // Animation state for friends page
  const [showDozerFighting, setShowDozerFighting] = useState(false);
  const [showFriendsButtons, setShowFriendsButtons] = useState(false);
  
  // Loading screen state
  const [showLoading, setShowLoading] = useState(false);
  const [loadingFadeOut, setLoadingFadeOut] = useState(false);
  
  // Welcome page fade-in state
  const [showWelcome, setShowWelcome] = useState(false);

  const totalPages = 10;

  const availableApps = ["TikTok", "Instagram", "YouTube", "Twitter/X", "Reddit", "Snapchat", "Facebook", "Netflix"];

  const toggleApp = (app) => {
    setSelectedApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setPrevPage(currentPage);
      setDirection(1);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setTimeout(() => {
          setDirection(0);
          setPrevPage(currentPage + 1);
        }, 300);
      }, 10);
    } else {
      // Show loading screen
      setShowLoading(true);
      setLoadingFadeOut(false);
      // Fade out after 4.5 seconds, then complete onboarding after 5 seconds
      setTimeout(() => {
        setLoadingFadeOut(true);
        setTimeout(() => {
        onComplete({
          selectedApps,
          bedtime,
          wakeTime,
          selectedMascot,
          username,
        });
        }, 500); // Complete after fade-out animation
      }, 4500);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setPrevPage(currentPage);
      setDirection(-1);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setTimeout(() => {
          setDirection(0);
          setPrevPage(currentPage - 1);
        }, 300);
      }, 10);
    }
  };

  // Page 0: Welcome (Duolingo style)
  const renderWelcomePage = () => (
    <div className={`h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900 transition-opacity duration-1000 ${
      showWelcome ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Mascot at top */}
      <div className="flex-1 flex items-center justify-center pt-12 pb-4">
        <img
          src={big3Img}
          alt="Mascot"
          className="w-80 h-80 object-contain"
        />
      </div>

      {/* Logo and tagline - directly below mascot like Duolingo */}
      <div className="flex flex-col items-center px-8 pb-8">
        <img
          src={dreamLeagueIcon}
          alt="Dream League"
          className="h-14 object-contain mb-3"
        />
        <p className="text-sm text-white/70 text-center">
          Fix your sleep. Beat your friends.
        </p>
      </div>

      {/* Buttons */}
      <div className="px-5 pb-8 space-y-3">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-semibold text-sm text-white uppercase tracking-wide shadow-lg shadow-indigo-500/40 transition"
        >
          Get Started
        </button>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-white/10 border-2 border-white/20 hover:border-white/30 hover:bg-white/20 font-semibold text-sm text-white uppercase tracking-wide transition"
        >
          I Already Have An Account
        </button>
      </div>
    </div>
  );

  // Page 1: Mascot Introduction
  const renderMascotIntroPage = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Speech bubble */}
        <div className="relative mb-4">
          {/* Speech bubble */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-5 py-4 shadow-sm border border-white/10 min-h-[3rem]">
            <p className="text-base text-white text-center">
              {mascotIntroText}
              {mascotIntroText.length > 0 && mascotIntroText.length < "Hey! I'm Whisp. What's your name?".length && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          </div>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-white/20 backdrop-blur-sm transform rotate-45 border-l border-b border-white/10"></div>
          </div>
        </div>

        {/* Mascot */}
        <div className="flex items-center justify-center mb-6">
          <img
            src={whispWelcomeImg}
            alt="Whisp"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Username input - fades in after text finishes */}
        <div className={`w-full max-w-sm transition-opacity duration-500 ${
          showUsernameInput ? 'opacity-100' : 'opacity-0'
        }`}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 transition"
          />
          <p className="text-xs text-white/60 mt-2 text-center">
            This will be your Dream League username.
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className={`px-5 pb-8 space-y-3 transition-opacity duration-500 ${
        showMascotIntroButtons ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-base text-white transition shadow-lg shadow-emerald-500/40"
        >
          Nice to meet you!
        </button>
        {currentPage > 0 && (
          <button
            onClick={handleBack}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white transition"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );

  // Page 2: Welcome with name
  const renderWelcomeNamePage = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-header text-white">
            Welcome to Dream League, {username || "there"}!
          </h1>
          
          {/* Whisp happy image */}
          <div className="flex items-center justify-center">
            <img
              src={whispHappyImg}
              alt="Whisp"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="px-5 pb-8 space-y-3">
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-semibold text-base text-white transition shadow-lg shadow-indigo-500/40"
        >
          Continue
        </button>
        {currentPage > 0 && (
          <button
            onClick={handleBack}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white transition"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );

  // Page 3: Stats page
  const renderStatsPage = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Speech bubble - fixed height to prevent layout shift */}
        <div className="relative mb-4 w-full max-w-sm">
          {/* Speech bubble */}
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-5 py-4 shadow-sm border border-white/10 h-20 flex items-center justify-center">
            <p className="text-base text-white text-center">
              {(() => {
                const fullText = "Did you know that 36.3% of Canadian adults who get insufficient sleep report chronic stress?";
                const boldStart = "Did you know that ".length;
                const boldEnd = "Did you know that 36.3%".length;
                
                if (statsText.length <= boldStart) {
                  return statsText;
                } else if (statsText.length <= boldEnd) {
                  return (
                    <>
                      {statsText.slice(0, boldStart)}
                      <span className="font-semibold">{statsText.slice(boldStart)}</span>
                    </>
                  );
                } else {
                  return (
                    <>
                      {statsText.slice(0, boldStart)}
                      <span className="font-semibold">{statsText.slice(boldStart, boldEnd)}</span>
                      {statsText.slice(boldEnd)}
                    </>
                  );
                }
              })()}
              {statsText.length > 0 && statsText.length < "Did you know that 36.3% of Canadian adults who get insufficient sleep report chronic stress?".length && (
                <span className="animate-pulse ml-1">|</span>
              )}
            </p>
          </div>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-white/20 backdrop-blur-sm transform rotate-45 border-l border-b border-white/10"></div>
          </div>
        </div>

        {/* Mascot - fixed position below speech bubble */}
        <div className="flex items-center justify-center mt-4">
          <img
            src={whispTiredImg}
            alt="Whisp"
            className="w-48 h-48 object-contain"
          />
        </div>
      </div>

      {/* Navigation buttons - fades in after text */}
      <div className={`px-5 pb-8 space-y-3 transition-opacity duration-500 ${
        showStatsButton ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 font-semibold text-base text-white transition shadow-lg shadow-indigo-500/40"
        >
          Let's fix that!
        </button>
        {currentPage > 0 && (
          <button
            onClick={handleBack}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white transition"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );

  // Reset animation states when page changes
  useEffect(() => {
    if (currentPage === 0) {
      // Reset and start fade-in for welcome page
      setShowWelcome(false);
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(true);
      }, 100); // Small delay before starting fade-in
      
      return () => {
        clearTimeout(welcomeTimer);
      };
    } else if (currentPage === 1) {
      // Reset and start animations for mascot intro page
      setMascotIntroText("");
      setShowUsernameInput(false);
      setShowMascotIntroButtons(false);
      
      // Type out "Hey! I'm Whisp. What's your name?"
      const introText = "Hey! I'm Whisp. What's your name?";
      const introTimer = setTimeout(() => {
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex <= introText.length) {
            setMascotIntroText(introText.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            // Show username input after text finishes typing
            setTimeout(() => {
              setShowUsernameInput(true);
              // Show buttons 1000ms after username input appears
              setTimeout(() => {
                setShowMascotIntroButtons(true);
              }, 1000);
            }, 300);
          }
        }, 50); // Speed of typing
      }, 200); // Small delay before starting

      return () => {
        clearTimeout(introTimer);
      };
    } else if (currentPage === 3) {
      // Reset and start animations for stats page (was page 2, now page 3)
      setStatsText("");
      setShowStatsButton(false);
      
      // Type out stats text
      const statsIntroText = "Did you know that 36.3% of Canadian adults who get insufficient sleep report chronic stress?";
      const statsTimer = setTimeout(() => {
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex <= statsIntroText.length) {
            setStatsText(statsIntroText.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            // Fade in button after text finishes
            setTimeout(() => {
              setShowStatsButton(true);
            }, 300);
          }
        }, 38); // Speed of typing (1.3x faster: 50ms / 1.3 ≈ 38ms)
      }, 200); // Small delay before starting

      return () => {
        clearTimeout(statsTimer);
      };
    } else if (currentPage === 4) {
      // Reset and start animations for league format page (was page 3, now page 4)
      setLeagueSubtitleText("");
      setShowDozer(false);
      setShowPointSystem(false);
      
      // Step 1: Type out subtitle text
      const subtitleText = "Gain points by sleeping on schedule!";
      const typingSpeed = 50; // ms per character
      
      const leagueTimer = setTimeout(() => {
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex <= subtitleText.length) {
            setLeagueSubtitleText(subtitleText.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            // Step 2: After typing completes, fade in dozer and point system together
            setTimeout(() => {
              setShowDozer(true);
              setShowPointSystem(true);
            }, 100); // Small delay after typing completes
          }
        }, typingSpeed);
      }, 200); // Small delay before starting
      
      return () => {
        clearTimeout(leagueTimer);
      };
    } else if (currentPage === 6) {
      // Reset and start animations for dream squad page (was page 5, now page 6)
      setShowDreamSquadSubtitle(false);
      setShowBig3Customized(false);
      
      // Overlay customized image and fade in subtitle simultaneously after 1300ms
      const imageOverlayTimer = setTimeout(() => {
        setShowBig3Customized(true);
        setShowDreamSquadSubtitle(true);
      }, 1300);
      
      return () => {
        clearTimeout(imageOverlayTimer);
      };
    } else if (currentPage === 7) {
      // Reset and start animations for friends page (was page 6, now page 7)
      setShowDozerFighting(false);
      setShowFriendsButtons(false);
      
      // Fade in dozer image and boxes 700ms after page loads (when heading appears)
      const friendsTimer = setTimeout(() => {
        setShowDozerFighting(true);
        // Fade in buttons shortly after image/boxes fade in (500ms transition + 300ms delay)
        setTimeout(() => {
          setShowFriendsButtons(true);
        }, 800);
      }, 700);
      
      return () => {
        clearTimeout(friendsTimer);
      };
    } else if (currentPage === 8) {
      // Reset and start animations for app blocking page (was page 7, now page 8)
      setShowMascot(false);
      setSpeechBubbleText("");
      setShowHeading(false);
      setShowSelectionBox(false);
      
      // Step 1: Fade in mascot
      setTimeout(() => setShowMascot(true), 100);
      
      // Step 2: Type out speech bubble text after mascot appears
      const speechText = "Just a few quick questions to help you get your sleep on track!";
      const typewriterTimer = setTimeout(() => {
        let currentIndex = 0;
        const typeInterval = setInterval(() => {
          if (currentIndex <= speechText.length) {
            setSpeechBubbleText(speechText.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typeInterval);
            // Step 3: Fade in heading after speech bubble finishes
            setTimeout(() => {
              setShowHeading(true);
              // Step 4: Fade in selection box 1 second after heading
              setTimeout(() => {
                setShowSelectionBox(true);
              }, 1000);
            }, 300);
          }
        }, 30); // Speed of typing
      }, 400); // Delay after mascot appears

      return () => {
        clearTimeout(typewriterTimer);
      };
    } else {
      // Reset when leaving the page
      setMascotIntroText("");
      setStatsText("");
      setShowStatsButton(false);
      setLeagueSubtitleText("");
      setShowDozer(false);
      setShowPointSystem(false);
      setShowDreamSquadSubtitle(false);
      setShowBig3Customized(false);
      setShowDozerFighting(false);
      setShowFriendsButtons(false);
      setShowMascot(false);
      setSpeechBubbleText("");
      setShowHeading(false);
      setShowSelectionBox(false);
    }
  }, [currentPage]);

  // Page 7: App blocking (iOS style with intro) (was page 6, now page 7)
  const renderAppsPage = () => {
    const subtitleText = "These apps will be blocked during your sleep time.";

    return (
      <div className="h-full overflow-y-auto bg-gradient-to-b from-indigo-900 to-slate-900">
        {/* Mascot and speech bubble intro */}
        <div className="flex items-start px-6 pt-10 pb-6">
          {/* Mascot - fixed on left, fades in */}
          <div 
            className={`transition-opacity duration-500 flex-shrink-0 ${
              showMascot ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={whispSittingImg}
              alt="Whisp"
              className="w-24 h-24 object-contain"
            />
          </div>
          
          {/* Speech bubble - types out */}
          <div className="relative flex-1 pt-2 ml-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-4 py-3 shadow-sm border border-white/10 min-h-[3rem]">
              <p className="text-sm text-white">
                {(() => {
                  const fullText = "Just a few quick questions to help you get your sleep on track!";
                  const boldStart = "Just ".length;
                  const boldEnd = "Just a few quick questions".length;
                  
                  if (speechBubbleText.length <= boldStart) {
                    return speechBubbleText;
                  } else if (speechBubbleText.length <= boldEnd) {
                    return (
                      <>
                        {speechBubbleText.slice(0, boldStart)}
                        <span className="font-semibold">{speechBubbleText.slice(boldStart)}</span>
                      </>
                    );
                  } else {
                    return (
                      <>
                        {speechBubbleText.slice(0, boldStart)}
                        <span className="font-semibold">{speechBubbleText.slice(boldStart, boldEnd)}</span>
                        {speechBubbleText.slice(boldEnd)}
                      </>
                    );
                  }
                })()}
                {speechBubbleText.length > 0 && speechBubbleText.length < "Just a few quick questions to help you get your sleep on track!".length && (
                  <span className="animate-pulse ml-1">|</span>
                )}
              </p>
            </div>
            {/* Speech bubble tail pointing left */}
            <div className="absolute top-8 -left-2">
              <div className="w-3 h-3 bg-white/20 backdrop-blur-sm transform rotate-45 border-l border-b border-white/10"></div>
            </div>
          </div>
        </div>

      {/* App blocking section */}
      <div className="px-4 pb-4 pt-2">
        <h2 
          className={`text-xl font-semibold text-white mb-1 transition-opacity duration-500 ${
            showHeading ? 'opacity-100' : 'opacity-0'
          }`}
        >
          What apps do you want to block?
        </h2>
          {showHeading && (
            <p className="text-sm text-white/70 mb-4 animate-fade-in">
              {subtitleText}
            </p>
          )}
        </div>

        {/* iOS-style list container */}
        <div 
          className={`mx-4 mb-4 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-sm transition-opacity duration-700 ${
            showSelectionBox ? 'opacity-100' : 'opacity-0'
          }`}
        >
        <div className="divide-y divide-white/10">
          {availableApps.map((app, index) => (
            <label
              key={app}
              className="flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-white/5 transition-colors"
            >
              <span className="text-base text-white font-medium">{app}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedApps.includes(app)}
                  onChange={() => toggleApp(app)}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    selectedApps.includes(app)
                      ? "bg-indigo-500 border-indigo-500"
                      : "border-white/30 bg-transparent"
                  }`}
                >
                  {selectedApps.includes(app) && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
      </div>
    );
  };

  // Page 3: League Format Explanation - Part 1
  const renderLeagueFormatPage = () => (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-indigo-900 to-slate-900 p-5">
      <div className="text-center space-y-2 mb-6 pt-6">
        <h1 className="text-3xl font-header text-white mb-2">How It Works</h1>
        <p className="text-sm text-white/70 min-h-[1.25rem]">
          {leagueSubtitleText}
          {leagueSubtitleText.length > 0 && leagueSubtitleText.length < "Gain points by sleeping on schedule!".length && (
            <span className="animate-pulse">|</span>
          )}
        </p>
      </div>

      {/* Mascot in middle */}
      <div className={`flex items-center justify-center my-6 transition-opacity duration-500 ${
        showDozer ? 'opacity-100' : 'opacity-0'
      }`}>
        <img
          src={dozerHappyImg}
          alt="Dozer"
          className="w-72 h-72 object-contain"
        />
      </div>

      <div className="space-y-4">
        {/* Point System */}
        <div 
          className={`bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 transition-opacity duration-500 ${
            showPointSystem ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h2 className="text-lg font-semibold text-white mb-3">Point System</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-xl font-bold">
              +1
            </div>
            <p className="text-white flex-1">
              Every day you sleep on schedule, you earn <span className="font-semibold text-indigo-300">+1 point</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Page 4: League Format Explanation - Part 2
  const renderLeagueSchedulePage = () => (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-indigo-900 to-slate-900 p-5">
      <div className="text-center space-y-2 mb-6 pt-6">
        <h1 className="text-3xl font-header text-white mb-2">Weekly Schedule</h1>
      </div>

      <div className="space-y-4">
        {/* Weekly Schedule */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                  S
                </div>
                <span className="text-white">Sunday</span>
              </div>
              <span className="text-indigo-300 font-semibold">+1 pt</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                  M
                </div>
                <span className="text-white">Monday</span>
              </div>
              <span className="text-indigo-300 font-semibold">+1 pt</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                  T
                </div>
                <span className="text-white">Tuesday</span>
              </div>
              <span className="text-indigo-300 font-semibold">+1 pt</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                  W
                </div>
                <span className="text-white">Wednesday</span>
              </div>
              <span className="text-indigo-300 font-semibold">+1 pt</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                  T
                </div>
                <span className="text-white">Thursday</span>
              </div>
              <span className="text-indigo-300 font-semibold">+1 pt</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-semibold text-white">
                  F
                </div>
                <span className="text-white">Friday</span>
              </div>
              <span className="text-indigo-300 font-semibold">+1 pt</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/10 pt-2 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-xs font-semibold text-white">
                  S
                </div>
                <span className="text-white font-semibold">Saturday - Matchday</span>
              </div>
              <span className="text-indigo-300 font-semibold">🏆 Results</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-indigo-500/20 backdrop-blur-sm rounded-2xl p-4 border border-indigo-400/30">
          <p className="text-sm text-white text-center">
            Sleep well Sunday through Friday, then see how you rank <span className="font-semibold">against your friends</span> on <span className="font-semibold">Matchday Saturday</span>!
          </p>
        </div>
      </div>
    </div>
  );

  // Page 5: Build Your Dream Squad
  const renderDreamSquadPage = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-6">
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-header text-white mb-2">Build Your Dream Squad</h1>
            <p className={`text-sm text-white/70 transition-opacity duration-700 ${
              showDreamSquadSubtitle ? 'opacity-100' : 'opacity-0'
            }`}>
              Turn your sleep streak into in-game swag!
            </p>
          </div>

          {/* Big 3 images - overlay transition */}
          <div className="relative flex items-center justify-center my-6">
            {/* Base image (big-3) - fades out */}
            <img
              src={big3Img}
              alt="Big 3"
              className={`w-[346px] h-[346px] object-contain transition-opacity duration-700 ${
                showBig3Customized ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {/* Customized image overlay - fades in */}
            <img
              src={big3CustomizedImg}
              alt="Big 3 Customized"
              className={`absolute inset-0 w-[346px] h-[346px] object-contain transition-opacity duration-700 ${
                showBig3Customized ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Page 7: Friends & Leagues Splash (index 7 in pages array)
  const renderFriendsPage = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-6">
        <div className="text-center space-y-4 max-w-sm">
          <h1 className="text-4xl font-header text-white mb-2">
            Compete with Friends
          </h1>
          
          {/* Dozer image - 1x (original size: w-64 = 256px) */}
          <div className={`flex items-center justify-center my-2 transition-opacity duration-500 ${
            showDozerFighting ? 'opacity-100' : 'opacity-0'
          }`}>
            <img
              src={dozerCatnapFightingImg}
              alt="Dozer"
              className="w-64 h-64 object-contain"
            />
          </div>
          
          <div className={`space-y-3 transition-opacity duration-500 ${
            showDozerFighting ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-base text-white">
                Join <span className="font-semibold text-indigo-300">leagues</span> and compete with friends!
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-base text-white">
                <span className="font-semibold text-indigo-300">Beat your friends</span>, beat the scroll, and sleep better together!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className={`px-5 pb-8 space-y-3 transition-opacity duration-500 ${
        showFriendsButtons ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-semibold text-base text-white transition shadow-lg shadow-emerald-500/40"
        >
          Let's Get Started
        </button>
        {currentPage > 0 && (
          <button
            onClick={handleBack}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white transition"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );

  // Page 8: Sleep schedule (was page 7, now page 8)
  const renderSchedulePage = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-indigo-900 to-slate-900">
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-6">
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-header text-white">
              Set Your Schedule
            </h1>
            <p className="text-sm text-white/70">
              You can change this later.
            </p>
          </div>

          {/* Napster sleeping image */}
          <div className="flex items-center justify-center my-2">
            <img
              src={napsterSleepingImg}
              alt="Napster sleeping"
              className="w-64 h-64 object-contain"
            />
          </div>

          <div className="bg-black/30 rounded-2xl p-4 space-y-3">
            <h2 className="font-semibold text-sm">Sleep schedule</h2>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs text-white/60 mb-1">
                  Bedtime
                </label>
                <input
                  type="time"
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/60 mb-1">
                  Wake time
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Page 8: Mascot selection
  const renderMascotPage = () => (
    <div className="h-full overflow-y-auto p-5 space-y-5 pt-8">
      <div className="text-center space-y-2 mb-4">
        <h1 className="text-3xl font-bold">Choose Your Mascot</h1>
        <p className="text-sm text-white/70">
          Pick your sleep companion
        </p>
      </div>

      <div className="bg-black/30 rounded-2xl p-4 space-y-3">
        <h2 className="font-semibold text-sm">Select your mascot</h2>
        <div className="grid grid-cols-2 gap-3">
          {sleepMascots.map((mascot) => (
            <button
              key={mascot.label}
              onClick={() => setSelectedMascot(mascot)}
              className={`rounded-2xl py-4 flex flex-col items-center gap-2 border transition ${
                selectedMascot?.label === mascot.label
                  ? "bg-indigo-500/30 border-indigo-400"
                  : "bg-white/5 border-transparent hover:border-indigo-400/50"
              }`}
            >
              <span className="text-4xl">{mascot.emoji}</span>
              <div className="text-center">
                <span className="text-sm font-semibold block">{mascot.label}</span>
                <span className="text-xs text-white/60">{mascot.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const pages = [
    renderWelcomePage,
    renderMascotIntroPage,
    renderWelcomeNamePage,
    renderStatsPage,
    renderLeagueFormatPage,
    renderLeagueSchedulePage,
    renderDreamSquadPage,
    renderFriendsPage,
    renderAppsPage,
    renderSchedulePage,
  ];

  // Loading screen
  const renderLoadingScreen = () => (
    <div className={`h-full w-full relative overflow-hidden transition-opacity duration-500 ${
      loadingFadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      <video
        src={dozerLoadingVideo}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {showLoading ? (
        renderLoadingScreen()
      ) : (
        <>
      {/* Page content with smooth transitions */}
      <div className="flex-1 relative overflow-hidden">
        {/* Previous page sliding out */}
        {direction !== 0 && prevPage !== currentPage && (
          <div
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${-direction * 100}%)`,
            }}
          >
            {pages[prevPage]()}
          </div>
        )}
        {/* Current page sliding in */}
        <div
          key={currentPage}
          className="absolute inset-0 transition-transform duration-300 ease-in-out"
          style={{
            transform: direction !== 0
              ? `translateX(${direction * 100}%)`
              : 'translateX(0)',
          }}
        >
          {pages[currentPage]()}
        </div>
      </div>

      {/* Navigation - hidden on welcome page, mascot intro page, welcome name page, stats page, and friends page */}
      {currentPage > 0 && currentPage !== 1 && currentPage !== 2 && currentPage !== 3 && currentPage !== 7 && (
        <div className="p-5 space-y-3 border-t border-white/10 bg-gradient-to-b from-indigo-900 to-slate-900">
          {/* Progress indicator */}
          <div className="flex gap-1 justify-center">
            {Array.from({ length: totalPages - 1 }).map((_, i) => {
              const pageIndex = i + 1; // Skip welcome page in indicator
              return (
                <div
                  key={pageIndex}
                  className={`h-1 rounded-full transition ${
                    pageIndex === currentPage
                      ? "bg-indigo-400 w-8"
                      : pageIndex < currentPage
                      ? "bg-indigo-400/50 w-2"
                      : "bg-white/20 w-2"
                  }`}
                />
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-semibold text-sm text-white transition"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-sm text-white shadow-lg shadow-indigo-500/40 transition"
            >
              {currentPage === totalPages - 1 ? "Start training" : "Continue"}
            </button>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

export default OnboardingScreen;
