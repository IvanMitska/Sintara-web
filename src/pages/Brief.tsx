import React, { useState, useEffect, useRef, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaArrowRight, FaPaperPlane, FaCheck,
  FaBuilding, FaUsers, FaBullseye, FaSitemap, FaPalette,
  FaCog, FaCalendarAlt, FaCommentAlt, FaLaptopCode
} from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import NavBar from '../components/NavBar';

// ============ STYLED COMPONENTS ============

const PageWrapper = styled.div`
  min-height: 100vh;
  height: auto;
  background: var(--paper);
  color: var(--ink);
  position: relative;

  @media (max-width: 768px) {
    overflow: visible;
    touch-action: pan-y pinch-zoom;
  }
`;

/**
 * Top hero band — light surface matching the form area below. Dark
 * hero was tried (matching Work/Services/About/Contact) but it created
 * a stark dark→light seam right above the form fields and made the
 * page feel like "a decorative wall, then a form" rather than a
 * cohesive work surface. For a form-driven page, one calm light
 * surface from top to bottom reads as premium and focused (think
 * Linear / Stripe / Vercel signup flows). The new typography stays
 * (display title, eyebrow Logo) so it still feels "in our style".
 *
 * Compact top padding fixes the "feels pushed down" complaint.
 */
const BriefHero = styled.section`
  /* Tight padding — Brief is a working form. The header sits above
     the form fields but must NOT eat half the viewport. */
  padding: clamp(96px, 12vh, 130px) clamp(20px, 5vw, 80px)
    clamp(24px, 3.5vh, 40px);

  @media (max-width: 768px) {
    padding: clamp(84px, 10vh, 100px) 20px 24px;
  }
`;

const BriefHeroInner = styled.div`
  /* Aligned with BriefContainer's max-width so the page reads as
     one column: title + form sit in the same horizontal band. */
  max-width: 1280px;
  margin: 0 auto;
`;

const BriefContainer = styled.div`
  /* Tighter container — was 1480px which let the form stretch to
     ~1000px and feel sparse on wide screens. 1280px keeps it focused
     and readable, with the right-side empty space tightened up. */
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 40px 120px;
  position: relative;
  z-index: 1;
  display: grid;
  /* Narrower sidebar (was 320px) + tighter gap so the form column
     stays generous without becoming a wide wall of fields. */
  grid-template-columns: 260px 1fr;
  gap: 64px;

  @media (max-width: 1100px) {
    grid-template-columns: 220px 1fr;
    gap: 40px;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 0 20px 80px;
  }
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 11px;
  background: transparent;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
  height: 44px;
  padding: 0 22px;
  color: var(--ink);
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background 0.4s var(--ease-snap),
    color 0.4s var(--ease-snap),
    border-color 0.4s var(--ease-snap),
    transform 0.4s var(--ease-expo);
  margin-bottom: clamp(24px, 4vh, 40px);

  svg {
    font-size: 11px;
    transition: transform 0.4s var(--ease-expo);
  }

  &:hover {
    transform: translateY(-2px);
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
  }
  &:hover svg {
    transform: translateX(-4px);
  }
`;

/* Eyebrow-style label — same dot+caps pattern as the eyebrows on
   other inner pages, but in muted ink on light so it doesn't shout
   above the form. */
const Logo = styled.div`
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--muted);
  margin-bottom: 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }
`;

/* Compact display title — was clamp(3rem, 9.5vw, 8.5rem) which
   produced ~180px on desktop and ate half the viewport. Brief is a
   form: the title should be prominent but not cinematic. Capped at
   ~72px keeps it editorial without dominating. */
const Title = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 4.8vw, 4.5rem);
  font-weight: 400;
  line-height: 0.96;
  letter-spacing: -0.035em;
  color: var(--ink);
  margin: 0 0 16px;
  text-transform: none;
`;

const Subtitle = styled(motion.p)`
  font-family: var(--font-grotesk);
  font-size: clamp(0.9375rem, 1.05vw, 1.0625rem);
  color: var(--muted);
  max-width: 560px;
  margin: 0;
  line-height: 1.5;
`;

// ─── Sidebar ────────────────────────────────────────────────────────

const Sidebar = styled.aside`
  position: relative;

  @media (max-width: 900px) {
    display: contents;
  }
`;

/**
 * Sticky frame so the step navigation always reads while scrolling
 * the form. On small viewports it falls back to a horizontal pill row
 * pinned under the hero (see SidebarStrip below — used by JSX as the
 * mobile fallback).
 */
const SidebarSticky = styled.div`
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 900px) {
    display: none;
  }
`;

/**
 * Big editorial step counter — the single most prominent element of
 * the sidebar. Tells the reader where they are at a glance.
 */
const StepCounter = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--bone-line);
`;

const BigNumber = styled.div`
  font-family: var(--font-display);
  /* Slightly smaller — was clamp(4rem, 7vw, 6rem) which dominated
     the sidebar column. clamp(3rem, 5.4vw, 4.5rem) is still big
     enough to anchor the column without shouting. */
  font-size: clamp(3rem, 5.4vw, 4.5rem);
  font-weight: 400;
  line-height: 0.85;
  letter-spacing: -0.05em;
  color: var(--ink);
`;

const NumberMeta = styled.div`
  font-family: var(--font-grotesk);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  gap: 4px;

  .of {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }
`;

const SidebarProgress = styled.div<{ $progress: number }>`
  position: relative;
  height: 2px;
  background: var(--bone-line);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent);
    transform: scaleX(${({ $progress }) => $progress / 100});
    transform-origin: left;
    transition: transform 0.6s var(--ease-expo);
  }
`;

const StepNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/**
 * Vertical step row — number / dot / icon + label. Shows three states:
 * completed (purple dot), current (accent bg pill), upcoming (muted).
 */
const NavStep = styled.button<{ $active: boolean; $completed: boolean }>`
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  gap: 14px;
  padding: 12px 12px;
  margin: 0 -12px;
  background: ${({ $active }) =>
    $active ? 'rgba(124, 58, 237, 0.08)' : 'transparent'};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-grotesk);
  transition: background 0.3s var(--ease-snap);

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(124, 58, 237, 0.08)' : 'rgba(10, 10, 12, 0.04)'};
  }

  .marker {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: ${({ $active, $completed }) =>
      $active ? 'var(--accent)' : $completed ? 'var(--accent)' : 'var(--muted)'};
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .check {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    display: inline-grid;
    place-items: center;
    font-size: 8px;
  }

  .body {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.875rem;
    font-weight: ${({ $active }) => ($active ? 600 : 500)};
    color: ${({ $active, $completed }) =>
      $active ? 'var(--ink)' : $completed ? 'var(--ink)' : 'var(--muted)'};
  }

  .body svg {
    font-size: 12px;
    color: ${({ $active, $completed }) =>
      $active ? 'var(--accent)' : $completed ? 'var(--accent)' : 'var(--muted)'};
    opacity: ${({ $active, $completed }) => ($active || $completed ? 1 : 0.6)};
  }
`;

const Estimate = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #fafafa;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
  font-family: var(--font-grotesk);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--muted);
  align-self: flex-start;

  strong {
    color: var(--ink);
    font-weight: 600;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.12);
  }
`;

/**
 * Horizontal scroll strip used only on small screens — falls back from
 * the vertical sidebar nav. Same chips as before but compact.
 */
const SidebarStrip = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 0 12px;
    margin-bottom: 4px;

    &::-webkit-scrollbar {
      height: 3px;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--bone-line);
      border-radius: 2px;
    }
  }
`;

const StripItem = styled.button<{ $active: boolean; $completed: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: ${({ $active, $completed }) =>
    $active ? 'var(--accent)' : $completed ? '#EFE4FF' : '#fff'};
  border: 1px solid
    ${({ $active, $completed }) =>
      $active ? 'var(--accent)' : $completed ? '#EFE4FF' : 'var(--bone-line)'};
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ $active, $completed }) =>
    $active ? '#fff' : $completed ? 'var(--accent)' : 'var(--muted)'};
  transition:
    background 0.25s var(--ease-snap),
    color 0.25s var(--ease-snap),
    border-color 0.25s var(--ease-snap);

  svg {
    font-size: 11px;
  }
