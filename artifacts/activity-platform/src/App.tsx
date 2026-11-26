import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SeoSettingsProvider } from "@/contexts/SeoSettingsContext";
import NotFound from "@/pages/not-found";
import ProgrammeDetail from "./pages/ProgrammeDetail";

import Home from "./pages/Home";
import Activities from "./pages/Activities";
import ActivityDetail from "./pages/ActivityDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Partners from "./pages/Partners";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import PhotographyMobile from "./pages/PhotographyMobile";
import PhotographyVideo from "./pages/PhotographyVideo";
import PhotographyCampusReporter from "./pages/PhotographyCampusReporter";
import PhotographyCampusTv from "./pages/PhotographyCampusTv";
import AiAnimation from "./pages/AiAnimation";
import AiVisualStorytelling from "./pages/AiVisualStorytelling";
import AiChineseCulture from "./pages/AiChineseCulture";
import AiTeacherTraining from "./pages/AiTeacherTraining";
import AiThinkingCommunication from "./pages/AiThinkingCommunication";
import Photography from "./pages/Photography";
import AiEducation from "./pages/AiEducation";
import CorporateTeamBuilding from "./pages/CorporateTeamBuilding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location]);
  return null;
}

function RedirectToHome() {
  useEffect(() => {
    window.location.replace("/");
  }, []);
  return null;
}

function RedirectToAiThinkingProgramme() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/programmes/ai-thinking-communication", { replace: true });
  }, [setLocation]);
  return null;
}


function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/index.html" component={RedirectToHome} />
        <Route path="/" component={Home} />
        <Route path="/activities" component={Activities} />
        <Route path="/activities/ai-thinking-communication-course" component={RedirectToAiThinkingProgramme} />
        <Route path="/activities/:slug" component={ActivityDetail} />
        <Route path="/photography" component={Photography} />
        <Route path="/photography/mobile" component={PhotographyMobile} />
        <Route path="/photography/video-production" component={PhotographyVideo} />
        <Route path="/photography/campus-reporter" component={PhotographyCampusReporter} />
        <Route path="/photography/campus-tv" component={PhotographyCampusTv} />
        <Route path="/ai-education" component={AiEducation} />
        <Route path="/corporate-team-building" component={CorporateTeamBuilding} />
        <Route path="/ai-education/animation" component={AiAnimation} />
        <Route path="/ai-education/visual-storytelling" component={AiVisualStorytelling} />
        <Route path="/ai-education/chinese-culture" component={AiChineseCulture} />
        <Route path="/ai-education/teacher-training" component={AiTeacherTraining} />
        <Route path="/ai-education/thinking-communication" component={AiThinkingCommunication} />
        <Route path="/case-studies" component={CaseStudies} />
        <Route path="/case-studies/:slug" component={CaseStudyDetail} />
        <Route path="/programmes/:slug" component={ProgrammeDetail} />
        <Route path="/about" component={About} />
        <Route path="/partners" component={Partners} />
        <Route path="/contact" component={Contact} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  // Locale lives in the URL: "/" = zh-HK (default), "/en" = en-HK. We drive the
  // wouter base off the /en prefix so every existing <Link> stays in-locale
  // automatically. Crossing locales is a full navigation (see LanguageContext).
  const rawBase = import.meta.env.BASE_URL.replace(/\/$/, "");
  const enPrefix = `${rawBase}/en`;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isEn = pathname === enPrefix || pathname.startsWith(`${enPrefix}/`);
  const routerBase = isEn ? enPrefix : rawBase;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SeoSettingsProvider>
          <WouterRouter base={routerBase}>
            <LanguageProvider initialLang={isEn ? "en" : "zh"}>
              <Router />
              <Toaster />
            </LanguageProvider>
          </WouterRouter>
        </SeoSettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
