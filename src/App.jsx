import React, { useState, useEffect, useRef, useCallback } from "react";
import { List, Calendar, Sparkles, ChevronDown } from "lucide-react";
 
// Import your new components
import Header from "./componets/Header";
import SearchBar from "./componets/SearchBar";
import OpportunityCard from "./componets/OpportunityCard";
import SavedOppItem from "./componets/SavedOppItem";
import OpportunityDetailPage from "./componets/OpportunityDetailPage";
import StateDisplay from "./componets/StateDisplay";
import CalendarView from "./componets/CalendarView";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { createUsersInfinateQueryOptions } from "./apis/createUserInfiniteQueryOptions";
import './App.css';
const filter = {};
import { scroller,Events } from 'react-scroll'; // 1. Import scroller
  
  const targetId = "scrollableRef";
// --- Mock Data for Funding Opportunities ---
const mockOpportunities = [
  {
    id: "nsf-101",
    agency: "NSF",
    title: "Cyber-Physical Systems (CPS)",
    deadline: "2025-12-15",
    description:
      "Projects at the intersection of computation, networking, and physical systems.",
    keywords: ["cyber", "iot", "engineering"],
  },
  {
    id: "nih-201",
    agency: "NIH",
    title:
      "Brain Research Through Advancing Innovative Neurotechnologies (BRAIN)",
    deadline: "2026-01-05",
    description:
      "Supports the development and application of innovative neurotechnologies.",
    keywords: ["neuroscience", "brain", "health"],
  },
  {
    id: "doe-301",
    agency: "DOE",
    title: "Solar Energy Technologies Office (SETO) Funding",
    deadline: "2025-11-20",
    description:
      "Funds research in solar energy, grid integration, and energy storage.",
    keywords: ["solar", "energy", "climate"],
  },
  {
    id: "neh-401",
    agency: "NEH",
    title: "Digital Humanities Advancement Grants",
    deadline: "2026-02-10",
    description:
      "Supports projects that explore the use of digital technology in humanities research.",
    keywords: ["humanities", "digital", "software"],
  },
  {
    id: "nsf-102",
    agency: "NSF",
    title: "Faculty Early Career Development Program (CAREER)",
    deadline: "2025-07-22",
    description:
      "Prestigious award for early-career faculty who are leaders in their field.",
    keywords: ["faculty", "early career", "research"],
  },
  {
    id: "nih-202",
    agency: "NIH",
    title: "New Innovator Award (DP2)",
    deadline: "2025-09-01",
    description:
      "Supports exceptionally creative early-career investigators proposing high-risk, high-reward research.",
    keywords: ["innovator", "high-risk", "health", "early career"],
  },
  {
    id: "nasa-202",
    agency: "NASA",
    title: "Early Career Faculty (ECF)",
    deadline: "2026-03-15",
    description:
      "Supports outstanding early-career researchers in space science.",
    keywords: ["space", "aerospace", "faculty", "early career"],
  },
];
 