`;

// ─── Form Card ─────────────────────────────────────────────────────

/**
 * Form card. Transparent — sits directly on --paper, no card chrome.
 * Removing the white box-on-paper kills one of the competing surfaces
 * that made Brief read as "a generic SaaS form on our site". The
 * content (typography + form controls) carries the structure now.
 *
 * Two CSS-only flourishes kept from the original:
 *  • A radial cursor glow follows the mouse (driven by --cursor-x/y
 *    set via onMouseMove on the JSX side). Premium "live" feel.
 *  • CSS counters number every Label inside the card automatically —
 *    `Q01 ─── Company name`. Resets per step. No JSX changes needed.
 */
const FormCard = styled(motion.div)`
  background: transparent;
  border: 0;
  border-radius: 0;
  padding: clamp(32px, 5vh, 56px) clamp(0px, 2vw, 24px)
    clamp(24px, 4vh, 48px);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  counter-reset: q;

  /* cursor-follow purple haze — only on viewports with a real pointer */
  &::before {
    content: '';
    position: absolute;
    pointer-events: none;
    inset: 0;
    background: radial-gradient(
      420px circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
      rgba(124, 58, 237, 0.05),
      transparent 55%
    );
    opacity: 0;
    transition: opacity 0.4s var(--ease-snap);
    z-index: 0;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (hover: none) {
    &::before {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 28px 0 24px;
  }
`;

const CardHeader = styled.div`
  position: relative;
  margin-bottom: 40px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--bone-line);

  @media (max-width: 768px) {
    margin-bottom: 28px;
    padding-bottom: 20px;
  }
`;

const CardEyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 16px;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  /* Bumped from clamp(2rem, 3.5vw, 3rem) — matches the editorial
     section heads on Services/About inner pages (clamp 2.25-4.5rem). */
  font-size: clamp(2.25rem, 4.4vw, 3.75rem);
  font-weight: 400;
  letter-spacing: -0.035em;
  line-height: 0.98;
  color: var(--ink);
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 16px;

  /* Hide legacy inline icons — we now use the editorial eyebrow above */
  svg {
    display: none;
  }
`;

const SectionSubtitle = styled.p`
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  color: var(--muted);
  margin: 0;
  line-height: 1.55;
  max-width: 56ch;
`;

/**
 * Background watermark — gigantic faded step number anchored to the
 * card's bottom-right. Brand-purple, 4% opacity. Pure editorial flair.
 */
const CardWatermark = styled.div`
  position: absolute;
  right: -20px;
  bottom: -60px;
  z-index: 0;
  pointer-events: none;
  user-select: none;
  font-family: var(--font-display);
  font-size: clamp(14rem, 28vw, 26rem);
  font-weight: 400;
  line-height: 0.8;
  letter-spacing: -0.07em;
  color: var(--accent);
  opacity: 0.04;

  @media (max-width: 768px) {
    right: -10px;
    bottom: -30px;
    font-size: 18rem;
  }
`;

const CardBody = styled.div`
  position: relative;
  z-index: 1;
`;

// Form Elements
const FormGroup = styled.div`
  /* More breathing — was 28px, makes fields feel less crammed. */
  margin-bottom: 36px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Slightly wider gap between paired fields. */
  gap: 28px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

/**
 * Editorial label — auto-numbered via CSS counters (resets per step
 * inside the FormCard). Renders as `Q01  COMPANY NAME *`. Previously
 * had a horizontal line filler after the text (`::after { flex: 1 }`),
 * but in a 2-column FormRow it created dense parallel rules across
 * every field — read as visual noise. The Q-number + caps text alone
 * carries the rhythm cleanly.
 */
const Label = styled.label`
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--ink);
  margin-bottom: 12px;
  counter-increment: q;

  &::before {
    content: 'Q' counter(q, decimal-leading-zero);
    font-feature-settings: 'tnum';
    color: var(--accent);
    font-weight: 600;
    letter-spacing: 0.08em;
  }
`;

const RequiredMark = styled.span`
  color: var(--accent);
  margin-left: 4px;
`;

/**
 * Underline-only input — feels like writing in a notebook rather than
 * filling a form. The static bone-line rail is the bottom border; on
 * focus an accent gradient "scribes" from left to right over it via
 * background-size animation. Keeps a single element for the JSX.
 */
const Input = styled.input`
  width: 100%;
  background-color: transparent;
  background-image: linear-gradient(var(--accent), var(--accent));
  background-size: 0% 1.5px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  border: 0;
  border-bottom: 1.5px solid var(--bone-line);
  border-radius: 0;
  padding: 14px 2px;
  font-family: var(--font-grotesk);
  font-size: 1.0625rem;
  color: var(--ink);
  caret-color: var(--accent);
  transition:
    border-color 0.25s var(--ease-snap),
    background-size 0.6s var(--ease-expo);

  &::placeholder {
    color: var(--muted);
    opacity: 0.55;
    transition: opacity 0.3s var(--ease-snap);
  }

  &:hover {
    border-color: var(--ink);
  }

  &:focus {
    outline: none;
    background-size: 100% 1.5px;
  }

  &:focus::placeholder {
    opacity: 0.35;
  }
`;

/**
 * Boxed textarea — for multi-line answers. Same hairline aesthetic as
 * Input but framed so it visually invites a longer answer.
 */
const Textarea = styled.textarea`
  width: 100%;
  background: transparent;
  border: 1px solid var(--bone-line);
  border-radius: 12px;
  padding: 16px 18px;
  font-family: var(--font-grotesk);
  font-size: 1rem;
  color: var(--ink);
  transition:
    border-color 0.25s var(--ease-snap),
    background 0.25s var(--ease-snap);
  resize: vertical;
  min-height: 132px;
  line-height: 1.55;

  &::placeholder {
    color: var(--muted);
    opacity: 0.6;
  }

  &:hover {
    border-color: var(--ink);
  }

  &:focus {
    outline: none;
    border-color: var(--accent);
    /* No heavy box-shadow ring — keeps the editorial restraint of the
       rest of the design system. */
  }
`;

// Checkbox Grid
const CheckboxGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns || 2}, 1fr);
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxItem = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: ${props => (props.$checked ? 'rgba(124, 58, 237, 0.08)' : 'transparent')};
  border: 1px solid ${props => (props.$checked ? 'var(--accent)' : 'var(--bone-line)')};
  border-radius: 999px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  /* Cleaner hover — border-only highlight, no lift/shadow. Matches the
     restrained hover language on Services/About row lists. */
  transition:
    background 0.3s var(--ease-snap),
    border-color 0.3s var(--ease-snap),
    color 0.3s var(--ease-snap);

  &:hover {
    border-color: var(--ink);
  }

  input {
    display: none;
  }
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid ${props => (props.$checked ? 'var(--accent)' : 'var(--bone-line)')};
  background: ${props => (props.$checked ? 'var(--accent)' : '#fff')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.2s var(--ease-snap),
    border-color 0.2s var(--ease-snap);
  flex-shrink: 0;

  svg {
    font-size: 10px;
    color: #fff;
    opacity: ${props => (props.$checked ? 1 : 0)};
  }
`;

const CheckboxLabel = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  color: var(--ink);
  line-height: 1.4;
`;

// Radio Group
const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const RadioItem = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: ${props => (props.$checked ? 'rgba(124, 58, 237, 0.08)' : 'transparent')};
  border: 1px solid ${props => (props.$checked ? 'var(--accent)' : 'var(--bone-line)')};
  border-radius: 999px;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition:
    background 0.3s var(--ease-snap),
    border-color 0.3s var(--ease-snap),
    color 0.3s var(--ease-snap);

  &:hover {
    border-color: var(--ink);
  }

  input {
    display: none;
  }
`;

