# Changelog

All notable changes to the CLI Proxy Dashboard will be documented in this file.

## [2.0.0] - 2026-02-01

### Added
- **Complete UI Redesign**: Glassmorphism design system with emerald/teal gradient theme
- **GitHub Copilot OAuth**: Full device flow integration with QR code and browser launch
- **Activity Page**: New page for monitoring request logs and activity in real-time
- **Enhanced Charts**: Gradient area charts for usage visualization with better aesthetics
- **Model Leaderboard**: Visual ranking with gold/silver/bronze medals for top models
- **Cost Savings Tracker**: Monitor cost savings from caching and routing optimizations
- **Expanded Settings**: 20+ new settings from CLIProxyAPIPlus now configurable via UI
- **GSAP Animations**: Smooth page transitions, modal animations, and interactive effects
- **AnimatedNumber Component**: Count-up animations for statistics and metrics
- **Toast Notifications**: Improved slide-in notifications with better UX
- **Responsive Bento Grid**: Dashboard cards in adaptive grid layout
- **Session Management**: Enhanced API key management with copy-to-clipboard
- **OAuth Excluded Models**: Configure model exclusions for OAuth providers

### Changed
- **Complete Design System Overhaul**: New design tokens, color palette, and typography
- **Enhanced Dark/Light Modes**: Better contrast ratios meeting WCAG AA standards
- **Improved Responsive Layouts**: Better mobile and tablet experience
- **Better Accessibility**: ARIA labels, keyboard navigation, focus management
- **Optimized Bundle**: Single-file output at 546KB gzipped (1.7MB uncompressed)
- **Updated Navigation**: Cleaner sidebar with better iconography
- **Refined Modal System**: GSAP-powered entrance/exit animations
- **Enhanced Form Controls**: Better styling for inputs, selects, and toggles

### Fixed
- Improved type safety across all components
- Better error handling in API calls
- Fixed focus management in modals
- Resolved layout shift issues
- Better reduced-motion support for accessibility

## [1.0.0] - Previous Versions

### Features
- Basic dashboard for CLI Proxy API management
- API key management
- Provider configuration (Gemini, Claude, OpenAI-compatible)
- Auth file upload/management
- Usage statistics and charts
- Config file editing with YAML syntax highlighting
- Log viewing and filtering
- System information and model listing

---

**Note**: Version 2.0.0 represents a major redesign focusing on modern UX, better accessibility, and enhanced features while maintaining backward compatibility with CLIProxyAPI ≥ 6.3.0.
