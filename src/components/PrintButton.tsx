'use client';

/**
 * Print Button Component
 * Triggers print-friendly view
 */
export default function PrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                style={{ minHeight: '44px' }}
                aria-label="Print article"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                </svg>
                <span className="hidden sm:inline">Print</span>
            </button>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          /* Hide unnecessary elements */
          header,
          nav,
          aside,
          .no-print,
          button,
          .sidebar,
          .side-menu,
          .breaking-news,
          .social-share,
          .reading-controls,
          .back-to-top,
          .print-button {
            display: none !important;
          }

          /* Optimize for print */
          body {
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            background: #fff;
          }

          .article-content {
            font-size: 12pt !important;
            max-width: 100% !important;
          }

          /* Add page breaks */
          h1,
          h2,
          h3 {
            page-break-after: avoid;
          }

          img {
            max-width: 100%;
            page-break-inside: avoid;
          }

          /* Show URLs for links */
          a[href]:after {
            content: ' (' attr(href) ')';
            font-size: 0.8em;
            color: #666;
          }

          /* Page margins */
          @page {
            margin: 2cm;
          }
        }
      `}</style>
        </>
    );
}