// --- Main App Component ---
export default function App() {
  // --- Local State Management ---
  const [userId, setUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]); // Now local state
 
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false); // No longer loading from DB
  const [error, setError] = useState(null);
 
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [currentView, setCurrentView] = useState("search");
 
  const [recommendedOpps, setRecommendedOpps] = useState([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [recsVisible, setRecsVisible] = useState(true);
 
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery(createUsersInfinateQueryOptions(filter));
  const scrollRef = useRef(null);
  const scrollableRef = useRef(null);

  // const [isScrolling, setIsScrolling] = useState(false);

 
  const OPPORTUNITIES = data?.pages.flatMap((page) => page.data) ?? [];
 
  const virtualizer = useVirtualizer({
    count: OPPORTUNITIES?.length ?? 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 170,
  });
 
  const virtualItems = virtualizer.getVirtualItems();
 
  // --- Simulate Auth & Recommendation Fetch on Load ---
  useEffect(() => {
    // 1. Simulate fetching a user profile
    setTimeout(() => {
      setUserId("local_user_0123"); // Set a mock user ID
    }, 500);
 
    // 2. Simulate fetching AI recommendations
    setIsLoadingRecs(true);
    const userKeywords = ["early career", "faculty"];
 
    setTimeout(() => {
      const recommendations = mockOpportunities.filter((opp) =>
        opp.keywords.some((k) => userKeywords.includes(k))
      );
      setRecommendedOpps(recommendations.slice(0, 3));
      setIsLoadingRecs(false);
    }, 700);
  }, []);


const handleScrollStart = () => {
    // 2. Use scroller.scrollTo()
    const targetId = "scrollableRef";
    scroller.scrollTo(targetId, {
      duration: 1200, // <-- Set your duration (in milliseconds)
      smooth: "easeInOutQuad", // <-- Set the ease (e.g., "easeInQuad")
      offset: 0, // You can set an offset, e.g., -50px
    });
  };

  const [isScrolling, setIsScrolling] = useState(false);
  
  const targetId = "scrollableRef";

  // 2. Use react-scroll's own events to manage the lock
  


 
  // --- App Logic: Search ---
  const handleSearch = useCallback((query, agency, status, sortBy) => {
    setIsLoadingSearch(true);
    setError(null);
    // setRecsVisible(false);
    handleScrollStart();
    console.log("Searching with:", { query, agency, status, sortBy });
 
    setTimeout(() => {
      // let results = [...mockOpportunities];
      fetchNextPage();
      const now = new Date();
 
      if (query) {
        results = results.filter(
          (opp) =>
            opp.title.toLowerCase().includes(query.toLowerCase()) ||
            opp.description.toLowerCase().includes(query.toLowerCase()) ||
            opp.keywords.some((k) =>
              k.toLowerCase().includes(query.toLowerCase())
            )
        );
      }
      if (agency !== "All") {
        results = results.filter((opp) => opp.agency === agency);
      }
      if (status !== "All") {
        results = results.filter((opp) => {
          const deadline = new Date(opp.deadline);
          const isOpen = deadline > now;
          return status === "Open" ? isOpen : !isOpen;
        });
      }
      if (sortBy === "deadline") {
        results.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      }
 
      setSearchResults(results);
      setIsLoadingSearch(false);
      // Close recommendations when a search is performed
      setRecsVisible(false);
    }, 500);
  }, []);
 
  // --- App Logic: Toggle Save State (Local) ---
  const handleToggleSave = (opportunity) => {
    debugger
    const savedItem = savedOpportunities.find(
      (item) => item.id === opportunity.id
    );
 
    if (savedItem) {
      // Remove from watchlist
      setSavedOpportunities((prevOpps) =>
        prevOpps.filter((opp) => opp.id !== opportunity.id)
      );
      console.log("Opportunity removed from local watchlist:", opportunity.id);
    } else {
      // Add to watchlist
      // Add a 'docId' for local key consistency, even though it's not from Firestore
      // const newSavedItem = { ...opportunity, docId: `local-${opportunity.id}` };
      const newSavedItem = { ...opportunity };
      setSavedOpportunities((prevOpps) => [newSavedItem, ...prevOpps]);
      console.log("Opportunity added to local watchlist:", opportunity.id);
    }
  };
 
  // --- App Logic: View/Close Details ---
  const handleViewDetails = (opportunity) => {
    setSelectedOpp(opportunity);
  };
 
  const handleCloseDetails = () => {
    setSelectedOpp(null);
  };
 
  const savedOppIds = new Set(savedOpportunities.map((opp) => opp.id));
 
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem || isFetchingNextPage || !hasNextPage) {
      return;
    }
    if (lastItem.index >= data?.length - 1) {
      return;
    }
    if(lastItem.index >= OPPORTUNITIES?.length -1){
      fetchNextPage();
    }
  }, [virtualItems, isFetchingNextPage, hasNextPage]);

  