const Radio = styled.div<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid ${props => (props.$checked ? 'var(--accent)' : 'var(--bone-line)')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s var(--ease-snap);

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    opacity: ${props => (props.$checked ? 1 : 0)};
    transform: ${props => (props.$checked ? 'scale(1)' : 'scale(0)')};
    transition: all 0.2s var(--ease-snap);
  }
`;

const RadioLabel = styled.span`
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  color: var(--ink);
`;

// Navigation Buttons
const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--bone-line);

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

/**
 * Step nav buttons — visually identical to our PillLink pill: 52px tall,
 * 28px horizontal padding, fully rounded, capslet typography, smooth
 * lift-on-hover. Primary = dark ink fill, ghost = outlined.
 */
const NavButton = styled.button<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  height: 52px;
  padding: 0 28px;
  border-radius: 999px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  cursor: pointer;
  position: relative;
  transition:
    background 0.4s var(--ease-snap),
    color 0.4s var(--ease-snap),
    border-color 0.4s var(--ease-snap),
    transform 0.4s var(--ease-expo);

  svg {
    font-size: 12px;
    transition: transform 0.45s var(--ease-expo);
  }

  ${props =>
    props.$primary
      ? `
    background: var(--ink);
    color: #fff;
    border: 1px solid var(--ink);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      background: var(--accent);
      border-color: var(--accent);
    }
    &:hover:not(:disabled) svg {
      transform: translateX(5px);
    }
    &:active:not(:disabled) {
      transform: scale(0.98);
    }
  `
      : `
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--bone-line);

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      border-color: var(--ink);
    }
    &:hover:not(:disabled) svg {
      transform: translateX(-4px);
    }
  `}

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// Success Screen
const SuccessScreen = styled(motion.div)`
  text-align: center;
  padding: clamp(72px, 14vh, 160px) 40px;
`;

const SuccessIcon = styled(motion.div)`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.08);
  border: 1.5px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 36px;

  svg {
    font-size: 32px;
    color: var(--accent);
  }
`;

const SuccessTitle = styled.h2`
  font-family: var(--font-display);
  /* Bigger display title — matches the closing CTA headlines on other
     inner pages (the "Let's work together" finale size). */
  font-size: clamp(2.5rem, 6.5vw, 5.5rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 0.96;
  color: var(--ink);
  margin: 0 0 22px;
`;

const SuccessText = styled.p`
  font-family: var(--font-grotesk);
  font-size: clamp(1.0625rem, 1.2vw, 1.25rem);
  color: var(--muted);
  margin: 0 auto 44px;
  line-height: 1.55;
  max-width: 540px;
`;

const ErrorMessage = styled(motion.div)`
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-left: 3px solid #dc2626;
  border-radius: 6px;
  padding: 14px 18px;
  margin-bottom: 24px;
  font-family: var(--font-grotesk);
  font-size: 0.9375rem;
  color: #991b1b;
  line-height: 1.5;
`;

// ─── Premium flourishes ────────────────────────────────────────────

/**
 * Top-of-viewport reading-progress bar — fills as the user advances
 * through steps. Sits above everything, fixed. The hairline divider
 * underneath grounds it to the page.
 */
const TopProgress = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 90;
  background: rgba(230, 230, 230, 0.6);
  pointer-events: none;
`;

const TopProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--accent) 0%,
    #a78bfa 50%,
    var(--accent) 100%
  );
  background-size: 200% 100%;
  transform-origin: left;
  box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
`;

/**
 * Auto-save pill — flashes "Saving…" briefly on each form change,
 * settles to "Saved · just now". Builds trust that nothing is lost.
 */
const AutoSave = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  margin-top: 18px;
  border: 1px solid var(--bone-line);
  border-radius: 999px;
  font-family: var(--font-grotesk);
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(6px);

  .pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: ${pulse} 2.4s var(--ease-snap) infinite;
  }

  &.saving .pulse {
    background: #f59e0b;
  }

  strong {
    color: var(--ink);
    font-weight: 600;
  }
`;

/**
 * Container for the BIG editorial step number that animates between
 * steps with a slot-machine y-slide. Each digit inside gets keyed
 * by its character so AnimatePresence can run an enter/exit per
 * digit — very studio-tier detail.
 */
const NumberSlot = styled.div`
  display: inline-flex;
  overflow: hidden;
  height: 0.85em;
  line-height: 0.85;
`;

const NumberDigit = styled(motion.span)`
  display: inline-block;
  font-variant-numeric: tabular-nums;
`;

// ============ TYPES ============

interface BriefData {
  // Product Type
  productType: string;

  // Company Info
  companyName: string;
  businessArea: string;
  contactPerson: string;
  phone: string;
  email: string;
  currentWebsite: string;
  companyDescription: string;
  competitiveAdvantages: string;

  // Target Audience
  targetAudience: string;
  problemSolved: string;

  // Goals
  siteGoals: string[];
  visitorActions: string;
  kpi: string;

  // Structure
  siteSections: string[];
  functionality: string[];

  // Design
  likedWebsites: string;
  whatLiked: string;
  whatDisliked: string;
  brandStyle: string;
  siteMood: string[];
  colorScheme: string;

  // Content
  contentProvider: string;
  mediaAssets: string[];

  // Technical
  platform: string[];
  domainHosting: string;
  domainName: string;
  technicalRequirements: string[];

  // Budget
  launchDate: string;
  budget: string;
  priority: string[];

  // Additional
  decisionMaker: string;
  preferredContact: string;
  additionalComments: string;
}

// ============ COMPONENT ============

