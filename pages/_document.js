import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script src="https://cdn.jsdelivr.net/npm/apexcharts" />
        <Script src="https://cdn.jsdelivr.net/npm/react-apexcharts" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        {/* Poppins */}
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-black">
        <Main />
        <NextScript />
      </body>
      <script type="text/javascript">
        window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src="https://cdn.heapanalytics.com/js/heap-"+e+".js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(r,a);for(var n=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],o=0;o<p.length;o++)heap[p[o]]=n(p[o])};
        heap.load("1125017766");
      </script>
    </Html>
  )
}
