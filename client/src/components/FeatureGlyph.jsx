export default function FeatureGlyph({ icon }) {
  const shared = {
    className: 'feature-glyph',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  switch (icon) {
    case 'campaigns':
      return (
        <svg {...shared}>
          <path d="M4 14V6l11-2v16L4 18v-4Z" />
          <path d="M15 8h3a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-3" />
          <path d="M7 18v2a2 2 0 0 0 2 2h1" />
        </svg>
      )
    case 'chatbot':
      return (
        <svg {...shared}>
          <rect x="4" y="5" width="16" height="12" rx="4" />
          <path d="M9 11h.01M15 11h.01" />
          <path d="M9 17v2l3-2h4" />
        </svg>
      )
    case 'replies':
      return (
        <svg {...shared}>
          <path d="M7 8h10a3 3 0 0 1 0 6H9" />
          <path d="m12 5-5 3 5 3" />
          <path d="m12 13 5 3-5 3" />
        </svg>
      )
    case 'ai':
      return (
        <svg {...shared}>
          <path d="M12 3a5 5 0 0 0-5 5c0 1.6.7 3 1.8 3.9.8.7 1.2 1.5 1.2 2.4V16h4v-1.7c0-.9.4-1.7 1.2-2.4A4.98 4.98 0 0 0 17 8a5 5 0 0 0-5-5Z" />
          <path d="M10 20h4M10.5 16h3" />
        </svg>
      )
    case 'inbox':
      return (
        <svg {...shared}>
          <path d="M4 7h16v10H4z" />
          <path d="M4 13h4l2 3h4l2-3h4" />
        </svg>
      )
    case 'imports':
      return (
        <svg {...shared}>
          <path d="M12 4v11" />
          <path d="m8 11 4 4 4-4" />
          <path d="M5 19h14" />
        </svg>
      )
    case 'integrations':
      return (
        <svg {...shared}>
          <path d="M9 7V5a2 2 0 1 0-4 0v2" />
          <path d="M15 17v2a2 2 0 1 0 4 0v-2" />
          <path d="M9 12h6" />
          <path d="M7 9h4v6H7zM13 9h4v6h-4z" />
        </svg>
      )
    case 'analytics':
      return (
        <svg {...shared}>
          <path d="M5 19V9" />
          <path d="M12 19V5" />
          <path d="M19 19v-8" />
        </svg>
      )
    case 'approved':
      return (
        <svg {...shared}>
          <path d="M12 3 6 5.5v5.8c0 4 2.6 7.7 6 8.7 3.4-1 6-4.7 6-8.7V5.5L12 3Z" />
          <path d="m9.5 12 1.8 1.8 3.7-4" />
        </svg>
      )
    default:
      return null
  }
}
