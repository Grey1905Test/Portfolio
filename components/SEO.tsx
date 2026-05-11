import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export default function SEO({
  title = "Surya Sundar | Data Engineer & Full Stack Developer",
  description = "Data Engineer & Full Stack Developer with expertise in Apache Spark, Databricks, ETL pipelines, React, Next.js, and Machine Learning.",
  keywords = [],
  ogImage = "/og-image.png",
  ogType = "website",
  canonicalUrl,
}: SEOProps) {
  const baseUrl = 'https://portfoliowebsite-kohl-eta.vercel.app';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;

  const defaultKeywords = [
    "Surya Sundar",
    "Data Engineer",
    "Full Stack Developer",
    "Apache Spark",
    "Databricks",
    "ETL Pipelines",
    "React",
    "Next.js",
    "Python",
    "Machine Learning",
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(", ");

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Canonical */}
      <link rel="canonical" href={fullCanonicalUrl} />
    </Head>
  );
}
