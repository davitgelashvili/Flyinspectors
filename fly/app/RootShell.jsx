// ორივე root layout-ის (საიტი და ადმინი) საერთო გარსი. lang იმ layout-იდან მოდის, რომელიც
// ამ გარსს იყენებს — ასე <html lang> სერვერზე სწორი ენით იხატება (SEO), JS-ის გარეშეც.
import Script from 'next/script'
import Providers from './providers'
import ScrollToTop from './ScrollToTop'
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import './globals.scss'

export default function RootShell({ lang, children }) {
  return (
    <html lang={lang}>
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1400277778859172');
              fbq('track', 'PageView');
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18089922391"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18089922391');
            `,
          }}
        />
        <Script
          src="https://upload-widget.cloudinary.com/latest/global/all.js"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  )
}
