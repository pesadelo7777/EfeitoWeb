"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Menu, Plus, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const QUESTION = "Se pesquisar sua empresa no Google, o que aparece?";

const SERVICES = [
  { number: "01", title: "Sites profissionais", text: "Sites modernos, rápidos e estrategicamente construídos para apresentar sua empresa e gerar novas oportunidades.", tag: "AUTORIDADE" },
  { number: "02", title: "Landing pages", text: "Páginas focadas em campanhas, produtos, serviços e conversão de visitantes em contatos.", tag: "CONVERSÃO" },
  { number: "03", title: "Presença digital", text: "Estrutura visual e estratégica para tornar sua empresa mais profissional, confiável e fácil de encontrar.", tag: "POSICIONAMENTO" },
  { number: "04", title: "Design e experiência", text: "Interfaces marcantes, responsivas e pensadas para criar uma navegação clara e memorável.", tag: "EXPERIÊNCIA" },
  { number: "05", title: "Otimização", text: "Performance, responsividade, estrutura técnica e boas práticas para uma experiência rápida em qualquer dispositivo.", tag: "PERFORMANCE" },
];

const PROCESS = [
  { number: "01", title: "Entendimento", text: "Conhecemos o negócio, o público e os objetivos do projeto." },
  { number: "02", title: "Estratégia", text: "Definimos a estrutura, a comunicação e o caminho que o visitante deverá percorrer." },
  { number: "03", title: "Criação", text: "Transformamos a estratégia em uma experiência visual moderna, responsiva e marcante." },
  { number: "04", title: "Desenvolvimento", text: "Construímos o site com atenção à performance, à usabilidade e aos detalhes." },
  { number: "05", title: "Publicação", text: "Colocamos a nova presença digital da empresa no ar." },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [comparison, setComparison] = useState(58);

  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const startAtTop = () => {
      if (window.location.hash) return;
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
    };

    startAtTop();
    window.addEventListener("pageshow", startAtTop);
    return () => {
      window.removeEventListener("pageshow", startAtTop);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const scope = root.current;
    if (!scope) return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finishLoading = () => setLoaded(true);
    // Some mobile browsers expose the OS "reduce motion" preference by default.
    // Keep the experience gentler in that case, but never turn the site static or
    // make the loading screen flash for only a few milliseconds.
    const loaderTimer = window.setTimeout(finishLoading, reduceMotion ? 850 : 1050);
    let refreshFrame = 0;
    let cancelled = false;

    const refresh = () => {
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    const mobileDevice = window.matchMedia("(max-width: 900px), (hover: none), (pointer: coarse)").matches;

    if (mobileDevice) {
      const searchStory = scope.querySelector<HTMLElement>(".search-story");
      const phoneStage = scope.querySelector<HTMLElement>(".phone-stage");
      const storyIntro = scope.querySelector<HTMLElement>(".story-intro");
      const phoneScreen = scope.querySelector<HTMLElement>(".phone-screen");
      const searchUi = scope.querySelector<HTMLElement>(".search-ui");
      const typedCopy = scope.querySelector<HTMLElement>(".typed-copy");
      const phoneGlow = scope.querySelector<HTMLElement>(".phone-glow");
      const depthGrid = scope.querySelector<HTMLElement>(".depth-grid");
      const manifesto = scope.querySelector<HTMLElement>(".manifesto");
      const manifestoTrack = scope.querySelector<HTMLElement>(".manifesto-track");
      const processList = scope.querySelector<HTMLElement>(".process-list");
      const processProgress = scope.querySelector<HTMLElement>(".process-progress span");
      const resultItems = Array.from(scope.querySelectorAll<HTMLElement>(".search-results p"));
      const activeAnimations: Animation[] = [];
      let mobileFrame = 0;
      let manifestoOffset = 0;
      let revealFallbackCheck = () => {};

      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      const range = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
      const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;

      const showStaticStory = () => {
        if (searchStory) searchStory.style.height = "auto";
        if (phoneStage) phoneStage.style.transform = "none";
        if (storyIntro) {
          storyIntro.style.opacity = "1";
          storyIntro.style.transform = "none";
        }
        if (phoneScreen) phoneScreen.style.backgroundColor = "#f7f6f2";
        if (searchUi) searchUi.style.opacity = "1";
        if (typedCopy) typedCopy.style.maxWidth = "100%";
        resultItems.forEach((item) => {
          item.style.opacity = "1";
          item.style.transform = "none";
        });
      };

      const updateMobileStory = () => {
        mobileFrame = 0;
        if (!searchStory || !phoneStage || !storyIntro || !phoneScreen || !searchUi || !typedCopy || !phoneGlow || !depthGrid) {
          showStaticStory();
          return;
        }

        const travel = Math.max(1, searchStory.offsetHeight - window.innerHeight);
        const progress = clamp(-searchStory.getBoundingClientRect().top / travel);
        const entrance = range(progress, 0, 0.28);
        const exit = range(progress, 0.92, 1);
        const shortLandscape = window.matchMedia("(max-height: 520px) and (orientation: landscape)").matches;
        const finalScale = reduceMotion ? 1.3 : shortLandscape ? 1.72 : 2.25;
        const initialScale = reduceMotion ? 0.96 : 0.82;
        const scale = exit > 0 ? lerp(1, finalScale, exit) : lerp(initialScale, 1, entrance);
        const translateY = exit > 0 ? lerp(0, -2, exit) : lerp(reduceMotion ? 18 : 62, 0, entrance);
        const rotateX = reduceMotion ? 0 : lerp(16, 0, entrance);
        const rotateY = reduceMotion ? 0 : lerp(-14, 0, entrance);
        const rotateZ = reduceMotion ? 0 : lerp(-4, 0, entrance);

        phoneStage.style.transform = `translate3d(0, ${translateY}%, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;

        const introProgress = range(progress, 0.14, 0.25);
        storyIntro.style.opacity = String(1 - introProgress);
        storyIntro.style.transform = `translate3d(0, ${lerp(0, reduceMotion ? -10 : -34, introProgress)}px, 0)`;

        phoneScreen.style.backgroundColor = progress >= 0.27 ? "#f7f6f2" : "#070708";
        searchUi.style.opacity = String(range(progress, 0.28, 0.38));
        typedCopy.style.maxWidth = `${Math.ceil(QUESTION.length * range(progress, 0.34, 0.65))}ch`;

        const revealPoints = [0.66, 0.73, 0.8, 0.87];
        resultItems.forEach((item, index) => {
          const itemProgress = range(progress, revealPoints[index] ?? 0.66, (revealPoints[index] ?? 0.66) + 0.06);
          const itemScale = index === resultItems.length - 1 ? lerp(0.94, 1, itemProgress) : 1;
          item.style.opacity = String(itemProgress);
          item.style.transform = `translate3d(0, ${lerp(reduceMotion ? 4 : 12, 0, itemProgress)}px, 0) scale(${itemScale})`;
        });

        const glowProgress = range(progress, 0.8, 0.94);
        phoneGlow.style.opacity = String(lerp(0.35, 0.9, glowProgress));
        phoneGlow.style.transform = `scale(${lerp(1, reduceMotion ? 1.06 : 1.18, glowProgress)})`;
        depthGrid.style.transform = `perspective(500px) rotateX(62deg) translate3d(0, ${lerp(23, reduceMotion ? 26 : 33, progress)}%, 0)`;

        if (manifesto && manifestoTrack) {
          const manifestoRect = manifesto.getBoundingClientRect();
          const manifestoProgress = clamp((window.innerHeight - manifestoRect.top) / (window.innerHeight + manifestoRect.height));
          const manifestoTarget = lerp(0, reduceMotion ? -20 : -32, manifestoProgress);
          manifestoOffset = lerp(manifestoOffset, manifestoTarget, reduceMotion ? 0.2 : 0.16);
          manifestoTrack.style.transform = `translate3d(${manifestoOffset}%,0,0)`;
          if (Math.abs(manifestoTarget - manifestoOffset) > 0.02) {
            mobileFrame = window.requestAnimationFrame(updateMobileStory);
          }
        }

        if (processList && processProgress) {
          const processRect = processList.getBoundingClientRect();
          const processAmount = clamp((window.innerHeight * 0.7 - processRect.top) / Math.max(1, processRect.height));
          processProgress.style.height = "100%";
          processProgress.style.transformOrigin = "top";
          processProgress.style.transform = `scaleY(${processAmount})`;
        }

        revealFallbackCheck();
      };

      const requestMobileUpdate = () => {
        if (mobileFrame) return;
        mobileFrame = window.requestAnimationFrame(updateMobileStory);
      };

      if (!CSS.supports("position", "sticky")) {
        showStaticStory();
      } else {
        window.addEventListener("scroll", requestMobileUpdate, { passive: true });
        window.addEventListener("resize", requestMobileUpdate, { passive: true });
        window.addEventListener("orientationchange", requestMobileUpdate, { passive: true });
        window.visualViewport?.addEventListener("resize", requestMobileUpdate, { passive: true });
        requestMobileUpdate();
      }

      const createEntrance = (
        element: HTMLElement,
        keyframes: Keyframe[],
        delay = 0,
        duration = 720,
        paused = false,
      ) => {
        if (typeof element.animate !== "function") return null;
        if (!paused) element.style.willChange = "transform, opacity";
        const animation = element.animate(keyframes, {
          duration,
          delay,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "both",
        });
        const clearAcceleration = () => element.style.removeProperty("will-change");
        animation.addEventListener("finish", clearAcceleration, { once: true });
        animation.addEventListener("cancel", clearAcceleration, { once: true });
        if (paused) {
          animation.pause();
          animation.currentTime = 0;
        }
        activeAnimations.push(animation);
        return animation;
      };

      const heroBaseDelay = reduceMotion ? 860 : 980;
      scope.querySelectorAll<HTMLElement>(".hero-word").forEach((element, index) => {
        createEntrance(
          element,
          [
            {
              transform: `translate3d(0,${reduceMotion ? 72 : 118}%,0)`,
              opacity: 0,
            },
            { transform: "translate3d(0,0,0)", opacity: 1 },
          ],
          heroBaseDelay + index * (reduceMotion ? 90 : 110),
          reduceMotion ? 780 : 920,
        );
      });
      scope.querySelectorAll<HTMLElement>(".hero-kicker, .scroll-hint").forEach((element, index) => {
        createEntrance(
          element,
          [
            { transform: `translate3d(-10px,${reduceMotion ? 24 : 32}px,0)`, opacity: 0 },
            { transform: "translate3d(0,0,0)", opacity: 1 },
          ],
          heroBaseDelay + 250 + index * 120,
          reduceMotion ? 620 : 720,
        );
      });

      const awarenessElements = Array.from(scope.querySelectorAll<HTMLElement>(".awareness-line > span"));
      const processElements = Array.from(scope.querySelectorAll<HTMLElement>(".process-step"));
      const revealElements = Array.from(scope.querySelectorAll<HTMLElement>(".reveal-up"));
      const revealTargets = Array.from(
        scope.querySelectorAll<HTMLElement>(".reveal-up, .awareness-line > span, .process-step"),
      );
      const revealAnimations = new WeakMap<Element, Animation>();
      const observed = new WeakSet<Element>();
      let revealObserver: IntersectionObserver | null = null;

      const playPreparedReveal = (element: HTMLElement) => {
        if (observed.has(element)) return;
        observed.add(element);
        const animation = revealAnimations.get(element);
        if (animation) {
          element.style.willChange = "transform, opacity";
          animation.play();
        }
        revealObserver?.unobserve(element);
      };

      if ("IntersectionObserver" in window) {
        revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) playPreparedReveal(entry.target as HTMLElement);
            });
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0.04 },
        );

        revealTargets.forEach((element) => {
          const horizontal = element.classList.contains("process-step");
          const awarenessLine = element.parentElement?.classList.contains("awareness-line");
          const startTransform = horizontal
            ? `translate3d(${reduceMotion ? 46 : 64}px,0,0)`
            : awarenessLine
              ? `translate3d(0,${reduceMotion ? 78 : 112}%,0)`
              : `translate3d(0,${reduceMotion ? 42 : 62}px,0)`;
          const sequenceDelay = awarenessLine
            ? Math.max(0, awarenessElements.indexOf(element)) * 95
            : horizontal
              ? Math.max(0, processElements.indexOf(element)) * 80
              : (Math.max(0, revealElements.indexOf(element)) % 3) * 55;
          const animation = createEntrance(
            element,
            [
              { transform: startTransform, opacity: awarenessLine ? 1 : 0 },
              { transform: "translate3d(0,0,0)", opacity: 1 },
            ],
            sequenceDelay,
            awarenessLine ? 880 : 760,
            true,
          );
          if (animation) revealAnimations.set(element, animation);
          revealObserver?.observe(element);
        });

        revealFallbackCheck = () => {
          revealTargets.forEach((element) => {
            if (observed.has(element)) return;
            const rect = element.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.9 && rect.bottom >= 0) playPreparedReveal(element);
          });
        };
        revealFallbackCheck();
      }

      return () => {
        cancelled = true;
        window.clearTimeout(loaderTimer);
        window.cancelAnimationFrame(refreshFrame);
        window.cancelAnimationFrame(mobileFrame);
        window.removeEventListener("scroll", requestMobileUpdate);
        window.removeEventListener("resize", requestMobileUpdate);
        window.removeEventListener("orientationchange", requestMobileUpdate);
        window.visualViewport?.removeEventListener("resize", requestMobileUpdate);
        revealObserver?.disconnect();
        activeAnimations.forEach((animation) => animation.cancel());
      };
    }

    let context: ReturnType<typeof gsap.context> | undefined;
    let media: ReturnType<typeof gsap.matchMedia> | undefined;

    const showStaticStory = () => {
      gsap.set(scope.querySelector(".phone-stage"), { clearProps: "transform" });
      gsap.set(scope.querySelector(".phone-screen"), { backgroundColor: "#f7f6f2" });
      gsap.set(scope.querySelector(".search-ui"), { opacity: 1 });
      gsap.set(scope.querySelector(".typed-copy"), { maxWidth: "100%" });
      gsap.set(scope.querySelectorAll(".search-results p"), { opacity: 1, y: 0, scale: 1 });
      gsap.set(
        scope.querySelectorAll(".hero-word, .hero-kicker, .scroll-hint, .reveal-up, .awareness-line > span, .process-step"),
        { clearProps: "transform,opacity" },
      );
    };

    try {
      media = gsap.matchMedia();
      context = gsap.context(() => {
        media?.add(
          "(min-width: 801px) and (hover: hover) and (pointer: fine)",
          () => {
            const mobile = false;
            const shortLandscape = false;
            const revealDistance = mobile ? 42 : 70;
            const exitScale = shortLandscape ? 1.8 : mobile ? 2.35 : 3.8;

            gsap.fromTo(
              ".hero-word",
              { yPercent: 118, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 1.08, stagger: 0.11, delay: 1.02, ease: "expo.out" },
            );

            gsap.fromTo(
              ".hero-kicker, .scroll-hint",
              { opacity: 0, x: -14, y: 28 },
              { opacity: 1, x: 0, y: 0, duration: 0.82, stagger: 0.18, delay: 1.48, ease: "power3.out" },
            );

            const phoneTimeline = gsap.timeline({
              scrollTrigger: {
                id: "efeito-phone-story",
                trigger: ".search-story",
                start: "top top",
                end: "bottom bottom",
                scrub: mobile ? 0.55 : 1,
                invalidateOnRefresh: true,
                fastScrollEnd: true,
              },
            });

            phoneTimeline
              .set(".search-ui", { opacity: 0 }, 0)
              .set(".typed-copy", { maxWidth: "0ch" }, 0)
              .set(".search-results p", { opacity: 0, y: 12 }, 0)
              .set(".result-4", { scale: 0.94 }, 0)
              .fromTo(
                ".phone-stage",
                { yPercent: mobile ? 62 : 90, rotateX: mobile ? 16 : 30, rotateY: mobile ? -14 : -28, rotateZ: mobile ? -4 : -8, scale: mobile ? 0.82 : 0.72 },
                { yPercent: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, ease: "none", duration: 0.28 },
              )
              .to(".story-intro", { opacity: 0, y: mobile ? -34 : -60, duration: 0.08 }, 0.18)
              .to(".phone-screen", { backgroundColor: "#f7f6f2", duration: 0.08 }, 0.27)
              .to(".search-ui", { opacity: 1, duration: 0.06 }, 0.3)
              .to(".typed-copy", { maxWidth: `${QUESTION.length}ch`, duration: 0.31, ease: "none" }, 0.34)
              .to(".result-1", { opacity: 1, y: 0, duration: 0.05 }, 0.68)
              .to(".result-2", { opacity: 1, y: 0, duration: 0.05 }, 0.75)
              .to(".result-3", { opacity: 1, y: 0, duration: 0.05 }, 0.82)
              .to(".result-4", { opacity: 1, y: 0, scale: 1, duration: 0.07 }, 0.89)
              .to(".phone-glow", { opacity: 0.9, scale: mobile ? 1.18 : 1.35, duration: 0.12 }, 0.84)
              .to(".phone-stage", { scale: exitScale, yPercent: -2, duration: 0.11, ease: "power2.in" }, 0.96);

            gsap.to(".depth-grid", {
              yPercent: mobile ? 10 : 18,
              ease: "none",
              scrollTrigger: { trigger: ".search-story", start: "top bottom", end: "bottom top", scrub: mobile ? 0.5 : true, invalidateOnRefresh: true },
            });

            gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((element) => {
              gsap.fromTo(
                element,
                { y: revealDistance + 18, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1.12,
                  ease: "expo.out",
                  immediateRender: true,
                  scrollTrigger: { trigger: element, start: mobile ? "top 94%" : "top 88%", once: true, invalidateOnRefresh: true },
                },
              );
            });

            gsap.fromTo(
              ".awareness-line > span",
              { yPercent: 120 },
              {
                yPercent: 0,
                duration: 1.16,
                stagger: 0.18,
                ease: "expo.out",
                immediateRender: true,
                scrollTrigger: { trigger: ".awareness", start: mobile ? "top 82%" : "top 58%", once: true, invalidateOnRefresh: true },
              },
            );

            gsap.to(".manifesto-track", {
              xPercent: -34,
              ease: "none",
              scrollTrigger: { trigger: ".manifesto", start: "top bottom", end: "bottom top", scrub: 1.15, invalidateOnRefresh: true },
            });

            gsap.fromTo(
              ".process-step",
              { opacity: 0, x: 82 },
              {
                opacity: 1,
                x: 0,
                stagger: 0.2,
                duration: 1.08,
                ease: "expo.out",
                immediateRender: true,
                scrollTrigger: { trigger: ".process-list", start: mobile ? "top 88%" : "top 75%", once: true, invalidateOnRefresh: true },
              },
            );

            gsap.to(".process-progress span", {
              height: "100%",
              ease: "none",
              scrollTrigger: { trigger: ".process-list", start: "top 70%", end: "bottom 70%", scrub: mobile ? 0.45 : true, invalidateOnRefresh: true },
            });
          },
        );
      }, scope);
    } catch {
      scope.classList.add("motion-fallback");
      showStaticStory();
    }

    const delayedRefresh = window.setTimeout(refresh, 1150);
    window.addEventListener("load", refresh, { once: true });
    window.addEventListener("resize", refresh, { passive: true });
    window.addEventListener("orientationchange", refresh, { passive: true });
    document.fonts?.ready.then(() => {
      if (!cancelled) refresh();
    });

    return () => {
      cancelled = true;
      window.clearTimeout(loaderTimer);
      window.clearTimeout(delayedRefresh);
      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
      media?.revert();
      context?.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 800) setMenuOpen(false);
    };

    document.body.classList.add("menu-open");
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop, { passive: true });
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, [menuOpen]);

  useEffect(() => {
    const pointer = document.querySelector<HTMLElement>(".custom-cursor");
    if (!pointer || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const move = (event: PointerEvent) => {
      gsap.to(pointer, { x: event.clientX, y: event.clientY, duration: 0.22, ease: "power2.out" });
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      pointer.classList.toggle("is-active", Boolean(target.closest("a, button, [data-cursor]")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      pointer.classList.remove("is-active");
    };
  }, []);

  return (
    <main ref={root}>
      <div className={`loader ${loaded ? "is-hidden" : ""}`} aria-hidden="true">
        <div className="loader-mark"><span>EFEITO</span><span>WEB</span></div>
        <div className="loader-line"><span /></div>
        <p>CONSTRUINDO PRESENÇA DIGITAL</p>
      </div>

      <div className="custom-cursor" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Efeito Web — início">
          <span className="brand-orbit" />EFEITO<span>WEB</span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#solucao">Solução</a>
          <a href="#servicos">Serviços</a>
          <a href="#processo">Processo</a>
        </nav>
        <a className="header-cta magnetic" href="#contato">Iniciar projeto <span>↗</span></a>
        <button
          ref={menuButton}
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav id="mobile-navigation" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-label="Navegação mobile" aria-hidden={!menuOpen}>
          <a tabIndex={menuOpen ? 0 : -1} href="#solucao" onClick={() => setMenuOpen(false)}>Solução</a>
          <a tabIndex={menuOpen ? 0 : -1} href="#servicos" onClick={() => setMenuOpen(false)}>Serviços</a>
          <a tabIndex={menuOpen ? 0 : -1} href="#processo" onClick={() => setMenuOpen(false)}>Processo</a>
          <a tabIndex={menuOpen ? 0 : -1} href="#contato" onClick={() => setMenuOpen(false)}>Iniciar projeto</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        <div className="hero-data" aria-hidden="true"><span>17°01&apos;S</span><span>50°04&apos;W</span><span>ONLINE</span></div>
        <div className="hero-copy">
          <p className="eyebrow hero-kicker"><span /> Presença digital com estratégia</p>
          <h1 aria-label="Sua empresa existe. Mas ela aparece?">
            <span className="line"><span className="hero-word">Sua empresa</span></span>
            <span className="line"><span className="hero-word outline">existe.</span></span>
            <span className="line question"><span className="hero-word">Mas ela <em>aparece?</em></span></span>
          </h1>
        </div>
        <div className="scroll-hint"><span>Role para descobrir</span><ArrowDown size={16} /></div>
        <div className="hero-index">01 <span>/</span> 06</div>
      </section>

      <section className="search-story" aria-label="Descubra como sua empresa aparece no Google">
        <div className="sticky-scene">
          <div className="depth-grid" aria-hidden="true" />
          <div className="story-intro">
            <span>O PRIMEIRO CONTATO</span>
            <p>acontece antes<br />de você perceber.</p>
          </div>
          <div className="phone-glow" aria-hidden="true" />
          <div className="phone-stage">
            <div className="phone-side phone-side-left"><i /><i /></div>
            <div className="phone">
              <div className="phone-speaker" />
              <div className="phone-screen">
                <div className="search-ui">
                  <div className="mini-status"><span>9:41</span><span>● ◔ ▰</span></div>
                  <div className="search-brand"><span>E</span><span>f</span><span>e</span><span>i</span><span>t</span><span>o</span></div>
                  <div className="search-bar">
                    <span className="search-icon" />
                    <span className="typed-wrap"><span className="typed-copy">{QUESTION}</span></span>
                    <span className="typed-cursor" />
                  </div>
                  <div className="search-results">
                    <p className="result-1">Nada?</p>
                    <p className="result-2">Um perfil desatualizado?</p>
                    <p className="result-3">Informações incompletas?</p>
                    <p className="result-4">Ou o seu concorrente?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="scene-label">PRESENÇA DIGITAL / 2026</p>
        </div>
      </section>

      <section className="first-transition" id="solucao">
        <p>A ausência também comunica.</p>
        <h2>Ser encontrado<br />é o começo.</h2>
      </section>

      <section className="awareness section-pad">
        <div className="section-marker"><span>02</span><i /> O que muda</div>
        <div className="awareness-copy">
          <div className="awareness-line"><span>Não basta ter</span></div>
          <div className="awareness-line"><span>uma empresa.</span></div>
          <div className="awareness-line accent-line"><span>Ela precisa ser <em>encontrada.</em></span></div>
          <div className="awareness-line small-line"><span>Precisa transmitir confiança.</span></div>
          <div className="awareness-line small-line offset-line"><span>Precisa transformar visitas em oportunidades.</span></div>
        </div>
        <aside className="awareness-note reveal-up">
          <span>VISIBILIDADE É O PRIMEIRO PASSO</span>
          <p>Se o seu negócio não ocupa o próprio espaço no digital, outra marca ocupa.</p>
        </aside>
      </section>

      <section className="solution-intro section-pad">
        <div className="solution-orbit" aria-hidden="true"><span /><i /><b>EW</b></div>
        <div className="solution-copy">
          <p className="eyebrow reveal-up"><span /> É aqui que a Efeito Web entra</p>
          <h2 className="reveal-up">Construímos presença<br />para quem quer <em>avançar.</em></h2>
          <div className="solution-columns reveal-up">
            <p>Nós construímos sites que posicionam empresas, fortalecem marcas e transformam presença digital em oportunidades reais.</p>
            <p>Criamos experiências profissionais, rápidas, responsivas e estratégicas para negócios que querem aparecer, transmitir autoridade e conquistar clientes.</p>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-track" aria-hidden="true">
          <span>EFEITO VISUAL</span><i>COM</i><span>ESTRATÉGIA</span><b>•</b><span>EFEITO VISUAL</span><i>COM</i><span>ESTRATÉGIA</span>
        </div>
        <div className="manifesto-body section-pad">
          <p className="manifesto-index">MANIFESTO / 03</p>
          <div className="manifesto-lines">
            <p className="reveal-up">Seu site não deve ser <span>apenas bonito.</span></p>
            <p className="reveal-up align-right">Ele precisa <em>comunicar.</em></p>
            <p className="reveal-up">Convencer.</p>
            <p className="reveal-up align-center">Ser lembrado.</p>
          </div>
          <div className="manifesto-signoff reveal-up">
            <span>Tecnologia com propósito.</span>
            <span>Presença que gera resultado.</span>
          </div>
        </div>
      </section>

      <section className="services section-pad" id="servicos">
        <div className="services-heading">
          <div>
            <div className="section-marker"><span>03</span><i /> O que construímos</div>
            <h2 className="reveal-up">Soluções que<br /><em>movem negócios.</em></h2>
          </div>
          <p className="reveal-up">Do primeiro contato à publicação, cada decisão visual e técnica existe para reforçar sua marca e facilitar a próxima ação do cliente.</p>
        </div>

        <div className={`service-visual service-visual--${activeService + 1}`} aria-hidden="true">
          <span className="visual-ring" /><span className="visual-grid" />
          <strong>{SERVICES[activeService].tag}</strong>
        </div>

        <div className="service-list">
          {SERVICES.map((service, index) => (
            <article
              className={`service-row ${activeService === index ? "is-active" : ""}`}
              key={service.number}
              role="button"
              aria-pressed={activeService === index}
              onPointerEnter={() => setActiveService(index)}
              onClick={() => setActiveService(index)}
              onFocus={() => setActiveService(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveService(index);
                }
              }}
              tabIndex={0}
            >
              <span className="service-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
              <span className="service-arrow"><ArrowUpRight size={24} /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="comparison section-pad" aria-labelledby="comparison-title">
        <div className="comparison-head">
          <div className="section-marker"><span>04</span><i /> A transformação</div>
          <h2 id="comparison-title" className="reveal-up">O mesmo negócio.<br /><em>Outra percepção.</em></h2>
          <p>Arraste para comparar</p>
        </div>

        <div className="comparison-stage">
          <div className="comparison-pane comparison-before">
            <div className="mock-browser mock-before">
              <div className="mock-bar"><i /><i /><i /><span /></div>
              <div className="bad-site"><b>EMPRESA</b><nav>Início | Empresa | Serviços | Contato</nav><h3>Bem-vindo ao nosso site</h3><p>Qualidade e compromisso há muitos anos.</p><span className="mock-button">Saiba mais</span><div className="bad-boxes"><i /><i /><i /></div></div>
            </div>
            <div className="state-label"><span>ANTES</span><p>Genérico. Confuso. Esquecível.</p></div>
          </div>

          <div className="comparison-pane comparison-after" style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }}>
            <div className="mock-browser mock-after">
              <div className="mock-bar"><i /><i /><i /><span /></div>
              <div className="good-site"><header><b>MARCA<span>+</span></b><small>ESTRATÉGIA / DIGITAL</small></header><p>PRESENÇA QUE POSICIONA</p><h3>Seu negócio,<br /><em>impossível de ignorar.</em></h3><span className="mock-button">CONHEÇA A EXPERIÊNCIA ↗</span><div className="good-glow" /></div>
            </div>
            <div className="state-label after-label"><span>DEPOIS</span><p>Profissional. Claro. Memorável.</p></div>
          </div>

          <div className="comparison-handle" style={{ left: `${comparison}%` }}><span>↔</span></div>
          <input
            aria-label="Comparar presença digital antes e depois"
            type="range"
            min="12"
            max="88"
            value={comparison}
            onChange={(event) => setComparison(Number(event.target.value))}
          />
        </div>
        <div className="comparison-benefits reveal-up">
          {["Identidade profissional", "Comunicação clara", "Site responsivo", "Carregamento rápido", "Mais autoridade"].map((item) => <span key={item}><Check size={13} />{item}</span>)}
        </div>
      </section>

      <section className="process section-pad" id="processo">
        <div className="process-heading">
          <div className="section-marker"><span>05</span><i /> Como fazemos</div>
          <h2 className="reveal-up">Da ideia ao<br /><em>efeito.</em></h2>
          <p className="reveal-up">Um processo claro, próximo e estratégico. Você acompanha cada escolha que transforma sua presença digital.</p>
        </div>
        <div className="process-wrap">
          <div className="process-progress" aria-hidden="true"><span /></div>
          <div className="process-list">
            {PROCESS.map((step) => (
              <article className="process-step" key={step.number}>
                <span>{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
                <i />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="work section-pad" id="projetos">
        <div className="work-heading">
          <div className="section-marker"><span>06</span><i /> Projetos selecionados</div>
          <h2 className="reveal-up">O trabalho fala<br /><em>quando ganha forma.</em></h2>
        </div>
        <div className="work-grid">
          <article
            className={`project-panel project-a ${activeProject === 0 ? "is-active" : ""}`}
            data-cursor="VER"
            role="button"
            tabIndex={0}
            aria-pressed={activeProject === 0}
            onClick={() => setActiveProject(activeProject === 0 ? null : 0)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveProject(activeProject === 0 ? null : 0);
              }
            }}
          >
            <div className="project-art"><span>01</span><div className="project-ui"><i /><i /><i /></div><b>IDENTIDADE<br />EM MOVIMENTO</b></div>
            <div className="project-info"><div><span>ESTUDO AUTORAL / 2026</span><h3>Presença institucional</h3></div><Plus size={22} /></div>
          </article>
          <article
            className={`project-panel project-b ${activeProject === 1 ? "is-active" : ""}`}
            data-cursor="VER"
            role="button"
            tabIndex={0}
            aria-pressed={activeProject === 1}
            onClick={() => setActiveProject(activeProject === 1 ? null : 1)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveProject(activeProject === 1 ? null : 1);
              }
            }}
          >
            <div className="project-art"><span>02</span><div className="project-orbit"><i /><i /></div><b>CONVERSÃO<br />COM CLAREZA</b></div>
            <div className="project-info"><div><span>ESTUDO AUTORAL / 2026</span><h3>Landing page estratégica</h3></div><Plus size={22} /></div>
          </article>
        </div>
        <p className="project-note">Painéis conceituais preparados para receber os projetos reais da Efeito Web — sem métricas ou empresas fictícias.</p>
      </section>

      <section className="final-cta" id="contato">
        <div className="cta-orbit" aria-hidden="true"><span /><i /><b /></div>
        <p className="eyebrow reveal-up"><span /> Sua próxima presença começa aqui</p>
        <h2 className="reveal-up">Quando pesquisarem<br />sua empresa, <em>o que<br />vão encontrar?</em></h2>
        <p className="cta-sub reveal-up">Vamos construir uma presença digital à altura do seu negócio.</p>
        <div className="cta-actions reveal-up">
          <a className="primary-cta" href="https://wa.me/5517991757562" target="_blank" rel="noreferrer" data-cursor="FALAR">Quero transformar minha presença <ArrowUpRight size={22} /></a>
          <a className="secondary-cta" href="https://wa.me/5517991757562" target="_blank" rel="noreferrer">Falar com a Efeito Web <span>↗</span></a>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <a className="footer-brand" href="#inicio"><span>EFEITO</span>WEB<i /></a>
          <p>Construindo presença.<br />Criando efeito.</p>
        </div>
        <div className="footer-grid">
          <div><span>CONTATO</span><a href="tel:+5517991757562">+55 17 99175-7562</a><a href="https://wa.me/5517991757562" target="_blank" rel="noreferrer">WhatsApp ↗</a></div>
          <div><span>NAVEGAÇÃO</span><a href="#solucao">Solução</a><a href="#servicos">Serviços</a><a href="#processo">Processo</a><a href="#projetos">Projetos</a></div>
          <div><span>ATENDIMENTO</span><p>Nhandeara — SP</p><p>Projetos em todo o Brasil</p></div>
          <div><span>SOCIAL</span><a href="#contato">Instagram ↗</a><a href="#contato">LinkedIn ↗</a><a href="#contato">Behance ↗</a></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Efeito Web</span><a href="#contato">Política de privacidade</a><span>DESIGN • ESTRATÉGIA • TECNOLOGIA</span></div>
      </footer>
    </main>
  );
}