useEffect(() => {
    // Set lock to true when react-scroll starts animating
    Events.scrollEvent.register('begin', (to, element) => {
      if (to === targetId) {
        setIsScrolling(true);
      }
    });

    // Release lock when react-scroll finishes
    Events.scrollEvent.register('end', (to, element) => {
      if (to === targetId) {
        setIsScrolling(false);
      }
    });

    // Clean up listeners on component unmount
    return () => {
      Events.scrollEvent.remove('begin');
      Events.scrollEvent.remove('end');
    };
  }, []); // Empty dependency array, runs once

  // 3. The new wheel handler
  const handleWheel = (event) => {
    // 1. If we are already animating, just lock the scroll
    if (isScrolling) {
      // event.preventDefault();
      return;
    }

    // 2. Get the element's current position relative to the viewport
    const element = document.getElementById(targetId);
    if (!element) return; // Safety check
    
    const elementTop = element.getBoundingClientRect().top;

    // 3. Check scroll direction (deltaY > 0 means scrolling DOWN)
    const isScrollingDown = event.deltaY > 0;

    // 4. Define if the element is already at the top (with a 1px tolerance)
    const isAtTop = Math.abs(elementTop) < 1;

    // --- MAIN LOGIC ---
    // 5. ONLY trigger animation if:
    //    - The element is NOT at the top AND
    //    - The user is scrolling DOWN
    if (!isAtTop && isScrollingDown) {
      // This is the trigger. Stop the browser scroll and start our animation.
      // event.preventDefault();

      scroller.scrollTo(targetId, {
        duration: 1200,
        smooth: "easeInOutQuad",
        offset: 0,
      });
    }

    // 6. ELSE (if user is scrolling UP, or element is ALREADY at top)
    //    ... do nothing.
    //    This lets the browser handle the scroll normally,
    //    allowing the user to scroll away (up or down).
  }
 
  return (
    <div className="bg-gray-100 min-h-screen font-inter">
      <Header userId={userId} />
 
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {selectedOpp ? (
          // --- Detail View ---
          <OpportunityDetailPage
            opp={selectedOpp}
            onClose={handleCloseDetails}
            onToggleSave={handleToggleSave}
            isSaved={savedOppIds.has(selectedOpp.id)}
          />
        ) : (
          // --- Main Search or Calendar View ---
          <>
            {/* View Toggle Buttons */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setCurrentView("search")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "search"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <List className="h-5 w-5" />
                <span>Search View</span>
              </button>
              <button
                onClick={() => setCurrentView("calendar")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "calendar"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                <Calendar className="h-5 w-5" />
                <span>Deadline Calendar</span>
              </button>
            </div>
 
            {/* --- Conditionally Rendered View --- */}
            {currentView === "search" && (
              // --- Main Grid View (Search) ---
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- Main Content (Search & Results) --- */}
                <div className="lg:col-span-2 space-y-6">
                  <SearchBar onSearch={handleSearch} />
 
                  {/* --- Recommended For You Section (Collapsible) --- */}
                  <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-lg border border-blue-100 shadow-sm">
                    {/* --- Clickable Header --- */}
                    <div
                      className="flex justify-between items-center p-6 cursor-pointer"
                      onClick={() => setRecsVisible(!recsVisible)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={recsVisible}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-blue-600 p-2 rounded-full">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            AI Recommendations
                          </h2>
                          <p className="text-sm text-gray-600">
                            Based on your interests (e.g., 'early career',
                            'faculty').
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-1 rounded-full hover:bg-blue-100"
                        aria-label={
                          recsVisible
                            ? "Collapse recommendations"
                            : "Expand recommendations"
                        }
                      >
                        <ChevronDown
                          className={`h-6 w-6 text-blue-600 transition-transform duration-200 ${
                            recsVisible ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                    </div>
 
                    {/* --- Collapsible Content --- */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        recsVisible
                          ? "max-h-[2000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 pb-6">
                        <StateDisplay
                          isLoading={isLoadingRecs}
                          error={null}
                          data={recommendedOpps}
                          type="recommended"
                        />
                        {!isLoadingRecs && recommendedOpps.length > 0 && (
                          <div className="space-y-4">
                            {recommendedOpps.map((opp) => (
                              <OpportunityCard
                                key={opp.id + "-rec"}
                                opp={opp}
                                onToggleSave={handleToggleSave}
                                isSaved={savedOppIds.has(opp.id)}
                                onViewDetails={handleViewDetails}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                  {/* --- End of Recommended Section --- */}
 
                  <section>
                    <h2 className="text-xl font-semibold mb-4">
                      All Search Results
                    </h2>
                    <StateDisplay
                      isLoading={isFetchingNextPage}
                      error={error}
                      data={OPPORTUNITIES}
                      type="search"
                    />
                    <div className="space-y-4 scrollable-fade" onWheel={handleWheel} id='scrollableRef'  ref={scrollableRef}>
                        <>
                          <div
                            ref={scrollRef}
                            id="scrollableDiv"
                            style={{ height: "100vh", overflowY: "auto" }}
                          >
                            <div
                              className="relative"
                              style={{
                                height: `${virtualizer.getTotalSize()}px`,
                              }}
                            >
                              {virtualItems.map((virtualRow) => {
                                const OPP = OPPORTUNITIES?.[virtualRow.index];
                                if (!OPP) return null;
                                return (
                                  <div
                                    key={virtualRow.index}
                                    className='absolute top-0 left-0 w-full p-2'
                                    style={{
                                      transform: `translateY(${virtualRow.start}px)`,
                                      height: `${virtualRow.size}px`,
                                    }}
                                    data-index={virtualRow.index}
                                  >
                                    <OpportunityCard
                                      key={virtualRow.index}
                                      opp={OPP}
                                      onToggleSave={handleToggleSave}
                                      isSaved={savedOppIds.has(OPP?.id)}
                                      onViewDetails={handleViewDetails}
                                    />
                                  </div>
                                );
                              })}
                              
                            </div>
                            <div>
                              {!hasNextPage && OPPORTUNITIES.length > 0 && (
                                <p className="text-center text-gray-500 py-4">
                                  You have reached the end of the results.
                                </p>
                              )}
                              {isFetchingNextPage && (
                                <p className="text-center text-gray-500 py-4">
                                  Loading more opportunities...
                                </p>
                              )}
                            </div>
                          </div>
                        </>
                    </div>
                  </section>
                </div>
 
                {/* --- Sidebar (Saved Opportunities) --- */}
                <aside className="lg:col-span-1">
                  <div className="bg-white p-5 rounded-lg border shadow-sm sticky top-24">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      My Watchlist
                    </h2>
                    <StateDisplay
                      isLoading={isLoadingSaved}
                      error={null}
                      data={savedOpportunities}
                      type="saved"
                    />
                    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {savedOpportunities.map((item) => (
                        <SavedOppItem
                          key={item.docId}
                          item={item}
                          onToggleSave={handleToggleSave}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            )}
 
            {currentView === "calendar" && (
              // --- Calendar View ---
              <CalendarView
                savedOpportunities={savedOpportunities}
                onViewDetails={handleViewDetails}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}