import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'MM Fashion World';
const DEFAULT_DESC = 'MM Fashion World - আপনার পছন্দের ফ্যাশন প্রোডাক্ট এখন হাতের মুঠোয়।';

const Seo = ({
  title,
  description,
  canonical,
  image,
  robots = 'index,follow',
  noindex = false,
  type = 'website', // website/article/product
  schema = null, // JSON-LD schema object (optional)
  twitterCard = 'summary_large_image'
}) => {
  const { pathname, search } = useLocation();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = canonical || (origin ? `${origin}${pathname}${search}` : '');

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDesc = description || DEFAULT_DESC;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : robots} />
      {url ? <link rel="canonical" href={url} /> : null}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content={type} />
      {url ? <meta property="og:url" content={url} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      {image ? <meta name="twitter:image" content={image} /> : null}

      {/* JSON-LD Schema */}
      {schema ? (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ) : null}
    </Helmet>
  );
};

export default Seo;