const Brief: React.FC = memo(() => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto-save indicator state — flips to "saving" briefly after each
  // form mutation, then settles back to "saved". Pure UI signal — the
  // data lives in component state (no real persistence yet).
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Cursor position inside FormCard for the radial-glow effect.
  const cardRef = useRef<HTMLDivElement | null>(null);
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--cursor-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--cursor-y', `${e.clientY - rect.top}px`);
  };

  // Magnetic NEXT button — gentle tilt + translate toward the cursor.
  // Damped via spring so it never feels jumpy.
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const springX = useSpring(magnetX, { stiffness: 220, damping: 18 });
  const springY = useSpring(magnetY, { stiffness: 220, damping: 18 });
  const handleMagnetMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    magnetX.set((e.clientX - cx) * 0.25);
    magnetY.set((e.clientY - cy) * 0.4);
  };
  const handleMagnetLeave = () => {
    magnetX.set(0);
    magnetY.set(0);
  };

  const [formData, setFormData] = useState<BriefData>({
    productType: '',
    companyName: '',
    businessArea: '',
    contactPerson: '',
    phone: '',
    email: '',
    currentWebsite: '',
    companyDescription: '',
    competitiveAdvantages: '',
    targetAudience: '',
    problemSolved: '',
    siteGoals: [],
    visitorActions: '',
    kpi: '',
    siteSections: [],
    functionality: [],
    likedWebsites: '',
    whatLiked: '',
    whatDisliked: '',
    brandStyle: '',
    siteMood: [],
    colorScheme: '',
    contentProvider: '',
    mediaAssets: [],
    platform: [],
    domainHosting: '',
    domainName: '',
    technicalRequirements: [],
    launchDate: '',
    budget: '',
    priority: [],
    decisionMaker: '',
    preferredContact: '',
    additionalComments: ''
  });

  const t = language === 'ru' ? {
    back: 'На главную',
    title: 'Бриф на разработку',
    subtitle: 'Заполните форму, чтобы мы могли лучше понять ваш проект и подготовить точную оценку',
    next: 'Далее',
    prev: 'Назад',
    submit: 'Отправить бриф',
    stepEyebrow: 'Шаг',
    stepOf: 'из',
    estimatePrefix: '≈',
    estimateUnit: 'мин',
    estimateRemaining: 'осталось',
    requiredMark: '*',
    optionalLabel: 'Необязательно',
    sectionRoman: ['Один', 'Два', 'Три', 'Четыре', 'Пять', 'Шесть', 'Семь', 'Восемь', 'Девять'],

    // Steps
    step1: 'Продукт',
    step2: 'О компании',
    step3: 'Аудитория',
    step4: 'Цели',
    step5: 'Функционал',
    step6: 'Дизайн',
    step7: 'Техническое',
    step8: 'Сроки',
    step9: 'Контакты',

    // Step 1 - Product Type
    productTypeTitle: 'Тип продукта',
    productTypeSubtitle: 'Выберите, какой продукт вы хотите заказать',
    productType: 'Что вы хотите разработать?',
    productTypeOptions: [
      'Веб-сайт / Лендинг',
      'CRM / Веб-приложение',
      'Telegram бот',
      'Мобильное приложение',
      'Другое'
    ],

    // Step 2 - Company
    companyTitle: 'Информация о компании',
    companySubtitle: 'Расскажите о вашей компании, чтобы мы лучше понимали ваш бизнес',
    companyName: 'Название компании',
    businessArea: 'Сфера деятельности',
    contactPerson: 'Контактное лицо',
    phone: 'Телефон',
    email: 'Email',
    currentWebsite: 'Текущий сайт (если есть)',
    companyDescription: 'Описание компании и основных услуг/продуктов',
    competitiveAdvantages: 'Ваши конкурентные преимущества',

    // Step 2 - Audience
    audienceTitle: 'Целевая аудитория',
    audienceSubtitle: 'Опишите, для кого предназначен ваш продукт',
    targetAudience: 'Опишите целевую аудиторию (возраст, пол, интересы, география)',
    problemSolved: 'Какую проблему клиента решает ваш продукт/услуга?',

    // Step 4 - Goals
    goalsTitle: 'Цели и задачи проекта',
    goalsSubtitle: 'Определите, чего вы хотите достичь с помощью продукта',
    siteGoals: 'Основные цели проекта',
    visitorActions: 'Какие задачи должен решать продукт?',
    kpi: 'Как вы будете оценивать успешность? (KPI)',

    goalOptions: [
      'Привлечение новых клиентов',
      'Продажа товаров/услуг',
      'Автоматизация бизнес-процессов',
      'Управление клиентами (CRM)',
      'Сбор заявок/лидов',
      'Поддержка и консультирование клиентов',
      'Внутренняя автоматизация',
      'Аналитика и отчётность'
    ],

    // Step 5 - Functionality
    structureTitle: 'Функционал продукта',
    structureSubtitle: 'Выберите необходимые функции для вашего продукта',
    siteSections: 'Основные модули/разделы',
    functionality: 'Дополнительный функционал',

    sectionOptions: [
      'Главная страница / Дашборд',
      'Каталог услуг / товаров',
      'Личный кабинет',
      'Админ-панель',
      'Управление клиентами',
      'Управление заказами',
      'Статистика и аналитика',
      'Настройки и конфигурация',
      'Чат / Поддержка',
      'Уведомления'
    ],

    functionalityOptions: [
      'Форма обратной связи',
      'Онлайн-запись / бронирование',
      'Интеграция с Telegram',
      'Интеграция с CRM',
      'Интеграция с платежами',
      'Интеграция с 1C / учётными системами',
      'Онлайн-чат',
      'Push-уведомления',
      'Email-рассылки',
      'Отчёты и экспорт данных',
      'API для интеграций',
      'Мультиязычность'
    ],

    // Step 6 - Design
    designTitle: 'Дизайн и стиль',
    designSubtitle: 'Расскажите о ваших предпочтениях в дизайне',
    likedWebsites: 'Ссылки на примеры, которые вам нравятся (3-5 ссылок)',
    whatLiked: 'Что именно нравится в этих примерах?',
    whatDisliked: 'Что НЕ нравится и чего избегать?',
    brandStyle: 'Фирменный стиль',
    siteMood: 'Общее настроение продукта',
    colorScheme: 'Предпочтительная цветовая гамма',

    brandOptions: [
      'Есть брендбук',
      'Нужно разработать',
      'Только логотип',
      'Нет требований'
    ],

    moodOptions: [
      'Строгий, деловой',
      'Дружелюбный, тёплый',
      'Минималистичный',
      'Яркий, динамичный',
      'Премиальный, люксовый',
      'Современный, технологичный'
    ],

    // Step 6 - Content
    contentTitle: 'Контент',
    contentSubtitle: 'Определите источники контента для сайта',
    contentProvider: 'Кто готовит тексты для сайта?',
    mediaAssets: 'Фото и видео материалы',

    contentOptions: [
      'Заказчик предоставит',
      'Нужен копирайтер',
      'Совместная работа'
    ],

    mediaOptions: [
      'Есть готовые',
      'Нужна фотосъёмка',
      'Использовать стоковые',
      'Нужна видеосъёмка'
    ],

    // Step 7 - Technical
    technicalTitle: 'Технические требования',
    technicalSubtitle: 'Укажите технические предпочтения для проекта',
    platform: 'Предпочтения по платформе/CMS',
    domainHosting: 'Домен и хостинг',
    domainName: 'Доменное имя (если есть)',
    technicalRequirements: 'Дополнительные требования',

    platformOptions: [
      'React / Next.js',
      'Node.js',
      'Python',
      'На усмотрение разработчика'
    ],

    hostingOptions: [
      'Уже есть',
      'Нужно приобрести',
      'Нужна консультация'
    ],

    techRequirements: [
      'SEO-оптимизация',
      'Адаптив под мобильные',
      'Высокая скорость загрузки',
      'SSL-сертификат',
      'Интеграция с аналитикой',
      'Административная панель'
    ],

    // Step 8 - Timeline
    budgetTitle: 'Сроки и бюджет',
    budgetSubtitle: 'Укажите ваши ожидания по срокам',
    launchDate: 'Желаемый срок запуска проекта',
    budget: 'Бюджет проекта',
    priority: 'Приоритет проекта',

    budgetOptions: [
      'Обсуждается индивидуально'
    ],

    priorityOptions: [
      'Сроки',
      'Качество',
      'Бюджет'
    ],

    // Step 9 - Additional
    additionalTitle: 'Дополнительная информация',
    additionalSubtitle: 'Любая другая информация, которая поможет нам в работе',
    decisionMaker: 'Кто принимает решения по проекту',
    preferredContact: 'Предпочтительный способ связи',
    additionalComments: 'Дополнительные комментарии и пожелания',

    // Success
    successTitle: 'Бриф отправлен!',
    successText: 'Спасибо за заполнение брифа. Мы свяжемся с вами в ближайшее время для обсуждения деталей проекта.',
    backToHome: 'Вернуться на главную'
  } : {
    back: 'Home',
    title: 'Project Brief',
    subtitle: 'Fill out the form so we can better understand your project and provide an accurate estimate',
    next: 'Next',
    prev: 'Back',
    submit: 'Submit Brief',
    stepEyebrow: 'Step',
    stepOf: 'of',
    estimatePrefix: '≈',
    estimateUnit: 'min',
    estimateRemaining: 'remaining',
    requiredMark: '*',
    optionalLabel: 'Optional',
    sectionRoman: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'],

    // Steps
    step1: 'Product',
    step2: 'Company',
    step3: 'Audience',
    step4: 'Goals',
    step5: 'Features',
    step6: 'Design',
    step7: 'Technical',
    step8: 'Timeline',
    step9: 'Contact',

    // Step 1 - Product Type
    productTypeTitle: 'Product Type',
    productTypeSubtitle: 'Select what product you want to order',
    productType: 'What do you want to develop?',
    productTypeOptions: [
      'Website / Landing Page',
      'CRM / Web Application',
      'Telegram Bot',
      'Mobile Application',
      'Other'
    ],

    // Step 2 - Company
    companyTitle: 'Company Information',
    companySubtitle: 'Tell us about your company so we can better understand your business',
    companyName: 'Company Name',
    businessArea: 'Business Area',
    contactPerson: 'Contact Person',
    phone: 'Phone',
    email: 'Email',
    currentWebsite: 'Current Website (if any)',
    companyDescription: 'Company description and main services/products',
    competitiveAdvantages: 'Your competitive advantages',

    // Step 2 - Audience
    audienceTitle: 'Target Audience',
    audienceSubtitle: 'Describe who your product is designed for',
    targetAudience: 'Describe your target audience (age, gender, interests, geography)',
    problemSolved: 'What problem does your product/service solve for the customer?',

    // Step 4 - Goals
    goalsTitle: 'Project Goals & Objectives',
    goalsSubtitle: 'Define what you want to achieve with the product',
    siteGoals: 'Main project goals',
    visitorActions: 'What tasks should the product solve?',
    kpi: 'How will you measure success? (KPI)',

    goalOptions: [
      'Attracting new clients',
      'Sales of goods/services',
      'Business process automation',
      'Customer management (CRM)',
      'Lead generation',
      'Customer support & consulting',
      'Internal automation',
      'Analytics & reporting'
    ],

    // Step 5 - Functionality
    structureTitle: 'Product Features',
    structureSubtitle: 'Select the required features for your product',
    siteSections: 'Main modules/sections',
    functionality: 'Additional functionality',

    sectionOptions: [
      'Home page / Dashboard',
      'Services / Products catalog',
      'Personal account',
      'Admin panel',
      'Customer management',
      'Order management',
      'Statistics & analytics',
      'Settings & configuration',
      'Chat / Support',
      'Notifications'
    ],

    functionalityOptions: [
      'Contact form',
      'Online booking',
      'Telegram integration',
      'CRM integration',
      'Payment integration',
      '1C / accounting integration',
      'Online chat',
      'Push notifications',
      'Email newsletters',
      'Reports & data export',
      'API for integrations',
      'Multi-language'
    ],

    // Step 6 - Design
    designTitle: 'Design & Style',
    designSubtitle: 'Tell us about your design preferences',
    likedWebsites: 'Links to examples you like (3-5 links)',
    whatLiked: 'What exactly do you like about these examples?',
    whatDisliked: 'What do you NOT like and what to avoid?',
    brandStyle: 'Brand style',
    siteMood: 'Overall product mood',
    colorScheme: 'Preferred color scheme',

    brandOptions: [
      'Have brand book',
      'Need to develop',
      'Logo only',
      'No requirements'
    ],

    moodOptions: [
      'Strict, business-like',
      'Friendly, warm',
      'Minimalist',
      'Bright, dynamic',
      'Premium, luxury',
      'Modern, tech-focused'
    ],

    // Step 6 - Content
    contentTitle: 'Content',
    contentSubtitle: 'Define content sources for the website',
    contentProvider: 'Who prepares the texts for the website?',
    mediaAssets: 'Photo and video materials',

    contentOptions: [
      'Client will provide',
      'Need a copywriter',
      'Joint work'
    ],

    mediaOptions: [
      'Have ready materials',
      'Need photo shooting',
      'Use stock photos',
      'Need video shooting'
    ],

    // Step 7 - Technical
    technicalTitle: 'Technical Requirements',
    technicalSubtitle: 'Specify your technical preferences for the project',
    platform: 'Platform/CMS preferences',
    domainHosting: 'Domain and hosting',
    domainName: 'Domain name (if any)',
    technicalRequirements: 'Additional requirements',

    platformOptions: [
      'React / Next.js',
      'Node.js',
      'Python',
      'Developer\'s choice'
    ],

    hostingOptions: [
      'Already have',
      'Need to purchase',
      'Need consultation'
    ],

    techRequirements: [
      'SEO optimization',
      'Mobile responsive',
      'Fast loading speed',
      'SSL certificate',
      'Analytics integration',
      'Admin panel'
    ],

    // Step 8 - Budget
    budgetTitle: 'Timeline & Budget',
    budgetSubtitle: 'Specify your timeline and budget expectations',
    launchDate: 'Desired launch date',
    budget: 'Project budget',
    priority: 'Project priority',

    budgetOptions: [
      'Negotiable'
    ],

    priorityOptions: [
      'Timeline',
      'Quality',
      'Budget'
    ],

    // Step 9 - Additional
    additionalTitle: 'Additional Information',
    additionalSubtitle: 'Any other information that will help us with the project',
    decisionMaker: 'Who makes project decisions',
    preferredContact: 'Preferred contact method',
    additionalComments: 'Additional comments and wishes',

    // Success
    successTitle: 'Brief Submitted!',
    successText: 'Thank you for filling out the brief. We will contact you shortly to discuss the project details.',
    backToHome: 'Back to Home'
  };

  const steps = [
    { icon: FaLaptopCode, label: t.step1 },  // Product Type
    { icon: FaBuilding, label: t.step2 },     // Company
    { icon: FaUsers, label: t.step3 },        // Audience
    { icon: FaBullseye, label: t.step4 },     // Goals
    { icon: FaSitemap, label: t.step5 },      // Functionality
    { icon: FaPalette, label: t.step6 },      // Design
    { icon: FaCog, label: t.step7 },          // Technical
    { icon: FaCalendarAlt, label: t.step8 },  // Timeline
    { icon: FaCommentAlt, label: t.step9 },   // Contact
  ];

  const handleInputChange = (field: keyof BriefData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof BriefData, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleRadioChange = (field: keyof BriefData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Flash the auto-save indicator briefly whenever the user mutates
  // the form. The first render is skipped so it doesn't fire on mount.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaveStatus('saving');
    const id = window.setTimeout(() => setSaveStatus('saved'), 700);
    return () => window.clearTimeout(id);
  }, [formData]);

  // Keyboard shortcut: Cmd/Ctrl+Enter advances to the next step from
  // anywhere on the page (including textarea focus). Power-user nicety.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // Split text into chunks respecting Telegram's 4096 char limit
  const splitIntoChunks = (text: string, maxLength: number = 4000): string[] => {
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    const lines = text.split('\n');
    let currentChunk = '';

    for (const line of lines) {
      // If single line exceeds max, split it by characters
      if (line.length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        // Split long line into smaller pieces
        for (let i = 0; i < line.length; i += maxLength - 50) {
          chunks.push(line.substring(i, i + maxLength - 50));
        }
        continue;
      }

      if ((currentChunk + '\n' + line).length > maxLength) {
        chunks.push(currentChunk.trim());
        currentChunk = line;
      } else {
        currentChunk = currentChunk ? currentChunk + '\n' + line : line;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  };

  const formatBriefForTelegram = (): string => {
    const sections = [];

    sections.push(`📋 *НОВЫЙ БРИФ*\n`);

    // Product Type
    if (formData.productType) sections.push(`🎯 *Тип продукта:* ${formData.productType}\n`);

    // Company Info
    sections.push(`*1. Информация о компании*`);
    if (formData.companyName) sections.push(`• Компания: ${formData.companyName}`);
    if (formData.businessArea) sections.push(`• Сфера: ${formData.businessArea}`);
    if (formData.contactPerson) sections.push(`• Контакт: ${formData.contactPerson}`);
    if (formData.phone) sections.push(`• Телефон: ${formData.phone}`);
    if (formData.email) sections.push(`• Email: ${formData.email}`);
    if (formData.currentWebsite) sections.push(`• Текущий сайт: ${formData.currentWebsite}`);
    if (formData.companyDescription) sections.push(`• Описание: ${formData.companyDescription}`);
    if (formData.competitiveAdvantages) sections.push(`• Преимущества: ${formData.competitiveAdvantages}`);

    // Target Audience
    sections.push(`\n*2. Целевая аудитория*`);
    if (formData.targetAudience) sections.push(`• ЦА: ${formData.targetAudience}`);
    if (formData.problemSolved) sections.push(`• Решаемая проблема: ${formData.problemSolved}`);

    // Goals
    sections.push(`\n*3. Цели и задачи*`);
    if (formData.siteGoals.length) sections.push(`• Цели: ${formData.siteGoals.join(', ')}`);
    if (formData.visitorActions) sections.push(`• Действия: ${formData.visitorActions}`);
    if (formData.kpi) sections.push(`• KPI: ${formData.kpi}`);

    // Structure
    sections.push(`\n*4. Структура*`);
    if (formData.siteSections.length) sections.push(`• Разделы: ${formData.siteSections.join(', ')}`);
    if (formData.functionality.length) sections.push(`• Функционал: ${formData.functionality.join(', ')}`);

    // Design
    sections.push(`\n*5. Дизайн*`);
    if (formData.likedWebsites) sections.push(`• Референсы: ${formData.likedWebsites}`);
    if (formData.whatLiked) sections.push(`• Нравится: ${formData.whatLiked}`);
    if (formData.whatDisliked) sections.push(`• Не нравится: ${formData.whatDisliked}`);
    if (formData.brandStyle) sections.push(`• Стиль: ${formData.brandStyle}`);
    if (formData.siteMood.length) sections.push(`• Настроение: ${formData.siteMood.join(', ')}`);
    if (formData.colorScheme) sections.push(`• Цвета: ${formData.colorScheme}`);

    // Technical
    sections.push(`\n*6. Техническое*`);
    if (formData.platform.length) sections.push(`• Платформа: ${formData.platform.join(', ')}`);
    if (formData.domainHosting) sections.push(`• Домен/хостинг: ${formData.domainHosting}`);
    if (formData.domainName) sections.push(`• Домен: ${formData.domainName}`);
    if (formData.technicalRequirements.length) sections.push(`• Требования: ${formData.technicalRequirements.join(', ')}`);

    // Budget
    sections.push(`\n*7. Сроки и бюджет*`);
    if (formData.launchDate) sections.push(`• Срок: ${formData.launchDate}`);
    if (formData.budget) sections.push(`• Бюджет: ${formData.budget}`);
    if (formData.priority.length) sections.push(`• Приоритет: ${formData.priority.join(', ')}`);

    // Additional
    sections.push(`\n*8. Дополнительно*`);
    if (formData.decisionMaker) sections.push(`• ЛПР: ${formData.decisionMaker}`);
    if (formData.preferredContact) sections.push(`• Связь: ${formData.preferredContact}`);
    if (formData.additionalComments) sections.push(`• Комментарии: ${formData.additionalComments}`);

    return sections.join('\n');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Helper to send a single message with retry on rate limit
    const sendTelegramMessage = async (
      token: string,
      chatId: string,
      text: string,
      retries = 3
    ): Promise<void> => {
      for (let attempt = 0; attempt < retries; attempt++) {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
          })
        });

        if (response.ok) return;

        const errorData = await response.json().catch(() => ({}));

        // Handle rate limiting (429 Too Many Requests)
        if (response.status === 429) {
          const retryAfter = errorData.parameters?.retry_after || 5;
          console.log(`Rate limited, waiting ${retryAfter}s...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }

        throw new Error(errorData.description || 'Failed to send to Telegram');
      }
      throw new Error('Max retries exceeded');
    };

    try {
      const message = formatBriefForTelegram();
      let chunks = splitIntoChunks(message);

      // Limit to max 10 parts to avoid extreme cases
      const MAX_PARTS = 10;
      if (chunks.length > MAX_PARTS) {
        chunks = chunks.slice(0, MAX_PARTS);
        chunks[MAX_PARTS - 1] += '\n\n⚠️ _Сообщение было сокращено из-за большого объёма_';
      }

      // Send to Telegram
      const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
      const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

      if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        // Send all chunks sequentially
        for (let i = 0; i < chunks.length; i++) {
          const chunkText = chunks.length > 1
            ? `${i === 0 ? '' : `📋 *БРИФ (часть ${i + 1}/${chunks.length})*\n\n`}${chunks[i]}`
            : chunks[i];

          await sendTelegramMessage(TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, chunkText);

          // Delay between messages to avoid rate limiting (500ms)
          if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        setIsSuccess(true);
      } else {
        // No Telegram config - show error
        console.error('Telegram credentials not configured');
        setSubmitError(language === 'ru'
          ? 'Ошибка конфигурации. Пожалуйста, свяжитесь с нами напрямую.'
          : 'Configuration error. Please contact us directly.');
      }
    } catch (error) {
      console.error('Error submitting brief:', error);
      setSubmitError(language === 'ru'
        ? 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую.'
        : 'An error occurred while sending. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Product Type
        return (
          <>
            <SectionTitle><FaLaptopCode /> {t.productTypeTitle}</SectionTitle>
            <SectionSubtitle>{t.productTypeSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.productType}<RequiredMark>*</RequiredMark></Label>
              <RadioGroup>
                {t.productTypeOptions.map((option, index) => (
                  <RadioItem
                    key={index}
                    $checked={formData.productType === option}
                  >
                    <input
                      type="radio"
                      name="productType"
                      checked={formData.productType === option}
                      onChange={() => handleRadioChange('productType', option)}
                    />
                    <Radio $checked={formData.productType === option} />
                    <RadioLabel>{option}</RadioLabel>
                  </RadioItem>
                ))}
              </RadioGroup>
            </FormGroup>
          </>
        );

      case 1: // Company Info
        return (
          <>
            <SectionTitle><FaBuilding /> {t.companyTitle}</SectionTitle>
            <SectionSubtitle>{t.companySubtitle}</SectionSubtitle>

            <FormRow>
              <FormGroup>
                <Label>{t.companyName}<RequiredMark>*</RequiredMark></Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder={language === 'ru' ? 'ООО "Компания"' : 'Company Inc.'}
                />
              </FormGroup>
              <FormGroup>
                <Label>{t.businessArea}</Label>
                <Input
                  value={formData.businessArea}
                  onChange={(e) => handleInputChange('businessArea', e.target.value)}
                  placeholder={language === 'ru' ? 'IT, Ритейл, Услуги...' : 'IT, Retail, Services...'}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>{t.contactPerson}<RequiredMark>*</RequiredMark></Label>
                <Input
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder={language === 'ru' ? 'Иван Иванов' : 'John Doe'}
                />
              </FormGroup>
              <FormGroup>
                <Label>{t.phone}<RequiredMark>*</RequiredMark></Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>{t.email}<RequiredMark>*</RequiredMark></Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </FormGroup>
              <FormGroup>
                <Label>{t.currentWebsite}</Label>
                <Input
                  value={formData.currentWebsite}
                  onChange={(e) => handleInputChange('currentWebsite', e.target.value)}
                  placeholder="https://..."
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>{t.companyDescription}</Label>
              <Textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder={language === 'ru' ? 'Расскажите о вашей компании...' : 'Tell us about your company...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.competitiveAdvantages}</Label>
              <Textarea
                value={formData.competitiveAdvantages}
                onChange={(e) => handleInputChange('competitiveAdvantages', e.target.value)}
                placeholder={language === 'ru' ? 'Чем вы отличаетесь от конкурентов?' : 'What makes you different from competitors?'}
              />
            </FormGroup>
          </>
        );

      case 2: // Target Audience
        return (
          <>
            <SectionTitle><FaUsers /> {t.audienceTitle}</SectionTitle>
            <SectionSubtitle>{t.audienceSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.targetAudience}</Label>
              <Textarea
                value={formData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Например: Мужчины 25-45 лет, предприниматели, Россия и СНГ...'
                  : 'E.g.: Men 25-45, entrepreneurs, USA and Europe...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.problemSolved}</Label>
              <Textarea
                value={formData.problemSolved}
                onChange={(e) => handleInputChange('problemSolved', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Какую боль или потребность закрывает ваш продукт?'
                  : 'What pain point or need does your product address?'}
              />
            </FormGroup>
          </>
        );

      case 3: // Goals
        return (
          <>
            <SectionTitle><FaBullseye /> {t.goalsTitle}</SectionTitle>
            <SectionSubtitle>{t.goalsSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.siteGoals}</Label>
              <CheckboxGrid>
                {t.goalOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.siteGoals.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.siteGoals.includes(option)}
                      onChange={() => handleCheckboxChange('siteGoals', option)}
                    />
                    <Checkbox $checked={formData.siteGoals.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            <FormGroup>
              <Label>{t.visitorActions}</Label>
              <Textarea
                value={formData.visitorActions}
                onChange={(e) => handleInputChange('visitorActions', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Оставить заявку, купить товар, позвонить...'
                  : 'Submit a request, buy a product, call...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.kpi}</Label>
              <Textarea
                value={formData.kpi}
                onChange={(e) => handleInputChange('kpi', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Количество заявок, продаж, посещаемость...'
                  : 'Number of leads, sales, traffic...'}
              />
            </FormGroup>
          </>
        );

      case 4: // Structure
        return (
          <>
            <SectionTitle><FaSitemap /> {t.structureTitle}</SectionTitle>
            <SectionSubtitle>{t.structureSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.siteSections}</Label>
              <CheckboxGrid>
                {t.sectionOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.siteSections.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.siteSections.includes(option)}
                      onChange={() => handleCheckboxChange('siteSections', option)}
                    />
                    <Checkbox $checked={formData.siteSections.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            <FormGroup>
              <Label>{t.functionality}</Label>
              <CheckboxGrid>
                {t.functionalityOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.functionality.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.functionality.includes(option)}
                      onChange={() => handleCheckboxChange('functionality', option)}
                    />
                    <Checkbox $checked={formData.functionality.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>
          </>
        );

      case 5: // Design
        return (
          <>
            <SectionTitle><FaPalette /> {t.designTitle}</SectionTitle>
            <SectionSubtitle>{t.designSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.likedWebsites}</Label>
              <Textarea
                value={formData.likedWebsites}
                onChange={(e) => handleInputChange('likedWebsites', e.target.value)}
                placeholder={language === 'ru'
                  ? 'https://example1.com\nhttps://example2.com\nhttps://example3.com'
                  : 'https://example1.com\nhttps://example2.com\nhttps://example3.com'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.whatLiked}</Label>
              <Textarea
                value={formData.whatLiked}
                onChange={(e) => handleInputChange('whatLiked', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Анимации, цвета, структура...'
                  : 'Animations, colors, structure...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.whatDisliked}</Label>
              <Textarea
                value={formData.whatDisliked}
                onChange={(e) => handleInputChange('whatDisliked', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Что точно не хотите видеть на сайте?'
                  : 'What do you definitely not want on the site?'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.brandStyle}</Label>
              <RadioGroup>
                {t.brandOptions.map((option, index) => (
                  <RadioItem
                    key={index}
                    $checked={formData.brandStyle === option}
                  >
                    <input
                      type="radio"
                      name="brandStyle"
                      checked={formData.brandStyle === option}
                      onChange={() => handleRadioChange('brandStyle', option)}
                    />
                    <Radio $checked={formData.brandStyle === option} />
                    <RadioLabel>{option}</RadioLabel>
                  </RadioItem>
                ))}
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <Label>{t.siteMood}</Label>
              <CheckboxGrid $columns={3}>
                {t.moodOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.siteMood.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.siteMood.includes(option)}
                      onChange={() => handleCheckboxChange('siteMood', option)}
                    />
                    <Checkbox $checked={formData.siteMood.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            <FormGroup>
              <Label>{t.colorScheme}</Label>
              <Input
                value={formData.colorScheme}
                onChange={(e) => handleInputChange('colorScheme', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Синий, белый, серый...'
                  : 'Blue, white, gray...'}
              />
            </FormGroup>
          </>
        );

      case 6: { // Technical
        const isWebsite = formData.productType.includes('Веб-сайт') || formData.productType.includes('Website');
        const isMobileApp = formData.productType.includes('Мобильное') || formData.productType.includes('Mobile');
        const isBot = formData.productType.includes('Telegram') || formData.productType.includes('бот');
        const isCRM = formData.productType.includes('CRM');

        return (
          <>
            <SectionTitle><FaCog /> {t.technicalTitle}</SectionTitle>
            <SectionSubtitle>{t.technicalSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{language === 'ru' ? 'Предпочтения по технологиям' : 'Technology preferences'}</Label>
              <CheckboxGrid $columns={3}>
                {t.platformOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.platform.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.platform.includes(option)}
                      onChange={() => handleCheckboxChange('platform', option)}
                    />
                    <Checkbox $checked={formData.platform.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>

            {/* Domain & Hosting - only for websites */}
            {isWebsite && (
              <>
                <FormGroup>
                  <Label>{t.domainHosting}</Label>
                  <RadioGroup>
                    {t.hostingOptions.map((option, index) => (
                      <RadioItem
                        key={index}
                        $checked={formData.domainHosting === option}
                      >
                        <input
                          type="radio"
                          name="domainHosting"
                          checked={formData.domainHosting === option}
                          onChange={() => handleRadioChange('domainHosting', option)}
                        />
                        <Radio $checked={formData.domainHosting === option} />
                        <RadioLabel>{option}</RadioLabel>
                      </RadioItem>
                    ))}
                  </RadioGroup>
                </FormGroup>

                <FormGroup>
                  <Label>{t.domainName}</Label>
                  <Input
                    value={formData.domainName}
                    onChange={(e) => handleInputChange('domainName', e.target.value)}
                    placeholder="example.com"
                  />
                </FormGroup>
              </>
            )}

            {/* Mobile App specific */}
            {isMobileApp && (
              <FormGroup>
                <Label>{language === 'ru' ? 'Платформы' : 'Platforms'}</Label>
                <CheckboxGrid $columns={3}>
                  {(language === 'ru'
                    ? ['iOS', 'Android', 'Кроссплатформенное']
                    : ['iOS', 'Android', 'Cross-platform']
                  ).map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

            {/* Bot specific */}
            {isBot && (
              <FormGroup>
                <Label>{language === 'ru' ? 'Интеграции бота' : 'Bot Integrations'}</Label>
                <CheckboxGrid>
                  {(language === 'ru'
                    ? ['Платежи', 'CRM система', 'Google Sheets', 'База данных', 'Уведомления', 'AI / ChatGPT']
                    : ['Payments', 'CRM system', 'Google Sheets', 'Database', 'Notifications', 'AI / ChatGPT']
                  ).map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

            {/* CRM/Web App specific */}
            {isCRM && (
              <FormGroup>
                <Label>{language === 'ru' ? 'Требования к системе' : 'System Requirements'}</Label>
                <CheckboxGrid>
                  {(language === 'ru'
                    ? ['Облачное решение', 'Локальная установка', 'Мобильная версия', 'Офлайн режим', 'API интеграции', 'Импорт/экспорт данных']
                    : ['Cloud solution', 'Local installation', 'Mobile version', 'Offline mode', 'API integrations', 'Data import/export']
                  ).map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

            {/* General requirements - for websites */}
            {isWebsite && (
              <FormGroup>
                <Label>{t.technicalRequirements}</Label>
                <CheckboxGrid>
                  {t.techRequirements.map((option, index) => (
                    <CheckboxItem
                      key={index}
                      $checked={formData.technicalRequirements.includes(option)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.technicalRequirements.includes(option)}
                        onChange={() => handleCheckboxChange('technicalRequirements', option)}
                      />
                      <Checkbox $checked={formData.technicalRequirements.includes(option)}>
                        <FaCheck />
                      </Checkbox>
                      <CheckboxLabel>{option}</CheckboxLabel>
                    </CheckboxItem>
                  ))}
                </CheckboxGrid>
              </FormGroup>
            )}

          </>
        );
      }

      case 7: // Budget
        return (
          <>
            <SectionTitle><FaCalendarAlt /> {t.budgetTitle}</SectionTitle>
            <SectionSubtitle>{t.budgetSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.launchDate}</Label>
              <Input
                type="text"
                value={formData.launchDate}
                onChange={(e) => handleInputChange('launchDate', e.target.value)}
                placeholder={language === 'ru' ? 'Март 2026' : 'March 2026'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.budget}</Label>
              <RadioGroup>
                {t.budgetOptions.map((option, index) => (
                  <RadioItem
                    key={index}
                    $checked={formData.budget === option}
                  >
                    <input
                      type="radio"
                      name="budget"
                      checked={formData.budget === option}
                      onChange={() => handleRadioChange('budget', option)}
                    />
                    <Radio $checked={formData.budget === option} />
                    <RadioLabel>{option}</RadioLabel>
                  </RadioItem>
                ))}
              </RadioGroup>
            </FormGroup>

            <FormGroup>
              <Label>{t.priority}</Label>
              <CheckboxGrid $columns={3}>
                {t.priorityOptions.map((option, index) => (
                  <CheckboxItem
                    key={index}
                    $checked={formData.priority.includes(option)}
                  >
                    <input
                      type="checkbox"
                      checked={formData.priority.includes(option)}
                      onChange={() => handleCheckboxChange('priority', option)}
                    />
                    <Checkbox $checked={formData.priority.includes(option)}>
                      <FaCheck />
                    </Checkbox>
                    <CheckboxLabel>{option}</CheckboxLabel>
                  </CheckboxItem>
                ))}
              </CheckboxGrid>
            </FormGroup>
          </>
        );

      case 8: // Additional
        return (
          <>
            <SectionTitle><FaCommentAlt /> {t.additionalTitle}</SectionTitle>
            <SectionSubtitle>{t.additionalSubtitle}</SectionSubtitle>

            <FormGroup>
              <Label>{t.decisionMaker}</Label>
              <Input
                value={formData.decisionMaker}
                onChange={(e) => handleInputChange('decisionMaker', e.target.value)}
                placeholder={language === 'ru' ? 'Имя и должность' : 'Name and position'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.preferredContact}</Label>
              <Input
                value={formData.preferredContact}
                onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                placeholder={language === 'ru' ? 'Telegram, WhatsApp, Email...' : 'Telegram, WhatsApp, Email...'}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t.additionalComments}</Label>
              <Textarea
                value={formData.additionalComments}
                onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                placeholder={language === 'ru'
                  ? 'Любая дополнительная информация о проекте...'
                  : 'Any additional information about the project...'}
              />
            </FormGroup>
          </>
        );

      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <PageWrapper>
        <NavBar />
        <BriefContainer data-nav-theme="light">
          <FormCard
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SuccessScreen>
              <SuccessIcon
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <FaCheck />
              </SuccessIcon>
              <SuccessTitle>{t.successTitle}</SuccessTitle>
              <SuccessText>{t.successText}</SuccessText>
              <NavButton $primary onClick={() => navigate('/')}>
                {t.backToHome}
              </NavButton>
            </SuccessScreen>
          </FormCard>
        </BriefContainer>
      </PageWrapper>
    );
  }

  const stepNumber = String(currentStep + 1).padStart(2, '0');
  const totalSteps = String(steps.length).padStart(2, '0');
  const progressPct = ((currentStep + 1) / steps.length) * 100;
  const minutesLeft = Math.max(1, Math.ceil((steps.length - currentStep) * 0.6));

  return (
    <PageWrapper>
      <NavBar surface="light" />

      {/* Top reading-progress bar — fills as the user advances */}
      <TopProgress>
        <TopProgressFill
          initial={false}
          animate={{
            width: `${progressPct}%`,
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            width: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
            backgroundPosition: { duration: 6, ease: 'linear', repeat: Infinity },
          }}
        />
      </TopProgress>

      <BriefHero>
        <BriefHeroInner>
          <BackButton
            onClick={() => navigate('/')}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaArrowLeft /> {t.back}
          </BackButton>

          <Logo>SINTARA · BRIEF</Logo>
          <Title
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.title}
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.subtitle}
          </Subtitle>

          <AutoSave
            className={saveStatus === 'saving' ? 'saving' : ''}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="pulse" />
            {saveStatus === 'saving' ? (
              language === 'ru' ? <>Сохраняю…</> : <>Saving…</>
            ) : (
              language === 'ru' ? <><strong>Сохранено</strong> · только что</> : <><strong>Saved</strong> · just now</>
            )}
          </AutoSave>
        </BriefHeroInner>
      </BriefHero>

      <BriefContainer data-nav-theme="light">
        <Sidebar>
          {/* Mobile horizontal strip */}
          <SidebarStrip>
            {steps.map((step, index) => (
              <StripItem
                key={index}
                $active={index === currentStep}
                $completed={index < currentStep}
                onClick={() => setCurrentStep(index)}
                aria-label={`Step ${index + 1}: ${step.label}`}
              >
                <step.icon />
                {step.label}
              </StripItem>
            ))}
          </SidebarStrip>

          <SidebarSticky>
            <StepCounter>
              <BigNumber>
                <NumberSlot aria-label={`Step ${stepNumber}`}>
                  <AnimatePresence mode="popLayout">
                    {stepNumber.split('').map((digit, i) => (
                      <NumberDigit
                        key={`${i}-${digit}`}
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: '-100%', opacity: 0 }}
                        transition={{
                          duration: 0.55,
                          ease: [0.16, 1, 0.3, 1],
                          delay: i * 0.04,
                        }}
                      >
                        {digit}
                      </NumberDigit>
                    ))}
                  </AnimatePresence>
                </NumberSlot>
              </BigNumber>
              <NumberMeta>
                <span>{t.stepEyebrow}</span>
                <span className="of">{t.stepOf} {totalSteps}</span>
              </NumberMeta>
            </StepCounter>

            <SidebarProgress $progress={progressPct} aria-hidden="true" />

            <StepNav>
              {steps.map((step, index) => {
                const active = index === currentStep;
                const completed = index < currentStep;
                return (
                  <NavStep
                    key={index}
                    $active={active}
                    $completed={completed}
                    onClick={() => setCurrentStep(index)}
                  >
                    <span className="marker">
                      {completed ? (
                        <motion.span
                          className="check"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <FaCheck />
                        </motion.span>
                      ) : (
                        String(index + 1).padStart(2, '0')
                      )}
                    </span>
                    <span className="body">
                      <step.icon />
                      {step.label}
                    </span>
                  </NavStep>
                );
              })}
            </StepNav>

            <Estimate>
              <span className="dot" />
              {t.estimatePrefix} <strong>{minutesLeft} {t.estimateUnit}</strong> {t.estimateRemaining}
            </Estimate>
          </SidebarSticky>
        </Sidebar>

        <FormCard
          key={currentStep}
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <CardWatermark aria-hidden="true">{stepNumber}</CardWatermark>

          <CardHeader>
            <CardEyebrow>
              {t.stepEyebrow} {stepNumber} / {totalSteps} — {steps[currentStep].label}
            </CardEyebrow>
          </CardHeader>

          <CardBody>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {submitError && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {submitError}
              </ErrorMessage>
            )}

            <NavButtons>
              <NavButton
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <FaArrowLeft /> {t.prev}
              </NavButton>

              {currentStep === steps.length - 1 ? (
                <NavButton
                  as={motion.button}
                  $primary
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  onMouseMove={handleMagnetMove}
                  onMouseLeave={handleMagnetLeave}
                  style={{ x: springX, y: springY }}
                >
                  {isSubmitting ? '...' : t.submit} <FaPaperPlane />
                </NavButton>
              ) : (
                <NavButton
                  as={motion.button}
                  $primary
                  onClick={nextStep}
                  onMouseMove={handleMagnetMove}
                  onMouseLeave={handleMagnetLeave}
                  style={{ x: springX, y: springY }}
                >
                  {t.next} <FaArrowRight />
                </NavButton>
              )}
            </NavButtons>
          </CardBody>
        </FormCard>
      </BriefContainer>
    </PageWrapper>
  );
});

Brief.displayName = 'Brief';

export default Brief;
